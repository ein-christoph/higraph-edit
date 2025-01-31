import { GLSPServerError, GModelElement, InstanceMultiBinding, Marker, MarkerKind, OperationHandlerConstructor } from "@eclipse-glsp/server";
import { Higraph, THigraphModelElement } from "../model/higraph-model";
import { BinaryEdge } from "../higraph-modules/edge-module/edge-model";
import { BinaryEdgeModule } from "../higraph-modules/edge-module/edge-module";
import { HigraphPlConfiguration } from "./higraph-pl-configuration";
import { HyperEdge } from "../higraph-modules/hyperedge-module.ts/hyperedge-model";
import { HyperEdgeModule } from "../higraph-modules/hyperedge-module.ts/hyperedge-module";
import { BasicBlob } from "../higraph-modules/blob-module/blob-model";
import { BasicBlobModule } from "../higraph-modules/blob-module/blob-module";
import { CartesianProductBlob } from "../higraph-modules/CartesianProduct-module/CartesianProduct-model";
import { CartesianProductModule } from "../higraph-modules/CartesianProduct-module/CartesianProduct-module";
import { HigraphEditModelState } from "../model/higraphedit-model-state";

export interface HigraphEditValidator<T extends THigraphModelElement>{
    validateElement(validationElement:GModelElement, element:T, elements:GModelElement[], modelState: HigraphEditModelState):Marker[];
}

export class HigraphEditEmptyValidator<T extends THigraphModelElement> implements HigraphEditValidator<T>{
    public validateElement(validationElement:GModelElement, element:T, elements:GModelElement[], modelState: HigraphEditModelState):Marker[]{
        const markers:Marker[] = [];
        return markers;
    }
}

//implementing a singeltin inspired by https://refactoring.guru/design-patterns/singleton/typescript/example
export interface HigraphEditModule<T extends THigraphModelElement>{

 validator: HigraphEditValidator<T>;

 moduleName:string;
 createElement(elementDescription:T):GModelElement[];

 configureCreateHandler(binding: InstanceMultiBinding<OperationHandlerConstructor>): void;
 canCreateElement(object: any): object is T | undefined;
 configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void;
}


export class HigraphEditModuleRegistry{
    static _instance: HigraphEditModuleRegistry
    private modules = new Map<string, HigraphEditModule<THigraphModelElement>>();
    protected plConfiguration: HigraphPlConfiguration;

    private constructor(){
        this.plConfiguration = HigraphPlConfiguration.instance;
    }

    public reload(){

        this.plConfiguration.reloadConfiguration();
        
        this.modules.clear();

        //add Modules
        this.addModule<BinaryEdge>(new BinaryEdgeModule());
        this.addModule<HyperEdge>(new HyperEdgeModule());
        this.addModule<BasicBlob>(new BasicBlobModule());
        this.addModule<CartesianProductBlob>(new CartesianProductModule());
    }

    public static get instance():HigraphEditModuleRegistry{
        if(!HigraphEditModuleRegistry._instance)
            HigraphEditModuleRegistry._instance = new HigraphEditModuleRegistry();

        return HigraphEditModuleRegistry._instance;
    }

    public addModule<T extends THigraphModelElement>(newModule:HigraphEditModule<T>){
        if(this.modules.has(newModule.moduleName))
            throw new GLSPServerError("[HigraphEditModuleRegistry] Can nor register Module with name '"+newModule.moduleName + "' twice!");
        this.modules.set(newModule.moduleName, newModule);
    }

    public configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void{
        //loop through all registered Modules and bind their Operation handlers
        for(const [name, module] of this.modules.entries()){
            //bind create Handler if module is enabled
            if(this.plConfiguration.isFeatureActive(name))
                module.configureCreateHandler(binding);

            //configure all other Handlers
            module.configureOperationHandlers(binding);
        }
    }

    public createModel(definition:Higraph):GModelElement[]{
        const returnModelElements:GModelElement[] = [];

        //Super inefficient but hopefully works
        //go through all edges and find applicable module
        for(const edge of definition.edges){
            for(const [_, module] of this.modules.entries()){
                if(module.canCreateElement(edge)){
                    returnModelElements.push(...module.createElement(edge));
                    continue; // stop after first creation so we dont produce a element twice
                }
            }
        }

        //go through all blobs and find applicable module
        for(const blob of definition.blobs){
            for(const [_, module] of this.modules.entries()){
                if(module.canCreateElement(blob)){
                    returnModelElements.push(...module.createElement(blob));
                    continue; // stop after first creation so we dont produce a element twice
                }
            }
        }

        return returnModelElements;
    }

    public delegateValidation(validationElement:GModelElement, elements: GModelElement[], modelState: HigraphEditModelState):Marker[]{
        const markers: Marker[] = [];

        //Try to find Model element
        const modelElement = modelState.index.findElement(validationElement.id);
        if(!modelElement){
            if(this.plConfiguration.isFeatureActive("debug-marker"))
              markers.push({ kind: MarkerKind.WARNING, description: 'There is no element indexed for this ID!', elementId: validationElement.id, label: 'No Element can be associated' });
            return markers;
        }

        let elementValidated = 0;

        for(const [name, module] of this.modules.entries()){
            if(module.canCreateElement(modelElement)){
                if(this.plConfiguration.isFeatureActive(name)){
                    if(this.plConfiguration.isFeatureActive("debug-marker"))
                        markers.push({ kind: MarkerKind.INFO, description: 'Validated By "'+name, elementId: validationElement.id, label: 'Validated' });

                    markers.push(...module.validator.validateElement(validationElement, modelElement, elements, modelState))
                }else{
                    markers.push({ kind: MarkerKind.ERROR, description: 'This Module would be validated by the module "'+name+" which is not enabled!", elementId: validationElement.id, label: 'Module not enabled!' });
                }
                elementValidated ++;
            }
        }

        // If the element got validated by two validators this 
        // would mean that the element has two applicable Modules 
        // which should not be the case
        if(elementValidated > 1)
            markers.push({ kind: MarkerKind.ERROR, description: 'This element got validated by more than one module!', elementId: validationElement.id, label: 'Multiple applicable modules!' });

        // If no module validated this element is is probably ellegal
        if(elementValidated < 1)
            markers.push({ kind: MarkerKind.ERROR, description: 'No Module was found which could validate this element hence it most likely does not belong in this diagram! ', elementId: validationElement.id, label: 'No module applicable for validation!' });


        return markers;
    }
}