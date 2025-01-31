import { AnyObject, GCompartment, GCompartmentBuilder, hasArrayProp, hasObjectProp, hasStringProp } from "@eclipse-glsp/server";

export interface BasicBlob {
    id: string;
    name: string;
    position: { x: number; y: number };
    subblobIDs: string[];
    size?: { width: number; height: number };
    type: string;
}

export namespace BasicBlob{

    export function is(object: any): object is BasicBlob {
        return (
        AnyObject.is(object) &&
        hasStringProp(object, "id") &&
        hasStringProp(object, "name") &&
        hasObjectProp(object, "position")&&
        !hasArrayProp(object, "orthogonalComponents") &&
        hasStringProp(object, "type")
        );
    }
}
  
export class BasicBlobNode extends GCompartment implements BasicBlob{
    name: string;
    subblobIDs: string[];

    static override builder(): BasicBlobNodeBuilder {
        return new BasicBlobNodeBuilder(BasicBlobNode);
    }
}
  
export class BasicBlobNodeBuilder<T extends BasicBlobNode = BasicBlobNode> extends GCompartmentBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    addSubblob(blobNode: BasicBlobNode): this {
        this.proxy.subblobIDs.push(blobNode.id);
        this.add(blobNode);
        return this;
    }
    l1subblobIds(l1subblobIds: string[]): this {
        this.proxy.subblobIDs = l1subblobIds;
        return this;
    }
}