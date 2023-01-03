import { Node } from "./node";
export interface IGraph {
    nodes?: Array<Node>;
    id: number;
    name: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
}
export class Graph implements IGraph {
    nodes = Array<Node>();
    nextNodeId: number = 0;
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;

    constructor(g: IGraph) {
        this.id = g.id;
        this.name = g.name;
        this.description = g.description;
        const now = new Date();
        this.created_at = g?.created_at || now;
        this.updated_at = g?.updated_at || now;
        if (Array.isArray(g.nodes)) {
            g?.nodes && g.nodes.forEach((node: any) => {
                const newNode = new Node(node.id, node.tooltip);
                this.nextNodeId = node.id;
                if (node.nighbours) {
                    node.nighbours.forEach((n: number) => {
                        newNode.addNeighbour({ id: n })
                    });
                }
                this.nodes.push(newNode);
                this.nextNodeId++;
            });
        } else {

        }
    }

    /**
     * adds a new node to the graph
     * @param {string} tooltip
     * @returns {Node}
     */
    addNode(tooltip: string): Node {
        const node = new Node(this.nextNodeId, tooltip);
        this.nodes.push(node);
        this.nextNodeId++;
        return node;
    }

    /**
     * remove a node from the graph
     * @param {number} id
     * @returns {Node | null}
     */

    removeNode(id: number) {
        const nodeToBeRemoved = this.nodes.findIndex((n) => n.id == id);
        if (nodeToBeRemoved >= 0) {
            this.nodes.forEach((node) => {
                if (node && node.nighbours.includes(id)) {
                    node.removeNeighbour(this.nodes[nodeToBeRemoved])
                }
            });
            this.nodes.splice(nodeToBeRemoved, 1);
        }
        return nodeToBeRemoved;
    }

    /**
     * add an edge to the graph
     * @param source
     * @param destination
     */
    addEdge(srcNodeId: number, destNodeId: number): boolean {
        const srcNode: Node | undefined = this.nodes.find((e: any) => e.id == srcNodeId);
        const destNode: Node | undefined = this.nodes.find((e: any) => e.id == destNodeId);
        if (srcNode && destNode) {
            srcNode.addNeighbour(destNode);
            return true;
        }
        return false;
    }

    /**
     * remove an edge from the graph
     * @param source
     * @param destination
     */
    removeEdge(srcNodeId: number, destNodeId: number): boolean {
        const srcNode: Node | undefined = this.nodes.find((e: any) => e.id == srcNodeId);
        const destNode: Node | undefined = this.nodes.find((e: any) => e.id == destNodeId);
        if (srcNode && destNode) {
            srcNode.removeNeighbour(destNode);
            destNode.removeNeighbour(srcNode);
            return true;
        }
        return false;
    }

    /**
     * check if an edge exists in the graph
     * @param source
     * @param destination
     */
    hasEdge(srcNodeId: number, destNodeId: number): boolean {
        const srcNode: Node | undefined = this.nodes.find((e: any) => e.id == srcNodeId);
        const destNode: Node | undefined = this.nodes.find((e: any) => e.id == destNodeId);
        if (srcNode && destNode) {
            return srcNode.hasNeighbour(destNode) || destNode.hasNeighbour(srcNode);
        }
        return false;
    }

    toDrawable() {
        const drawableGraph: any = {
            nodes: [],
            links: []
        };
        this.nodes.forEach((v, k) => {
            drawableGraph.nodes.push({
                id: v.id.toString(),
                shape: {
                    type: 'circle'
                },
                payload: {
                    title: v.id.toString(),
                    tooltip: v.tooltip
                }
            });
            v.nighbours.forEach((n) => {
                drawableGraph.links.push({
                    source: v.id.toString(),
                    target: n,
                    directed: true,
                    strength: 'weak',
                });
            })
        })

        return drawableGraph;
    }
}
