import { LeadingComment } from "@angular/compiler";
import { NodeStyleEventEmitter } from "rxjs/internal/observable/fromEvent";
import { link } from "../link";
import { node } from "../node";
import { ISolver } from "./ISolver";

let forwardPaths: number[][] = [];
let gainStack: number[] = [];
const nodeMap = new Map<string, number>();
export class Solver implements ISolver{
    path: number[] = []
    gain: number = 1;
    isVisited: boolean[] = [];
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
        this.mapNodes(nodes);
        this.isVisited = new Array(nodes.length).fill(false);
        var outLinks = nodes[nodeMap.get(src.name)!].OutLinks;
        let u = nodeMap.get(src.name);
        let v = nodeMap.get(dest.name);
        this.DFS(nodes, u!, v!);
        console.log("weeeeeee ", forwardPaths, gainStack)
        forwardPaths = [];
        gainStack = [];
    }    

    DFS(nodes: node[], u: number, dest: number) {
        if(u == dest) {
            this.path.push(u);
            // forwardPaths.push(this.path);
            gainStack.push(this.gain)
            console.log("path is ", this.path, " and gain is ", this.gain);
            this.path.pop();
        //    return; ?????? check
        }
        else {
            this.path.push(u);
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
