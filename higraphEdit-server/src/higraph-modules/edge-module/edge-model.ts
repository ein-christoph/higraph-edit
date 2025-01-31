import { AnyObject, hasArrayProp, hasStringProp, Point } from "@eclipse-glsp/server";

export interface BinaryEdge {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  routingPoints: Point[];
  routerKind?: string;
  type:string;
}

export namespace BinaryEdge{
  export function is(object: any): object is BinaryEdge {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasStringProp(object, "sourceTaskId") &&
      hasStringProp(object, "targetTaskId") &&
      hasArrayProp(object, "routingPoints") &&
      hasStringProp(object, "type")
    );
  }
}