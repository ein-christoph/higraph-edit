import { GModelElement, Marker, MarkerKind } from "@eclipse-glsp/server";
import { HigraphEditValidator } from "../../configuration/higraphedit-moduleregistry";
import { BasicBlob, BasicBlobNode } from "./blob-model";
import { CartesianProductBlobNode } from "../CartesianProduct-module/CartesianProduct-model";
import { HigraphBlob } from "../../model/higraph-model";
import { HigraphEditModelState } from "../../model/higraphedit-model-state";

export class BlobValidator implements HigraphEditValidator<BasicBlob>{

    public validateElement(validationElement: GModelElement, blob: BasicBlob, elements: GModelElement[], modelState: HigraphEditModelState): Marker[] {
            const markers: Marker[] = [];
        
            console.log("Validator: Validating BlobNode:"+blob.name);
        
            const otherBlobs: BasicBlobNode[] = modelState.index.getAllByClass(BasicBlobNode)
            otherBlobs.push(...modelState.index.getAllByClass(CartesianProductBlobNode))
            for(const otherBlob of otherBlobs){
                if(otherBlob.id === blob.id)
                    continue;

                //check if other blob encloses blob and if so blobs id is included in other blobs subblobids array
                if(BlobValidator.aEnclosesB(otherBlob,blob) && !otherBlob.subblobIDs.includes(blob.id))
                    markers.push({ kind: MarkerKind.ERROR, description: 'This Blob should have '+blob.name+' as subblob but its id is not included in the subblobids!', elementId: otherBlob.id, label: 'Subblob' });

                //check if blob encloses other blob and if so other blobs id is included in blobs subblobids array
                if(BlobValidator.aEnclosesB(blob,otherBlob) && !blob.subblobIDs.includes(otherBlob.id))
                    markers.push({ kind: MarkerKind.ERROR, description: 'This Blob should have '+otherBlob.name+' as subblob but its id is not included in the subblobids!', elementId: blob.id, label: 'Subblob' });
            }
        
            return markers;
    }   

    static aEnclosesB(blobA:HigraphBlob, blobB:HigraphBlob):boolean{
        if(!blobA.size || !blobB.size)
          return false;
        return     blobA.position.x <= blobB.position.x
                && blobA.position.y <= blobB.position.y
                && blobA.position.x+blobA.size.width >= blobB.position.x+blobB.size.width
                && blobA.position.y+blobA.size.height >= blobB.position.y+blobB.size.height;
      }
}