export interface INode {
    id: number;
    tooltip?: string;
    nighbours? : number[];
}

export class Node implements INode {
    id: number;
    tooltip: string;
    nighbours : number[];
    constructor(id: number, tooltip: string) {
      this.id = id;
      this.tooltip = tooltip;
      this.nighbours = [];
    }

    /**
     * adds a new node as a neighbor
     * @param {Node} node
     */
    addNeighbour(node: INode): void {
        this.nighbours.push(node.id);
    }

    /**
     * removes a node from the list of neighbors
     * @param {Node} node
     * @returns {boolean}
     */
    removeNeighbour(node: INode): boolean {
        const index = this.nighbours.findIndex(
            (nodeId) => nodeId === node.id
        );
        if (index != -1) {
            this.nighbours.splice(index, 1)[0];
            return true;
        }
        return false;
    }

    /**
     * checks if a node exists in the list of neighbors
     * @param {Node} node
     * @returns {boolean}
     */
    hasNeighbour(node: INode): boolean {
        const index = this.nighbours.findIndex(
            (nodeId) => nodeId === node.id
        );
        if (index != -1) {
            return true;
        }
        return false;
    }
}