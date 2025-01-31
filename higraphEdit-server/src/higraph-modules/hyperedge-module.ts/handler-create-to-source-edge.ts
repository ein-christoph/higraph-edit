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
import { Command, CreateEdgeOperation, GLSPServerError, JsonCreateEdgeOperationHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from '../../model/higraphedit-model-state';
import { HyperEdge, HyperEdgeToSourceEdge } from './hyperedge-model';

@injectable()
export class CreateHyperEdgeToSourceEdge extends JsonCreateEdgeOperationHandler {
    readonly elementTypeIds = ['edge:hyperedge:toSourceEdge'];

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: CreateEdgeOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {

            const index = this.modelState.index;
            const hyperedgeElement = index.findElement(operation.targetElementId);
            if(HyperEdge.is(hyperedgeElement)){
                const edge: HyperEdgeToSourceEdge = {
                    routingPoints: [],
                    sourceId: operation.sourceElementId
                };
                hyperedgeElement.toSourceEdges.push(edge);
            }else
                throw new GLSPServerError("Pratial to source edge could not be created because target is not a hyperedge!");
        });
    }

    static get sLabel(): string {
        return 'HyperEdge: To Source Edge';
    }

    get label(): string {
        return CreateHyperEdgeToSourceEdge.sLabel;
    }
}
