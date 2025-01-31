import { GCompartment, GModelElement, Point } from "@eclipse-glsp/client";
export declare class HyperEdge extends GModelElement {
    id: string;
    toTargetIds: string[];
    toSourceIds: string[];
    routingPoints: Point[];
    routerKind?: string;
}
export declare class CartesianProductBlobNode extends GCompartment {
    l1subblobIds: string[];
    name: string;
    orthogonalComponents: GCompartment[];
}
//# sourceMappingURL=model.d.ts.map