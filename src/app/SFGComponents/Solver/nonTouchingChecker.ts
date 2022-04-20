import { node } from "../node";
import { ISolver } from "./ISolver";



export class nonTouchingChecker{
    
    nonTouching_i_loops:node[][][][]=[];
    loopsMap!: Map<number, number[]>; //maps loop number to the node numbers
    nodeMap!: Map<node, number>; //maps node number to the node itself
    loopsNum:number=0;
    nodesNum:number=0;




    demoTouching(){
        var x1:node = new node("0",0,0,"x1");
        var x2:node = new node("0",0,0,"x2");
        var x3:node = new node("0",0,0,"x3");
        var x4:node = new node("0",0,0,"x4");
        var x5:node = new node("0",0,0,"x5");
        var x6:node = new node("0",0,0,"x6");
        var x7:node = new node("0",0,0,"x7");
        var x8:node = new node("0",0,0,"x8");
        var x9:node = new node("0",0,0,"x9");
        var x10:node =new node("0",0,0,"x10");


        var allNodes:node[]=[x1,x2,x3,x4,x5,x6,x7,x8,x9,x10]

        var loop1:node[]=[x1,x2,x3]
        var loop2:node[]=[x3,x4,x7]
        var loop3:node[]=[x4,x5,x6]
        var loop4:node[]=[x8,x9,x10]

        var loops:node[][]=[loop1,loop2,loop3,loop4 ]
        this.findNonTouchingLoops(allNodes,loops);

    }




    isNonTouching(loops:node[][] ):boolean{
        let hashmap= new Map<number,boolean>();
        console.log("checking loops : " + loops)
        for(var loop1 of loops){
            for (var i of loop1){
                if(hashmap.has((this.nodeMap.get(i))!)===true) return false;
                else hashmap.set(this.nodeMap.get(i)!,true);
            }
        }        
        return true;
    }


    getNumberOfOnes(x:number):number{
        return x.toString(2).split('0').join("").length
    }



    findNonTouchingLoops(nodes:node[],loops:node[][]){
        this.nodeMap=this.createNodeMap(nodes)
        this.loopsMap=this.createLoopsMap(loops)
        let boundMask=0;
        let choosingMask=0
        console.log(this.nodeMap)
        for(let i=0;i<this.loopsNum-1;i++){
            this.nonTouching_i_loops[i]=[]
            console.log('a')
        }

        boundMask=Math.pow(2,this.loopsNum)-1;
        for(choosingMask=0;choosingMask<=boundMask;choosingMask++){
            if(this.getNumberOfOnes(choosingMask)>1) {
                var loopsChecking:node[][]=[]
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
                    this.nonTouching_i_loops[this.getNumberOfOnes(choosingMask)-2].push(loopsChecking)
                loopsChecking=[]
            }
        }


        console.log("result>>>>>>>>>>>")
        for(let i=0;i<this.loopsNum-1;i++){
            console.log("non touching " +(i+2)+ "loops are: " )
            for(var x of this.nonTouching_i_loops[i]){
                console.log("groupOfLoopsStart");
                
                for (var l of x){
                    console.log("loopStart");
                    for(var n of l){
                        console.log(n.name)
                    }
                    console.log("loopEnd");
                }
                console.log("groupOfLoopsEnd")
            }
        }
        

    }

    /**
     * creates map to map from loop number as L1 to loop nodes numbers
     * @param loops 
     * @returns 
     */
    createLoopsMap(loops:node[][]):Map<number,number[]>{
        var map= new Map<number,number[]>()
        let i = 0;
        for(; i<loops.length;i++){
            // map.set(i,loops[i])
        }
        this.loopsNum=i;
        return map;
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