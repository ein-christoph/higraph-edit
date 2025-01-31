/** @jsx svg */
import { BezierCurveEdgeView, GEdge, GNode, Hoverable, Point, PolylineEdgeView, RenderingContext, RoundedCornerNodeView, Selectable } from "@eclipse-glsp/client";
import { VNode } from 'snabbdom';
export declare class EdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[];
}
export declare class CartesianProductView extends RoundedCornerNodeView {
    render(node: Readonly<GNode & Hoverable & Selectable>, context: RenderingContext): VNode | undefined;
}
export declare class HyperEdgeView extends BezierCurveEdgeView {
    protected renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[];
}
//# sourceMappingURL=higraph-views.d.ts.map