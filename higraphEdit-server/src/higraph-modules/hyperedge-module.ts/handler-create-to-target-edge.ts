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
import { HyperEdge, HyperEdgeToTargetEdge } from './hyperedge-model';

@injectable()
export class CreateHyperEdgeToTargetEdge extends JsonCreateEdgeOperationHandler {
    readonly elementTypeIds = ['edge:hyperedge:toTargetEdge'];

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: CreateEdgeOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {

            const index = this.modelState.index;
            const hyperedgeElement = index.findElement(operation.sourceElementId);
            if(HyperEdge.is(hyperedgeElement)){
                const edge: HyperEdgeToTargetEdge = {
                    routingPoints: [],
                    targetId: operation.targetElementId
                };
                hyperedgeElement.toTargetEdges.push(edge);
            }else
                throw new GLSPServerError("Pratial to target edge could not be created because source is not a hyperedge!");
        });
    }

    static get sLabel(): string {
        return 'HyperEdge: To Target Edge';
    }

    get label(): string {
        return CreateHyperEdgeToTargetEdge.sLabel;
    }
}
