import { GEdge, GModelElement, InstanceMultiBinding, Marker, OperationHandlerConstructor } from "@eclipse-glsp/server";
import { BinaryEdge } from "./edge-model";
import { CreateBinaryEdgeHandler } from "./handler-create-binaryedge";
import { ChangeRoutingPointsHandler } from "./handler-change-routing-points";
import { HigraphEditEmptyValidator, HigraphEditModule } from "../../configuration/higraphedit-moduleregistry";
import { HigraphPlConfiguration } from "../../configuration/higraph-pl-configuration";
import { CreateDirectedBinaryEdgeHandler } from "./handler-create-directedbinaryedge";

export class BinaryEdgeModule implements HigraphEditModule<BinaryEdge>{
    public validator = new HigraphEditEmptyValidator();
    public moduleName = "BinaryEdge";

    protected higraphPlConfiguration:HigraphPlConfiguration = HigraphPlConfiguration.instance;

    public createElement(binaryedge: BinaryEdge): GEdge[] {
        const builder = GEdge.builder()
            .id(binaryedge.id)
            .addCssClass('higraphedit-binaryedge')
            .sourceId(binaryedge.sourceTaskId)
            .targetId(binaryedge.targetTaskId)
            .addRoutingPoints(binaryedge.routingPoints)
            .type(binaryedge.type);
        return [builder.build()];
    }

    public configureCreateHandler(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        if(this.higraphPlConfiguration.isFeatureActive("UndirectedEdge"))
            binding.add(CreateBinaryEdgeHandler);
        if(this.higraphPlConfiguration.isFeatureActive("DirectedEdge"))
            binding.add(CreateDirectedBinaryEdgeHandler);

    }

    public configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        binding.add(ChangeRoutingPointsHandler);
    }

    public validateElement(validationElement:GModelElement, element:BinaryEdge, elements:GModelElement[]):Marker[]{
            const markers:Marker[] = [];
            return markers;
    }

    public canCreateElement(object: any): object is BinaryEdge | undefined {
        return BinaryEdge.is(object);
    }

}