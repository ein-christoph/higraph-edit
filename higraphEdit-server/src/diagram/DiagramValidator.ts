import {
  GModelElement,
  Marker,
  ModelValidator,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { HigraphEditModuleRegistry } from "../configuration/higraphedit-moduleregistry";
import { HigraphEditModelState } from "../model/higraphedit-model-state";

@injectable()
export class DiagramValidator implements ModelValidator {
  @inject(HigraphEditModelState)
  protected readonly modelState: HigraphEditModelState;

  private readonly higraphEditModuleRegistry: HigraphEditModuleRegistry;
  
  constructor(){
      this.higraphEditModuleRegistry = HigraphEditModuleRegistry.instance;
  }

  validate(elements: GModelElement[]): Marker[] {
    const markers: Marker[] = [];

    for(const element of elements){
        
        markers.push(...this.higraphEditModuleRegistry.delegateValidation(element, elements, this.modelState));

        if(element.children)
            markers.push(...this.validate(element.children));
    }

    return markers;
  }
}
