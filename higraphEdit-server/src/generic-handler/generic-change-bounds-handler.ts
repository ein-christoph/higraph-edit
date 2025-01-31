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

import { ChangeBoundsOperation, Command, Dimension, GLSPServerError, JsonOperationHandler, MaybePromise, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from '../model/higraphedit-model-state';
import { HyperEdge } from '../higraph-modules/hyperedge-module.ts/hyperedge-model';
import { BasicBlobNode } from '../higraph-modules/blob-module/blob-model';
import { CartesianProductBlobNode } from '../higraph-modules/CartesianProduct-module/CartesianProduct-model';
import { BlobValidator } from '../higraph-modules/blob-module/blob-validator';

@injectable()
export class GenericChangeBoundsHandler extends JsonOperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: ChangeBoundsOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            operation.newBounds.forEach(element => this.changeElementBounds(element.elementId, element.newSize, element.newPosition));
        });
    }

    protected changeElementBounds(elementId: string, newSize: Dimension, newPosition?: Point): void {
        const index = this.modelState.index; // get model Index

        //If we have a connector Node we need to manipulate the Hyperedge
        const hyperEdge = index.findEdge(elementId);
        if(hyperEdge && newPosition){
            if(HyperEdge.is(hyperEdge))
                hyperEdge.position = newPosition
            else
                throw new GLSPServerError("[GenericChangeBoundsHandler] Edge with ID="+elementId+" was expected to ba an hyperedge but isnt");
            return;
        }

        // try to find element from index
        const modifiedBlob = index.findBlob(elementId);
        if(!modifiedBlob)
            throw new GLSPServerError("[GenericChangeBoundsHandler] could not find element with ID="+elementId);
        
        //set size of blob
        modifiedBlob.size = newSize;

        //is new position is present set new position
        if(newPosition)
            modifiedBlob.position = newPosition;

        // check which blobs enclose the modified blob and which blobs get fully enclosed by the modified blob
        // to update the subblob arrays
        // This function is super inefficient but does the job for now
        const otherBlobs: BasicBlobNode[] = this.modelState.index.getAllByClass(BasicBlobNode)
        otherBlobs.push(...this.modelState.index.getAllByClass(CartesianProductBlobNode))
        for(const otherBlob of otherBlobs){
            if(otherBlob.id === modifiedBlob.id)
                continue;
            

            //add the modified blob to subblob list of blobs now enclosing the modified blob
            if(BlobValidator.aEnclosesB(otherBlob,modifiedBlob) && !otherBlob.subblobIDs.includes(modifiedBlob.id))
                    otherBlob.subblobIDs.push(modifiedBlob.id) 

            //remove the modified blob from subblob list of blob not longer enclosing modified blob
            if(!BlobValidator.aEnclosesB(otherBlob,modifiedBlob) && otherBlob.subblobIDs.includes(modifiedBlob.id))
                otherBlob.subblobIDs = otherBlob.subblobIDs.filter((id) => id != modifiedBlob.id)
                
            // add new other blob ids to modified blob id if it is newly enclosed
            if(BlobValidator.aEnclosesB(modifiedBlob,otherBlob) && !modifiedBlob.subblobIDs.includes(otherBlob.id))
                modifiedBlob.subblobIDs.push(otherBlob.id) 

            //remove other blob id from subblob list of modified blob it is no longer enclosed
            if(!BlobValidator.aEnclosesB(modifiedBlob,otherBlob) && modifiedBlob.subblobIDs.includes(otherBlob.id))
                modifiedBlob.subblobIDs = modifiedBlob.subblobIDs.filter((id) => id != otherBlob.id)
        }
    }
}
