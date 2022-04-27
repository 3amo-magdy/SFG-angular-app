import { node } from "../node";
import { pathInfo } from "./Solver";

export class nonTouchingChecker{
    loopsNum:number=0;
    nodesNum:number=0;
    nonTouchingLoops:pathInfo[][][]=[];

    isNonTouching(loops:pathInfo[] ):boolean{
        let hashmap= new Map<string,boolean>();
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

    findNonTouchingLoops(nodes:node[],loops:pathInfo[]):pathInfo[][][]{
        this.loopsNum=loops.length
        let boundMask=0;
        let choosingMask=0
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
                for(let i=0;i<this.getNumberOfOnes(boundMask);i++){
                    if(mask[i]==='1') loopsChecking.push(loops[i])
                }
                //[0] >> non touching loops of 2
                //[1] >> non touching loops of 3
                if(this.isNonTouching(loopsChecking))
                    this.nonTouchingLoops[this.getNumberOfOnes(choosingMask)-2].push(loopsChecking)
                loopsChecking=[]
            }
        }
        return this.nonTouchingLoops
    }
}