import { node } from "../node";
import { ISolver } from "./ISolver";

const nodeMap = new Map<string, number>();
export class Solver implements ISolver{
    path: string[] = []
    isVisited: boolean[] = [];
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
        console.log("weeeeeee ", this.forwardPaths)
    }    

    DFS(nodes: node[], u: number, dest: number) {
        if(u == dest) {
            var newPath = new pathInfo();
            this.path.push(this.getByValue(u)!);
            var temp = JSON.parse(JSON.stringify(this.path));
            newPath.path = temp;
            newPath.gain = this.getGain(nodes, newPath)
         //   newPath.gain = totalGain;
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
                   // totalGain = totalGain * index.gain
                    this.DFS(nodes,nodeMap.get(nodes[u].Out[i].name)!, dest);
                }
            // else{
            //
            //  totalGain = totalGain / index.gain
            // }
            // this.gain = this.gain / index.gain;
            }
        this.path.pop();
        this.isVisited[u] = false;
        }
    }


    getGain(nodes: node[], path: pathInfo) {
        var gain = 1;
       for(let j=0; j<path.path.length-1; j++) {
        let x  = nodeMap.get(path.path[j]);
        let y = nodeMap.get(path.path[j+1]);
            for(let i=0; i<nodes[x!].OutLinks.length; i++) {
                if(nodes[x!].OutLinks[i].from == nodes[x!] && nodes[x!].OutLinks[i].to == nodes[y!]) {
                    gain = gain * nodes[x!].OutLinks[i].gain;
                }
            }
        }
        return gain;
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