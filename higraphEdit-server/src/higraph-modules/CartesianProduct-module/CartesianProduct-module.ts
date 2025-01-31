import { DefaultTypes, GLabel, InstanceMultiBinding, OperationHandlerConstructor } from "@eclipse-glsp/server";
import { CreateCartesianProductBlobHandler } from "./handler-create-CartesianProduct";
import { CartesianProductBlob, CartesianProductBlobNode } from "./CartesianProduct-model";
import { BasicBlob, BasicBlobNode } from "../blob-module/blob-model";
import { HigraphEditEmptyValidator, HigraphEditModule } from "../../configuration/higraphedit-moduleregistry";

export class CartesianProductModule implements HigraphEditModule<CartesianProductBlob>{
    
    public validator = new HigraphEditEmptyValidator();

    public moduleName: string = "CartesianProduct";

    public createElement(cpBlob:CartesianProductBlob): (CartesianProductBlobNode | BasicBlobNode)[] {
            const returnELements:(CartesianProductBlobNode | BasicBlobNode)[] = [];
            const layoutOptions = {
                    ["prefWidth"]: cpBlob.size ? cpBlob.size.width: 50,
                    ["prefHeight"]: cpBlob.size ? cpBlob.size.height: 50,
                    };
    
            const builder = CartesianProductBlobNode.builder()
                                         .type('blob:CartesianProduct')
                                         .id(cpBlob.id)
                                         .layout("vbox")
                                         .addCssClass('tasklist-compartment')
                                         .addCssClass('crossporduct')
                                         .name(cpBlob.name)
                                         .add(GLabel.builder().text(cpBlob.name).id(`${cpBlob.id}_label`).build())
                                         .addLayoutOptions(layoutOptions)
                                         .position(cpBlob.position)
                                         .addLayoutOption('paddingTop', 8)
                                         .addLayoutOption('paddingBottom', 8)
                                         .addLayoutOption('paddingRight', 8)
                                         .addLayoutOption('paddingLeft', 8)
            
            returnELements.push(builder.build());

            for(const orthogonalComponent of cpBlob.orthogonalComponents){
                const basicBlob = this.createBasicBlobElement(orthogonalComponent);
                returnELements.push(...basicBlob);
            }
    
            return returnELements;
    }

    private createBasicBlobElement(basicBlob:BasicBlob): BasicBlobNode[] {
            const layoutOptions = {
                    ["prefWidth"]: basicBlob.size ? basicBlob.size.width: 50,
                    ["prefHeight"]: basicBlob.size ? basicBlob.size.height: 50,
                    };
    
            const builder = BasicBlobNode.builder()
                                            .type(DefaultTypes.NODE)
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
        binding.add(CreateCartesianProductBlobHandler);
    }

    public canCreateElement(object: any): object is CartesianProductBlob | undefined {
        return CartesianProductBlob.is(object);
    }

    configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {}
}