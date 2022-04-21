import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { node } from "../node";
import { ISolver } from "./ISolver";

const nodeMap = new Map<string, number>();
export class Solver implements ISolver{
    path: string[] = []
    loop: string[] = []
    
    isVisited: boolean[] = [];
    forwardPaths!: pathInfo[];
    loops!:pathInfo[];

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
        this.loops=[];

        this.mapNodes(nodes);
        this.isVisited = new Array(nodes.length).fill(false);
        var outLinks = nodes[nodeMap.get(src.name)!].OutLinks;
        let u = nodeMap.get(src.name);
        let v = nodeMap.get(dest.name);
        this.DFS(nodes, u!, v!);
        console.log("weeeeeee ", this.forwardPaths)
        console.log("weeeeeee ll loops b2a :)) ", this.loops)
    }    

    DFS(nodes: node[], u: number, dest: number) {
        if(u == dest) {
            var newPath = new pathInfo();
            this.path.push(this.getByValue(u)!);
            var temp = JSON.parse(JSON.stringify(this.path));
            newPath.path = temp;
            newPath.gain = this.getGain(nodes, newPath) 
            this.forwardPaths.push(newPath);
            this.path.pop();
            
        }
        else {
            this.path.push(this.getByValue(u)!);
            this.isVisited[u] = true;
            
            for(let i=0; i<nodes[u].OutLinks.length; i++) {
                let index = nodes[u].OutLinks[i];
                if(this.isVisited[nodeMap.get(index.to.name)!]  == false) { 
                    this.DFS(nodes,nodeMap.get(nodes[u].Out[i].name)!, dest);
                }else{                                                  //finding a node visited before means loop :))
                                                                        // msh btsht8l s7 f al touching 
                    console.log("There is a loop ends at ",nodes[u].Out[i]);
                    this.path.push(nodes[u].Out[i].name)

                    let pathCopy = this.path;
                    for(let i=0 ; i<pathCopy.length;i++){
                        // ashel ay 7aga mn al out nodes m3ada al node aly rg3a ll loop
                    }
                    console.log("When detect a loop the path is",this.path)
                    for(let j=0 ; j<this.path.length;j++){
                        console.log("b7awl ala2y albdaya bs lsa mgbthash")
                       // console.log(nodes[u].Out[i])
                        if(this.path[j]==nodes[u].Out[i].name){
                            console.log("gbtha")
                            console.log(this.path[j])
                            let index =0
                            while(j<this.path.length){
                                this.loop[index++]=this.path[j++];
                              
                            }
                            break;
                        }
                    }

                    console.log("My loop is >>> ",this.loop);
                    var newLoop = new pathInfo();
                    var tempyy = JSON.parse(JSON.stringify(this.loop));
                    
                    newLoop.path = tempyy;
                    newLoop.gain = this.getGain(nodes, newLoop) 
                    console.log(newLoop)

                    this.loops.push(newLoop);
                    this.loop=[]

                }
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