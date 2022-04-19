import { node } from "../node";
import { ISolver } from "./ISolver";

let gainStack: number[] = [];
const nodeMap = new Map<string, number>();
export class Solver implements ISolver{
    path: string[] = []
    gain: number = 1;
    isVisited: boolean[] = [];
    temp!: string;
    forwardPaths!: pathInfo[];
    mapNodes(nodes: node[]) {
        for(let i=0; i<nodes.length; i++) 
            nodeMap.set(nodes[i].name, i);  
    }

    getByValue(searchValue: number) {
        for (let [key, value] of nodeMap.entries()) {
          if (value === searchValue)
            return key;
        }
        return;
      }
      
    public getPaths(nodes: node[], src: node, dest: node) { 
        this.forwardPaths = [];
        this.mapNodes(nodes);
        this.isVisited = new Array(nodes.length).fill(false);
        var outLinks = nodes[nodeMap.get(src.name)!].OutLinks;
        let u = nodeMap.get(src.name);
        let v = nodeMap.get(dest.name);
        this.DFS(nodes, u!, v!);
        console.log("weeeeeee ", this.forwardPaths, gainStack)
    }    

    DFS(nodes: node[], u: number, dest: number) {
        if(u == dest) {
            var newPath = new pathInfo();
            this.path.push(this.getByValue(u)!);
            var temp = JSON.parse(JSON.stringify(this.path));
            newPath.path = temp;
            newPath.gain = this.gain;
            this.forwardPaths.push(newPath);
            this.path.pop();
            // return; ?????? check
        }
        else {
            this.path.push(this.getByValue(u)!);
            this.isVisited[u] = true;
            
            for(let i=0; i<nodes[u].OutLinks.length; i++) {
                let index = nodes[u].OutLinks[i];
                if(this.isVisited[nodeMap.get(index.to.name)!]  == false) { 
                    this.gain = this.gain * index.gain;
                    this.DFS(nodes,nodeMap.get(nodes[u].Out[i].name)!, dest);
                }
                this.gain = this.gain / index.gain;
            }
        this.path.pop();
        this.isVisited[u] = false;
        }
    }
}
class pathInfo {
    path: string[];
    gain: number;
    
    constructor() {
        this.path = [];
        this.gain = 1; 
    }
}