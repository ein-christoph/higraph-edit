import {
  AnyObject,
  hasArrayProp,
  hasStringProp
} from "@eclipse-glsp/server";
import { BinaryEdge } from "../higraph-modules/edge-module/edge-model";
import { BasicBlob } from "../higraph-modules/blob-module/blob-model";
import { HyperEdge } from "../higraph-modules/hyperedge-module.ts/hyperedge-model";
import { CartesianProductBlob } from "../higraph-modules/CartesianProduct-module/CartesianProduct-model";

/**
 * The basic source model for `higraph` GLSP diagrams.
 */
export interface Higraph {
  id: string;
  blobs: HigraphBlob[];
  edges: HigraphEdge[];
}

export namespace Higraph {
  export function is(object: any): object is Higraph {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasArrayProp(object, "blobs") && 
      hasArrayProp(object, "edges")
    );
  }
}

export type HigraphEdge = BinaryEdge | HyperEdge; // Add further Edgetyped here

export namespace HigraphEdge{
  export function is(object: any): object is HigraphEdge {
    return AnyObject.is(object) && (BinaryEdge.is(object) || HyperEdge.is(object));
  }
}
export type HigraphBlob = BasicBlob | CartesianProductBlob //Add further Blob types heer
export namespace HigraphBlob{
  export function is(object: any): object is HigraphBlob {
    return AnyObject.is(object) && (BasicBlob.is(object) || CartesianProductBlob.is(object));
  }
}

export type THigraphModelElement = HigraphEdge | HigraphBlob;