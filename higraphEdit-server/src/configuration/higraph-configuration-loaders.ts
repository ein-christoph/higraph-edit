import { AnyObject, GLSPServerError, hasObjectProp, hasStringProp } from "@eclipse-glsp/server";
import { HigraphFeatureMap } from "./higraph-pl-configuration";

//=================JSON Config=======================

//Interface for defining how a JsonConfig should look like
export interface HigraphJsonConfig {
    file: string;
    config: {};
}

//Class for JsonConfig
export class HigraphJsonConfigLoader {

    //Function to determine wherther a object could be treated as JsonConfig
    static is(object: any): object is HigraphJsonConfig {
        return AnyObject.is(object) && hasStringProp(object, 'file') && hasObjectProp(object, 'config');
    }

    // loads and parses the configuration to the featureMap 
    // or returns false if the configuration could not be loaded or parsed
    static loadConfig(data:string, featureMap:HigraphFeatureMap):boolean{
        
        const filecontent = JSON.parse(data);
        
        //check if the parsed JSON adheres to the desired interface
        if(!HigraphJsonConfigLoader.is(filecontent)){
            throw new GLSPServerError("configuration file is not of expected type!");
            return false;
        }

        //iterate the config object to build the key value featureMap
        Object.entries(filecontent.config).forEach(([label, config]) => {
            if(typeof config === "string" || typeof config === "boolean" || typeof config === "number")
                featureMap.set(label, config);
            else
                throw new GLSPServerError("feature '"+label+"' has unexpected type and will not be included in the featureMap!");
        })

        //check if feature Map contains at least one element otherwise there would have been an error
        if(featureMap.size > 0)
            return true;
        else{
            throw new GLSPServerError("Json loadConfig probably failed because featureMap is empty after parsing the configuration file!");
            return false;
        }
    }
}