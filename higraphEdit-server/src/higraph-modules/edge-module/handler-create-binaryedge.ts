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
import { Command, CreateEdgeOperation, DefaultTypes, JsonCreateEdgeOperationHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { HigraphEditModelState } from '../../model/higraphedit-model-state';
import { BinaryEdge } from './edge-model';

@injectable()
export class CreateBinaryEdgeHandler extends JsonCreateEdgeOperationHandler {
    readonly elementTypeIds = [DefaultTypes.EDGE];

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: CreateEdgeOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            const Edge: BinaryEdge = {
                id: uuid.v4(),
                sourceTaskId: operation.sourceElementId,
                targetTaskId: operation.targetElementId,
                routingPoints: [],
                type:DefaultTypes.EDGE
            };
            this.modelState.sourceModel.edges.push(Edge);
        });
    }

    static get sLabel(): string {
        return 'Undirected Edge';
    }

    get label(): string {
        return CreateBinaryEdgeHandler.sLabel;
    }
}
