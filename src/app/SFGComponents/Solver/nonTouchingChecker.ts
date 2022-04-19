import { node } from "../node";
import { ISolver } from "./ISolver";

/**
 * Need to know the data types of the graph that will be passed to all the functions and loops, etc
 */

/**
 * PLAN
 * 
 * we can consider a new graph for this part
 * each node in this graph will represent a loop in the original graph
 * two loops are nontouching>>connect them by an edge in the graph
 * thus we can get all combinations of 2 loops that are untouching(they are the edges in the graph)
 * 
 * to continue with the implementation. we need to get all possible cycles in the loop graph
 * 
 * we will use a 3d array to store the result
 * first dimension of the result arr >> [i] will store collection of all groups of X-i non touching loops
 * such that X is the number of loops that can be non touching(more on that below) 
 * 
 * 
 * once we get all cycles, 
 * we need to sort them descendengly 
 * such that the cycle with the larger number of nodes(which are loops in the original graph) appears first
 * 
 * we go through the sorted list of cycles
 * check whether the cycle is part of a complete graph
 * if it is complete (all nodes in that cycle are connected to one another) 
 * that means that they are non touching(each two loops inside are non touching)
 * >> we store it in the result array in its suitable place
 * 
 * that is the basic idea ^^
 * but in terms of optimization
 * 
 * when we check 5 nodes to be complete, it means that each subset of 4 are complete too
 * thus we need to start to check the complete graphs of the most nodes first , that is why we need the sorted cycles
 * so we add each set of nodes that form a complete graph of n nodes to the place where we collect the number of nontouching n loops
 * and when we check n-1, n-2, n-3, .... , 4 cycles .. we should check whether that cycle is part of complete graph we knew before
 * >>if it is then add it without checking
 * >>>else check complete or not
 * 
 * all cycles of 3 nodes are complete graph >> untouching loops
 * 
 */

export class nonTouchingChecker{
    
    nonTouching_i_loops:number[][][]=[];
    loopsMap!: Map<number, number[]>; //maps loop number to the node numbers
    nodeMap!: Map<number, node>; //maps node number to the node itself
    loopsNum:number=0;




    isTouching(loop1:number[],loop2:number[] ){}
    findNonTouchingLoops(nodes:node[],loops:number[][]){
        this.nodeMap=this.createNodeMap(nodes)
        this.loopsMap=this.createLoopsMap(loops)
        //create loops graph using is touching method>>need to know input to function that gets the cycle
        //get all cycles in the graph
        //sort the cycles according to which has more elements >> need to create sorting function
        //go over all cycles and filter them >> need to have isCompleteGraph function
        
    }

    /**
     * creates map to map from loop number as L1 to loop nodes numbers
     * @param loops 
     * @returns 
     */
    createLoopsMap(loops:number[][]):Map<number,number[]>{
        var map= new Map<number,number[]>()
        let i = 0;
        for(; i<loops.length;i++){
            map.set(i,loops[i])
        }
        this.loopsNum=i;
        return map;
    }


    /**
     * function creates a map to map from node number to the node itself
     * @param nodes 
     * @returns 
     */
    createNodeMap(nodes:node[]):Map<number,node>{
        var map= new Map<number,node>()
        for(let i = 0; i<nodes.length;i++){
            map.set(i,nodes[i])
        }
        return map;
    }


}