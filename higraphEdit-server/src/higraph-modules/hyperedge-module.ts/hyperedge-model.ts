import { AnyObject, DefaultTypes, GEdge, GModelElement, GModelElementBuilder, GPort, hasArrayProp, hasNumberProp, hasObjectProp, hasStringProp, Point } from "@eclipse-glsp/server";

export interface HyperEdgeToTargetEdge {
    targetId: string;
    routingPoints: Point[];
  }
  
  export interface HyperEdgeToSourceEdge {
      sourceId: string;
      routingPoints: Point[];
    }
  
  export interface HyperEdge {
    id: string;
    toTargetEdges: HyperEdgeToTargetEdge[];
    toSourceEdges: HyperEdgeToSourceEdge[];
    position: { x: number; y: number };
  }
  
  export namespace HyperEdge {

    export function is(object: unknown): object is HyperEdge {
      return (
        AnyObject.is(object) &&
        hasStringProp(object, "id") &&
        hasArrayProp(object, "toTargetEdges") &&
        hasArrayProp(object, "toSourceEdges") &&
        hasObjectProp(object, "position")
      );
    }
  
    //used to dertemine source and target positions
    export interface Position{
      x: number; 
      y: number;
    }
  
    //used to dertemine source and target positions
    export interface ElementWithPosition{
        position: Position;
    }
  
    //used to dertemine source and target positions
    export function isElementWithPosition(object:unknown):object is ElementWithPosition{
      return (
          AnyObject.is(object) &&
          hasObjectProp(object, "position")
      );
    }
  
    //used to dertemine source and target positions
    export function isPosition(object:unknown):object is Position{
      return (
          AnyObject.is(object) &&
          hasNumberProp(object, "x") &&
          hasNumberProp(object, "y")
      );
    }
  }
  
  export class HyperEdgeElement extends GModelElement implements HyperEdge {
    // Idea to realise HyperEdges is to have the connectorPort
    // as intermidiate Blob to which all Edges connect
    // and split the Edge from Blob A to Blob B into a Edge from A to the common ConnectorPort
    // and from the ConnectorPort to Blob B
    override type = DefaultTypes.EDGE;
    private connectorPort: GPort;
    toTargetEdges: HyperEdgeToTargetEdge[] = [];
    toSourceEdges: HyperEdgeToSourceEdge[] = [];
    position: { x: number; y: number } = { x: 0, y: 0 };
    routerKind?: string;
  
    constructor() {
      super();
      this.connectorPort = GPort.builder()
        .id("connectorPort_" + this.id)
        .build();
    }
  
    public getConnector(): GPort {
      return this.connectorPort;
    }
  
    addPosition(position: { x: number; y: number }): this {
      this.position = position;
      return this;
    }
  
    static builder(): HyperEdgeElementBuilder {
      return new HyperEdgeElementBuilder(HyperEdgeElement);
    }
  }
  
  export class HyperEdgeElementBuilder<
    T extends HyperEdgeElement = HyperEdgeElement,
  > extends GModelElementBuilder<T> {
    override build(): T {
      const element = super.build();
      return element;
    }
  
    
    addSourceTransition(sourceId: string): this {
      const id = this.proxy.id + "-sourceEdge" + this.proxy.toSourceEdges.length;
      const edge = GEdge.builder()
        .id(id)
        .sourceId(sourceId)
        .targetId(this.proxy.getConnector().id)
        .build();
      this.proxy.toSourceEdges.push({sourceId: sourceId, routingPoints: []});
      this.proxy.children.push(edge);
      return this;
    }
  
    addTargetTransition(targetId: string): this {
      const id = this.proxy.id + "-targetEdge" + this.proxy.toTargetEdges.length;
      const edge = GEdge.builder()
        .id(id)
        .sourceId(this.proxy.getConnector().id)
        .targetId(targetId)
        .build();
      this.proxy.toTargetEdges.push({targetId: targetId, routingPoints: []});
      this.proxy.children.push(edge);
      return this;
    }
  
  }
  