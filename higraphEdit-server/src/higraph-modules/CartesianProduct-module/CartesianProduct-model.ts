import { AnyObject, GCompartment, GCompartmentBuilder, hasArrayProp, hasObjectProp, hasStringProp } from "@eclipse-glsp/server";
import { BasicBlob } from "../blob-module/blob-model";

export interface CartesianProductBlob extends BasicBlob {
    orthogonalComponents: BasicBlob[];
}

export namespace CartesianProductBlob{

    export function is(object: any): object is CartesianProductBlob {
        return (
        AnyObject.is(object) &&
        hasStringProp(object, "id") &&
        hasStringProp(object, "name") &&
        hasObjectProp(object, "position") &&
        hasArrayProp(object, "orthogonalComponents")
        );
    }
}
  
export class CartesianProductBlobNode extends GCompartment implements CartesianProductBlob{
    subblobIDs: string[];
    name: string;
    orthogonalComponents: BasicBlob[];

    static override builder(): CartesianProductBlobNodeBuilder {
        return new CartesianProductBlobNodeBuilder(CartesianProductBlobNode);
    }
}
  
export class CartesianProductBlobNodeBuilder<T extends CartesianProductBlobNode = CartesianProductBlobNode> extends GCompartmentBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
}