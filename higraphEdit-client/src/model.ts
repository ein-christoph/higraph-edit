import { GCompartment, GModelElement, Point } from "@eclipse-glsp/client";

export class HyperEdge extends GModelElement{
    override id: string;
    toTargetIds: string[];
    toSourceIds: string[];
    routingPoints: Point[];
    routerKind?: string;
}

export class CartesianProductBlobNode extends GCompartment{
    l1subblobIds: string[];
    name: string;
    orthogonalComponents: GCompartment[];
}