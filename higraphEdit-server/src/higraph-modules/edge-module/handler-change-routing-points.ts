import { ChangeRoutingPointsOperation, Command, GEdge, JsonOperationHandler, MaybePromise, Point } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { HigraphEditModelState } from "../../model/higraphedit-model-state";
import { BinaryEdge } from "./edge-model";

@injectable()
export class ChangeRoutingPointsHandler extends JsonOperationHandler {
    override operationType = ChangeRoutingPointsOperation.KIND;

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: ChangeRoutingPointsOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            operation.newRoutingPoints.forEach(element => this.changeEdgeRoutingPoints(element.elementId, element.newRoutingPoints));
        });
    }
    changeEdgeRoutingPoints(elementId: string, newRoutingPoints: Point[] | undefined): void {
        const index = this.modelState.index;
        const transitionNode = index.findByClass(elementId, GEdge);
        const edge = transitionNode ? index.findElement(transitionNode.id) : undefined;
        if (edge && BinaryEdge.is(edge)) {
            if(newRoutingPoints)
                edge.routingPoints = newRoutingPoints;
        }
    }
}
