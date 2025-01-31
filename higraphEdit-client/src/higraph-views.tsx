/** @jsx svg */
import { angleOfPoint, BezierCurveEdgeView, GEdge, GNode, Hoverable, Point, PolylineEdgeView, RenderingContext, RoundedCornerNodeView, Selectable, svg, toDegrees } from "@eclipse-glsp/client";

import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

@injectable()
export class EdgeView extends PolylineEdgeView {

    protected override renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[] {
        const additionals = super.renderAdditionals(edge, segments, context);
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        const arrow = (
            <path
                class-sprotty-edge={true}
                class-arrow={true}
                d='M 1,0 L 10,-4 L 10,4 Z'
                transform={`rotate(${toDegrees(angleOfPoint(Point.subtract(p1, p2)))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
            />
        );
        additionals.push(arrow);
        return additionals;
    }
}


@injectable()
export class CartesianProductView extends RoundedCornerNodeView{
    override render(node: Readonly<GNode & Hoverable & Selectable>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        return <g>
            <rect class-sprotty-node={node instanceof GNode}
                  class-mouseover={node.hoverFeedback} class-selected={node.selected}
                  x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
            {context.renderChildren(node)}
            <line x1={node.bounds.width/2} y1={0} x2={node.bounds.width/2} y2={node.bounds.height} stroke-dasharray="4" />
        </g>;
    }
}

@injectable()
export class NotQuiteSureBlobView extends RoundedCornerNodeView{
    override render(node: Readonly<GNode & Hoverable & Selectable>, context: RenderingContext): VNode | undefined {

        if (!this.isVisible(node, context)) {
            return undefined;
        }
        //adding stroke-dasharray="4" to represent the visual change
        return <g>
            <rect class-sprotty-node={node instanceof GNode}
                  class-mouseover={node.hoverFeedback} class-selected={node.selected}
                  x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}
                  stroke-dasharray="4"></rect>
            {context.renderChildren(node)}
        </g>;
    }
}
    

/*
@injectable()
export class CartesianProductView2 extends GNodeV {
    override render(compartment: Readonly<GCompartment>, context: RenderingContext, args?: IViewArgs): VNode | undefined {

        console.info("render in CartesianProductView")

        const translate = `translate(${compartment.bounds.x}, ${compartment.bounds.y})`;
        const vnode = <g transform={translate} class-sprotty-comp="{true}">
            {context.renderChildren(compartment)}
            {
            //draw horizontalline
            }
            <line x1={compartment.bounds.x+compartment.bounds.width/2} y1={compartment.bounds.y} x2={compartment.bounds.x+compartment.bounds.width/2} y2={compartment.bounds.y+compartment.bounds.height} stroke-dasharray="4" />
        </g>;
        const subType = getSubType(compartment);
        if (subType)
            setAttr(vnode, 'class', subType);
        return vnode;
    }
}
    */

@injectable()
export class HyperEdgeView extends BezierCurveEdgeView {

    protected override renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[] {

        console.info("renderAdditionals call  from HyperEdgeView");

        const additionals = super.renderAdditionals(edge, segments, context);
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        const arrow = (
            <path
                class-sprotty-edge={true}
                class-arrow={true}
                d='M 1,0 L 10,-4 L 10,4 Z'
                transform={`rotate(${toDegrees(angleOfPoint(Point.subtract(p1, p2)))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
            />
        );
        additionals.push(arrow);
        return additionals;
    }
}
