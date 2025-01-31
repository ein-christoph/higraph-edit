import { GLabel, GModelElement, InstanceMultiBinding, Marker, OperationHandlerConstructor } from "@eclipse-glsp/server";
import { BasicBlob, BasicBlobNode } from "./blob-model";
import { CreateBlobHandler } from "./handler-create-blob";
import { CartesianProductBlob } from "../CartesianProduct-module/CartesianProduct-model";
import { HigraphEditModule } from "../../configuration/higraphedit-moduleregistry";
import { BlobValidator } from "./blob-validator";
import { HigraphPlConfiguration } from "../../configuration/higraph-pl-configuration";
import { CreateNotQuiteSureBlobHandler } from "./handle-create-notquiresureblob";

export class BasicBlobModule implements HigraphEditModule<BasicBlob>{
    
    public validator = new BlobValidator();

    public moduleName: string = "BasicBlob";

    protected plConfiguration:HigraphPlConfiguration;

    constructor(){
        this.plConfiguration = HigraphPlConfiguration._instance;
    }


    public createElement(basicBlob:BasicBlob): BasicBlobNode[] {
            const layoutOptions = {
                    ["prefWidth"]: basicBlob.size ? basicBlob.size.width: 50,
                    ["prefHeight"]: basicBlob.size ? basicBlob.size.height: 50,
                    };
    
            const builder = BasicBlobNode.builder()
                                         .type(basicBlob.type)
                                         .id(basicBlob.id)
                                         .layout("vbox")
                                         .addCssClass('tasklist-compartment')
                                         .name(basicBlob.name)
                                         .add(GLabel.builder().text(basicBlob.name).id(`${basicBlob.id}_label`).build())
                                         .addLayoutOptions(layoutOptions)
                                         .position(basicBlob.position)
                                         .addLayoutOption('paddingTop', 8)
                                         .addLayoutOption('paddingBottom', 8)
                                         .addLayoutOption('paddingRight', 8)
                                         .addLayoutOption('paddingLeft', 8)
                                         .l1subblobIds(basicBlob.subblobIDs);
    
            return [builder.build()];
    }
    
    public configureCreateHandler(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        binding.add(CreateBlobHandler);
        
        if(this.plConfiguration.isFeatureActive("NotQuiteSureBlob"))
            binding.add(CreateNotQuiteSureBlobHandler);
    }

    public canCreateElement(object: any): object is BasicBlob | undefined {
        return BasicBlob.is(object);
    }

    public validateElement(validationElement:GModelElement, element:CartesianProductBlob, elements:GModelElement[]):Marker[]{
        const markers:Marker[] = [];
        return markers;
    }

    configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {};
}