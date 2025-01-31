import { Command, CreateEdgeOperation, GLSPServerError, JsonCreateEdgeOperationHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from '../../model/higraphedit-model-state';
import * as uuid from 'uuid';
import { HyperEdge } from './hyperedge-model';

@injectable()
export class CreateHyperEdgeHandler extends JsonCreateEdgeOperationHandler {
    readonly elementTypeIds = ["HyperEdge"];

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    override createCommand(operation: CreateEdgeOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {

            //get source and target elements to get their positions
            const index = this.modelState.index;
            const targetElement = index.findElement(operation.targetElementId)
            if(!targetElement){
                throw new GLSPServerError("can not create hyperedge because target is not indexed!");
                return;
            }

            const sourceElement = index.findElement(operation.sourceElementId)
            if(!sourceElement)
                throw new GLSPServerError("can not create hyperedge because source is not indexed!");
            

            //calculate position of connector edge in between the points
            const sourcePosition = (HyperEdge.isElementWithPosition(sourceElement) && HyperEdge.isPosition(sourceElement.position)) ? sourceElement.position : undefined;
            const targetPosition = (HyperEdge.isElementWithPosition(targetElement) && HyperEdge.isPosition(targetElement.position)) ? targetElement.position : undefined;

            let connectorPosition = {x:0,y:0};

            if(sourcePosition && targetPosition){
                connectorPosition.x = (sourcePosition.x+targetPosition.x)/2;
                connectorPosition.y = (sourcePosition.y+targetPosition.y)/2;
            }else
                throw new GLSPServerError("Could not determine position of connectornode while creating hyperedge");
                
            

            const hyperEdged:HyperEdge = {
                id: uuid.v4(),
                toTargetEdges: [{targetId: targetElement.id, routingPoints: []}],
                toSourceEdges: [{sourceId: sourceElement.id, routingPoints:[]}],
                position: connectorPosition
            }
            this.modelState.sourceModel.edges.push(hyperEdged);
        });
    }

    get label(): string {
        return 'HyperEdge';
    }
}