import { IViewable } from "./IViewable";
import { node } from "./node";

export class link extends IViewable{
    from:node;
    to:node;
    gain:number
    constructor(f:node,t:node){
        super("");
        this.from=f;
        this.to=t;
        this.gain=0;
    }
}
