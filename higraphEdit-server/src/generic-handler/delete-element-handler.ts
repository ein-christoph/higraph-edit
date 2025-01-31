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
import {
    Command,
    DeleteElementOperation,
    GEdge,
    GLSPServerError,
    GNode,
    GPort,
    JsonOperationHandler,
    MaybePromise,
    remove,
    toTypeGuard
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from '../model/higraphedit-model-state';
import { HigraphBlob, HigraphEdge, THigraphModelElement } from '../model/higraph-model';

@injectable()
export class DeleteElementHandler extends JsonOperationHandler {
    readonly operationType = DeleteElementOperation.KIND;

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: DeleteElementOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            operation.elementIds.forEach(elementId => this.delete(elementId));
        });
    }

    protected delete(elementId: string): void {
        const index = this.modelState.index;
        const gModelElement = this.getGModelElementToDelete(elementId);
        const gModelElementId = gModelElement?.id ?? elementId;
        const gEdgeIds = this.getIncomingAndOutgoingEdgeIds(gModelElement);

        [...gEdgeIds, gModelElementId]
            .map(id => index.findElement(id))
            .forEach(modelElement => this.deleteModelElement(modelElement));
    }

    private getGModelElementToDelete(elementId: string): GNode | GEdge | GPort | undefined {
        const index = this.modelState.index;
        const element = index.get(elementId);
        if (element instanceof GNode || element instanceof GEdge || element instanceof GPort) {
            return element;
        }
        return index.findParentElement(elementId, toTypeGuard(GNode)) ?? index.findParentElement(elementId, toTypeGuard(GEdge));
    }

    protected getIncomingAndOutgoingEdgeIds(node: GNode | GEdge | GPort | undefined): string[] {
        return this.getIncomingAndOutgoingEdges(node).map(edge => edge.id);
    }

    protected getIncomingAndOutgoingEdges(node: GNode | GEdge | GPort | undefined): GEdge[] {
        if (node instanceof GNode) {
            return [...this.modelState.index.getIncomingEdges(node), ...this.modelState.index.getOutgoingEdges(node)];
        }
        return [];
    }

    private deleteModelElement(modelElement: THigraphModelElement | undefined): void {
        if (HigraphBlob.is(modelElement)) {
            remove(this.modelState.sourceModel.blobs, modelElement);
        } else if (HigraphEdge.is(modelElement)) {
            remove(this.modelState.sourceModel.edges, modelElement);
        } else
            throw new GLSPServerError("Could not delete Element because its neither a Blob nor a Edge");
    }
}
