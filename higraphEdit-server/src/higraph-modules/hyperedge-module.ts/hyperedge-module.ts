import { GEdge, GModelElement, GPort, InstanceMultiBinding, Marker, OperationHandlerConstructor } from "@eclipse-glsp/server";
import { HyperEdge } from "./hyperedge-model";
import { CreateHyperEdgeHandler } from "./handler-create-hyperedge";
import { HigraphEditEmptyValidator, HigraphEditModule } from "../../configuration/higraphedit-moduleregistry";
import { HigraphPlConfiguration } from "../../configuration/higraph-pl-configuration";
import { CreateHyperEdgeToSourceEdge } from "./handler-create-to-source-edge";
import { CreateHyperEdgeToTargetEdge } from "./handler-create-to-target-edge";

export class HyperEdgeModule implements HigraphEditModule<HyperEdge>{
    
    public validator = new HigraphEditEmptyValidator();
    
    public moduleName: string = "HyperEdge";

    protected higraphPlConfiguration:HigraphPlConfiguration = HigraphPlConfiguration.instance;

    public createElement(hyperEdge:HyperEdge):GModelElement[]{
            const returnMap:GModelElement[] = [];
            
            const connectorNode = GPort.builder().size(10, 10).type("hyperedge:connector").addCssClass("highlight-on-hover").id(hyperEdge.id).position(hyperEdge.position).build();
            returnMap.push(connectorNode);
    
            for(let i = 0; i < hyperEdge.toSourceEdges.length; i++){
                const sourceEdge = GEdge.builder()
                                        .id(hyperEdge.id+"s"+i)
                                        .type("edge:hyperedge:toSourceEdge")
                                        .addCssClass('tasklist-transition')
                                        .sourceId(hyperEdge.toSourceEdges[i].sourceId)
                                        .targetId(connectorNode.id)
                                        .addRoutingPoints(hyperEdge.toSourceEdges[i].routingPoints)
                                        .build();
                returnMap.push(sourceEdge);
            }
    
            for(let i = 0; i < hyperEdge.toTargetEdges.length; i++){
                const sourceEdge = GEdge.builder()
                                        .id(hyperEdge.id+"t"+i)
                                        .type("edge:hyperedge:toTargetEdge")
                                        .addCssClass("tasklist-transition")
                                        .sourceId(connectorNode.id)
                                        .targetId(hyperEdge.toTargetEdges[i].targetId)
                                        .addRoutingPoints(hyperEdge.toTargetEdges[i].routingPoints)
                                        .build();
                returnMap.push(sourceEdge);
            }
    
            return returnMap;
    }

    public configureCreateHandler(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        binding.add(CreateHyperEdgeHandler);
        if(this.higraphPlConfiguration.isFeatureActive("UndirectedEdge"))
                    binding.add(CreateHyperEdgeToSourceEdge);
                if(this.higraphPlConfiguration.isFeatureActive("DirectedEdge"))
                    binding.add(CreateHyperEdgeToTargetEdge);
    }
    public canCreateElement(object: any): object is HyperEdge | undefined {
        return HyperEdge.is(object);
    }

    public validateElement(validationElement:GModelElement, element:HyperEdge, elements:GModelElement[]):Marker[]{
        const markers:Marker[] = [];
        return markers;
    }

    configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {};

}
