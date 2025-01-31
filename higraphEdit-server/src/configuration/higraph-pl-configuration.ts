import * as fs from "fs";
import * as path from 'path';
import { HigraphJsonConfigLoader } from "./higraph-configuration-loaders";
import { GLSPServerError } from "@eclipse-glsp/server";

export type HigraphFeatureMap = Map<string, string | boolean | number>;

export interface HigraphConfigLoader{
    is(object: any): object is HigraphConfigLoader;
    loadConfig(data:string, featureMap:HigraphFeatureMap):boolean
}

//implementing a singeltin inspired by https://refactoring.guru/design-patterns/singleton/typescript/example
export class HigraphPlConfiguration {

  static _instance: HigraphPlConfiguration

  protected configruationPath =
    path.resolve("./feature-model/higraph-featuremodel.uvl.json");

  protected featureMap:HigraphFeatureMap = new Map<string, string | boolean | number>();
  private isConfigurationLoaded = false;

  private constructor(){
    console.log("Loading feature configuration from: "+this.configruationPath);
    this.reloadConfiguration();
  }

  public static get instance():HigraphPlConfiguration{
    if(!HigraphPlConfiguration._instance)
      HigraphPlConfiguration._instance = new HigraphPlConfiguration();

    return HigraphPlConfiguration._instance;
}

  // reloads the configuration file
  // returns true in successful
  public reloadConfiguration():boolean {
    //get filecontent
    
    if(!fs.existsSync(this.configruationPath)){
      throw new GLSPServerError("No configuration available!");
      return false;
    }

    const data = fs.readFileSync(this.configruationPath, { encoding: "utf8" });

    if (!data || data.length === 0) {
      throw new GLSPServerError("Fehlerhafte Konfiguration");
      return false;
    }
      
    const filetype = this.configruationPath.split(".").at(-1);

    // execute the corresponding loader
    switch (filetype) {
    case "json":
        if(!HigraphJsonConfigLoader.loadConfig(data, this.featureMap))
            throw new GLSPServerError("error on loading or parsing pl JSON configuration");
        console.log("loaded configuration: ");
        console.table(this.featureMap);
        break;
    default:
        throw new GLSPServerError("No loader found for configuration filetype: "+filetype);
        break;
    }

    //check if feature Map contains at least one element otherwise there would have been an error
    if(this.featureMap.size > 0){
        this.isConfigurationLoaded = true;
        return true;
    }else{
        throw new GLSPServerError("featureMap is empty after parsing! No valid configuration could be found");
        return false;
    }

  }

  public isFeatureActive(featurelabel:string):boolean{
    if(!this.isConfigurationLoaded)
        return false; // If we do not have any configuration then the feature can not be present

    //check if the featureMap contains a feature with this label
    if(!this.featureMap.has(featurelabel))
      return false;
    
    const flag = this.featureMap.get(featurelabel)

    //check if its boolean and not just a configuration attribute
    if(typeof flag !== "boolean")
      return false;
   
    //return the boolean which itself indicates wherther the feature should be present
    return flag;
  }
}
