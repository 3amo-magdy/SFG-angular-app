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

        for(let i=0 ; i<this.loops.length;i++){
            for(let j=0 ; j<this.loops.length;j++){
                if(i!=j && JSON.stringify(this.loops[i].path)==JSON.stringify(this.loops[j].path)){
                    this.loops.splice(i,1)
                }
            }
        }
    
        console.log("weeeeeee ", this.forwardPaths)
        console.log("weeeeeee ll loops b2a :)) ", this.loops)
        
    }    

    getPathsList():pathInfo[]{
        return this.forwardPaths;
    }

    getLoopsList():pathInfo[]{
        return this.loops
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
            
        } else {
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

                    let pathCopy = JSON.parse(JSON.stringify(this.path));
                    for(let x=0 ; x<nodes[u].Out.length;x++){   // x1 x2 x3 x4 x1
                        if(pathCopy.includes(nodes[u].Out[x].name) && (nodes[u].Out[x].name!= nodes[u].Out[i].name) && 
                            this.isVisited[nodeMap.get(nodes[u].Out[x].name)!]==false){
                                let INDEX = pathCopy.indexOf(nodes[u].Out[x].name)
                                pathCopy.splice(INDEX,1)
                        }
                    }
                    
                    console.log(this.path)
                    console.log("When detect a loop the path is",pathCopy)
                    for(let j=0 ; j<pathCopy.length;j++){
                        console.log("b7awl ala2y albdaya bs lsa mgbthash")
                       // console.log(nodes[u].Out[i])
                        if(pathCopy[j]==nodes[u].Out[i].name){
                            console.log("gbtha")
                            console.log(pathCopy[j])
                            let index =0
                            while(j<pathCopy.length){
                                this.loop[index++]=pathCopy[j++];
                            }
                            break;
                        }
                    }

                    console.log("My loop is >>> ",this.loop);        // x2 x1 x2 lw x1 dh a2l mn x2 yb2a 8lt "map key"
                    if(nodeMap.get(this.loop[this.loop.length-2])! >= nodeMap.get(this.loop[this.loop.length-1])! ){
                        var newLoop = new pathInfo();
                        var tempyy = JSON.parse(JSON.stringify(this.loop));
                        
                        newLoop.path = tempyy;
                        newLoop.gain = this.getGain(nodes, newLoop) 
                        console.log(newLoop)
    
                        this.loops.push(newLoop);
                    }
                   
                    this.loop=[]
                    this.path.pop();
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



    getLoopsWithoutPath(loops:pathInfo[] , path:pathInfo):pathInfo[]{
        var modifiedLoops:pathInfo[]=[]
        var map = new Map<string,boolean>();
        for(var n of path.path){
            map.set(n,true)
        }
        console.log(map)
        
        for(var l of loops){
            var valid:Boolean=true
            l.print()
            for(var n of l.path){
                console.log("checking "+n)
                console.log(map.get(n))
                if(map.get(n)===true){
                    console.log("found duplicates, ignoring the loop")
                    valid=false
                    break;
                }
            }
            if(valid===true) modifiedLoops.push(l)
            console.log(modifiedLoops)
        }

        return modifiedLoops;
    }


}

export class pathInfo {
    path: string[];
    gain: number;
    
    constructor() {
        this.path = [];
        this.gain = 1; 
    }

    print(){
        console.log(this.path + " gain: " + this.gain);
    }
}