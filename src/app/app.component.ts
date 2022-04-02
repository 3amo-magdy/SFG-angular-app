import { Component, ElementRef, ViewChild } from "@angular/core";
import { IViewable } from "./SFGComponents/IViewable";
import { link } from "./SFGComponents/link";
import { mode } from "./SFGComponents/mode";
import { node } from "./SFGComponents/node";
import { IdGenerator } from "./SFGComponents/IdGenerator";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nodes!:node[];
  links!:link[];
  MODE!:mode;
  selected!:IViewable;
  lastSelectednode!:node;

  generator:IdGenerator;
  //front:
  win!:Window;
  @ViewChild('canvas')
  Ecanvas!: ElementRef;
  canvas!:SVGElement;
  axis_height:number=innerHeight/2;
  axis_pointer!:number;
  NODEWIDTH=40;
  constructor(){
    this.nodes=[];
    this.links=[];
    this.generator = new IdGenerator();
    this.win = window;
    this.NODEWIDTH = 40;
    this.axis_pointer = 0;
  }
  ngOnInit() {

    this.MODE=mode.linking;
  }
  ngAfterViewInit(){
    document.addEventListener('keydown',this.KeyDown.bind(this),false);
    document.addEventListener('resize',this.update_axis.bind(this),false);
    document.addEventListener('scroll',this.update_axis.bind(this),false);
    document.addEventListener('mouseenter',this.update_axis.bind(this),false);
    document.addEventListener('mousedown',this.update_axis.bind(this),false);
    document.addEventListener('mouseleave',this.update_axis.bind(this),false);



    this.canvas = (this.Ecanvas.nativeElement as SVGElement);
  }
  update_axis(){
    this.axis_height=window.innerHeight/2;
  }
  getOffset(){
    if(this.canvas){
      var bound =this.canvas.getBoundingClientRect();
      var html =document.documentElement;
      return{
        top:bound.top+window.pageYOffset-html.clientTop,
        left:bound.left+window.pageXOffset-html.clientLeft
      }
    }
    else{
      return{
        top:20,
        left:20
      }

    }
  }

  select(v:IViewable){
    console.log("selected :");
    console.log(v);
    this.selected=v;
    if(v instanceof node){
      this.MODE=mode.selectingNode;
      this.lastSelectednode = v;
    }
    else{
      this.MODE=mode.selectingLink;
    }
  }

  delete(v:IViewable){
    let arr;
    switch(this.MODE){
      case mode.selectingNode:
          this.deleteAllLinks(v as node);
          let index =  this.removefromarr(this.nodes,v);
          for(;index<this.nodes.length;index++){
            this.nodes[index].DecrementX();
          }
          this.axis_pointer--;
          break;
      case mode.selectingLink:
            this.disconnectBothnodes(v as link);
            this.removefromarr(this.links,v);
            break;
      default:
            return;
    }
  }

  private removefromarr(arr:IViewable[],v:IViewable):number{
    for(var i=0;i<arr.length;i++){
      if(v==arr[i]){
        arr.splice(i,1);
        return i;
      }
    }
    return -1;
  }
  deleteAllLinks(v:node){
    for (let index = 0; index < this.links.length; index++) {
      let l = this.links[index];
      if (l.from==v||l.to==v){
        this.disconnectBothnodes(l);
        this.links.splice(index,1);
        index--;
      }
    }
  }
  disconnectBothnodes(l:link){
     let a:node = l.from;
     let b:node = l.to;
     this.removefromarr(a.Out,b);
     this.removefromarr(b.In,a);
     this.removefromarr(a.OutLinks,l);
     this.removefromarr(b.InLinks,l);
  }
  Mode_creatingNode(){
    this.MODE=mode.creatingNode;
  }
  resetSelection(e:MouseEvent){
    if(this.MODE==mode.creatingNode){
      console.log("just created a node")
      this.addnode();
    }
  }
  addnode(){
      let id = this.generator.generate();
      let newnode=new node(id,this.axis_pointer,this.axis_height);
      this.nodes.push(newnode);
      this.axis_pointer++;
  }
  islinked(from:node,to:node):boolean{
    if(from.Out.includes(to)){
      return true;
    }
    return false;
  }
  Link(from:node,to:node):void{
    if(this.islinked(from,to)){
      window.alert("already linked");
      return;
    }
    var newLink = new link(from,to);
    from.OutLinks.push(newLink);
    to.InLinks.push(newLink);
    from.Out.push(to);
    to.In.push(from);
    this.links.push(newLink);
  }
  mouseUp(v:IViewable){
    console.log("mouse up:");
    console.log(v);
    console.log("links:");
    console.log(this.links);

    if(this.MODE==mode.selectingNode&& v instanceof node){
        this.Link(this.lastSelectednode,v as node);
    }
    else{
      //do nothing
    }
  }
  KeyDown(e:KeyboardEvent){
    let keyName = e.key;
    if(e.key==='Delete'||e.key==="D"||e.key==="d"){
      this.delete(this.selected);
    }
    if(e.key==='n'||e.key==="N"){
      this.MODE=mode.creatingNode;
    }
  }

  getItem(arr:IViewable[], id:string ){
    for (var i=0;i<arr.length;i++) {
      if(arr[i].id===id){
        return arr[i];
      }
    }
    throw new Error("couldn't find the id :"+id);
  }
  evaluate_curve(l: link):string{
    var res:string;
    let x1 = this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    res = `M ${x1} ${this.axis_height} Q ${(x1+x2)/2} ${this.axis_height-(x2-x1)/2} ${x2} ${this.axis_height}`;
    console.log(res);
    return res;
  }
  evaluate_x(node: node):number{
    var res = this.NODEWIDTH/2;
    if(!(this.nodes.length==0)){
      res = (node.X*window.innerWidth/this.nodes.length);
    if(this.nodes.length>=2&&this.nodes[this.nodes.length-1]==node){
      res-=this.NODEWIDTH/2;
    }
    else if(this.nodes[0]==node){
      res+=this.NODEWIDTH/2;
    }
  }
    return res;
  }
  evaluate_curve_midPoint(l:link){
    let x0= this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    let y1 = this.axis_height-(x2-x0)/2;
    return 0.5 * this.axis_height + 0.5 * y1 ;
  }
}
