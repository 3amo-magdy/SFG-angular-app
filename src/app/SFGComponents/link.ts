import { IViewable } from "./IViewable";
import { node } from "./node";

export class link extends IViewable{
    from:node;
    to:node;
    gain:number;
    //mainly for drawing :
    level:number;
    constructor(f:node,t:node,level:number){
        super("");
        this.from=f;
        this.to=t;
        this.gain=0;
        this.level = level;
    }
}
