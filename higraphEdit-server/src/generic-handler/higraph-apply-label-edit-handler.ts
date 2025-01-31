/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import { ApplyLabelEditOperation } from '@eclipse-glsp/protocol';
import { Command, GCompartment, GLSPServerError, JsonOperationHandler, MaybePromise, toTypeGuard } from '@eclipse-glsp/server/node';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from '../model/higraphedit-model-state';

@injectable()
export class HigraphEditApplyLabelEditHandler extends JsonOperationHandler {
    readonly operationType = ApplyLabelEditOperation.KIND;

    @inject(HigraphEditModelState)
    protected override readonly modelState: HigraphEditModelState;

    override createCommand(operation: ApplyLabelEditOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            const index = this.modelState.index;
            // Retrieve the parent node of the label that should be edited
            const parentNode = index.findParentElement(operation.labelId, toTypeGuard(GCompartment));
            //since we look for nodes this could only be defined if we have a blob
            if (parentNode) {
                const blob = index.findBlob(parentNode.id);
                if (!blob) {
                    throw new GLSPServerError(`Could not retrieve the parent task for the label with id ${operation.labelId}`);
                }
                blob.name = operation.text;
            }
        });
    }
}
