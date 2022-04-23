import { node } from "../node";
import { pathInfo } from "./Solver";



export class nonTouchingChecker{
    
    // nonTouching_i_loops:node[][][][]=[];    
    loopsMap!: Map<number, number[]>; //maps loop number to the node numbers
    nodeMap!: Map<node, number>; //maps node number to the node itself
    loopsNum:number=0;
    nodesNum:number=0;

    nonTouchingLoops:pathInfo[][][]=[];
    //[0]>>> [[] ]

    // demoTouching(){
    //     var x1:node = new node("0",0,0,"x1");
    //     var x2:node = new node("0",0,0,"x2");
    //     var x3:node = new node("0",0,0,"x3");
    //     var x4:node = new node("0",0,0,"x4");
    //     var x5:node = new node("0",0,0,"x5");
    //     var x6:node = new node("0",0,0,"x6");
    //     var x7:node = new node("0",0,0,"x7");
    //     var x8:node = new node("0",0,0,"x8");
    //     var x9:node = new node("0",0,0,"x9");
    //     var x10:node =new node("0",0,0,"x10");


    //     var allNodes:node[]=[x1,x2,x3,x4,x5,x6,x7,x8,x9,x10]

    //     var loop1:node[]=[x1,x2,x3]
    //     var loop2:node[]=[x3,x4,x7]
    //     var loop3:node[]=[x4,x5,x6]
    //     var loop4:node[]=[x8,x9,x10]

    //     var loops:node[][]=[loop1,loop2,loop3,loop4 ]
    //     this.findNonTouchingLoops(allNodes,loops);

    // }




    isNonTouching(loops:pathInfo[] ):boolean{
        let hashmap= new Map<string,boolean>();
        console.log("checking loops : " + loops)
        for(var loop1 of loops){
            for (var i=0;i<loop1.path.length-1;i++){ //ignore last node
                if(hashmap.has(loop1.path[i])===true) return false;
                else hashmap.set(loop1.path[i],true);
            }
        }        
        return true;
    }


    getNumberOfOnes(x:number):number{
        return x.toString(2).split('0').join("").length
    }

    getNonTouchingLoopList():pathInfo[][][]{
        return this.nonTouchingLoops
    }


    findNonTouchingLoops(nodes:node[],loops:pathInfo[]){
        this.nodeMap=this.createNodeMap(nodes)
        this.loopsNum=loops.length
        let boundMask=0;
        let choosingMask=0
        console.log(this.nodeMap)
        for(let i=0;i<this.loopsNum-1;i++){
            this.nonTouchingLoops[i]=[]
        }

        boundMask=Math.pow(2,this.loopsNum)-1;
        for(choosingMask=0;choosingMask<=boundMask;choosingMask++){
            if(this.getNumberOfOnes(choosingMask)>1) {
                var loopsChecking:pathInfo[]=[]
                var str:string=""
                for(let i = 0;i<this.getNumberOfOnes(boundMask);i++)str=str+'0' //str contains 000000                
                //000000
                //111
                //000+111
                var firstHalfOftheRealMask=str.slice(0,this.getNumberOfOnes(boundMask)-choosingMask.toString(2).length)
                var mask:string=firstHalfOftheRealMask+choosingMask.toString(2)
                console.log(boundMask.toString(2)+" >> " +str +" = " + choosingMask.toString(2)+" >> "+ mask)
                for(let i=0;i<this.getNumberOfOnes(boundMask);i++){
                    if(mask[i]==='1') loopsChecking.push(loops[i])
                }
                //[0] >> non touching loops of 2
                //[1] >> non touching loops of 3
                console.log(choosingMask.toString(2)+" ")
                console.log(loopsChecking)
                if(this.isNonTouching(loopsChecking))
                    this.nonTouchingLoops[this.getNumberOfOnes(choosingMask)-2].push(loopsChecking)
                loopsChecking=[]
            }
        }

    }


    /**
     * function creates a map to map from node number to the node itself
     * @param nodes 
     * @returns 
     */
    createNodeMap(nodes:node[]):Map<node,number>{
        var map= new Map<node,number>()
        let i = 0
        for(; i<nodes.length;i++){
            map.set(nodes[i],i)
        }
        this.nodesNum=i;
        return map;
    }

}