import { Component, ElementRef, ViewChild } from "@angular/core";
import { IViewable } from "./SFGComponents/GUI/IViewable";
import { link } from "./SFGComponents/link";
import { mode } from "./SFGComponents/GUI/mode";
import { node } from "./SFGComponents/node";
import { IdGenerator } from "./SFGComponents/IdGenerator";
import { nonTouchingChecker } from "./SFGComponents/Solver/nonTouchingChecker";
import { pathInfo, Solver } from "./SFGComponents/Solver/Solver";
export const NULL:node = new node("",0,0,"");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent {
  nodes!: node[];
  links!: link[];
  startNode:node|undefined;
  endNode:node|undefined;
  MODE!: mode;
  selected!: IViewable;
  lastSelectednode!: node;
  lastLeftnode!: node;

  generator: IdGenerator;
  //front:
  win!: Window;
  extraWidth:number;
  extraHeight:number;
  @ViewChild("co")
  Eco!: ElementRef;
  @ViewChild("canvas")
  Ecanvas!: ElementRef;
  canvas!: SVGElement;
  @ViewChild("gainBox")
  Egain!:ElementRef;
  @ViewChild("nameBox")
  Ename!:ElementRef;
  @ViewChild("res")
  Eres!:ElementRef;
  result:string;
  axis_height: number = innerHeight / 4;
  axis_pointer!: number;
  node_name!:number;
  NODEWIDTH = 40;
  ArrowWidth = 12; //pixels
  ArrowHeight = 10; //pixels
  LEVEL = 50;
  holding: boolean;
  editing: boolean = true;
  constructor() {
    this.nodes = [];
    this.links = [];
    this.generator = new IdGenerator();
    this.win = window;
    this.extraHeight = 0;
    this.extraWidth = 0;
    this.NODEWIDTH = 40;
    this.axis_pointer = 0;
    this.node_name=0;
    this.holding = false;
    this.editing=true;
    this.result="";
  }
  ngOnInit() {
    this.MODE = mode.linking;
  }
  ngAfterViewInit() {
    document.addEventListener("keydown", this.KeyDown.bind(this), false);
    document.addEventListener("resize", this.update_axis.bind(this), false);
    document.addEventListener("scroll", this.update_axis.bind(this), false);
    document.addEventListener("mousedown", this.update_axis.bind(this), false);

    // document.getElementById("co")!.style.maxWidth=`${innerWidth*0.8}`;
    // (document.getElementsByClassName("co")[0] as HTMLDivElement).style.maxWidth=`${900*0.8}`;
    (this.Eco.nativeElement as HTMLDivElement).style.setProperty('max-width',""+(900));
    // document.addEventListener("mouseenter", this.update_axis.bind(this), false);
    // document.addEventListener("mouseleave", this.update_axis.bind(this), false);

    this.canvas = this.Ecanvas.nativeElement as SVGElement;
  }
  update_axis() {
    console.log(this.links);
    if(this.links.length>0){
      let maxSelfLoopH = 0;
      for (let index = this.links.length-1;(index > -1 && this.links[index].from==this.links[index].to);index--) {
        console.log(index);
        let s =this.evaluate_curve_height(this.links[index]);
        if(s>maxSelfLoopH){
          maxSelfLoopH = s;
        }
      }
      let k = this.evaluate_curve_height(this.links[0]) + 16;
      k = Math.max(k,maxSelfLoopH+16);
      console.log(k);
      if(k>this.win.innerHeight/4){
        this.axis_height = k;
      }
    }
    else{
      this.axis_height = this.win.innerHeight/4;
    }
    this.win.innerHeight -(this.getOffset().top+this.evaluateCanvasHeight());
  }
  clear(){
    this.links=[];
    this.nodes=[];
    this.MODE = mode.linking;
    this.extraHeight = 0;
    this.extraWidth = 0;
    this.axis_pointer = 0;
    this.node_name=0;
    this.holding = false;
    this.startNode=undefined;
    this.endNode=undefined;
  }
  getOffset() {
    if (this.canvas) {
      var bound = this.canvas.getBoundingClientRect();
      var html = document.documentElement;
      return {
        top: bound.top + window.pageYOffset - html.clientTop,
        left: bound.left + window.pageXOffset - html.clientLeft,
      };
    } else {
      return {
        top: 20,
        left: 20,
      };
    }
  }
  selectingAlink(): boolean {
    return this.selected instanceof link;
  }
  selectingAnode(): boolean {
    return this.selected instanceof node;
  }

  select(v: IViewable) {
    console.log("selected :");
    console.log(v);
    this.selected = v;
    if (v instanceof node) {
      this.MODE = mode.selectingNode;
      this.lastSelectednode = v;
      this.holding = true;
      (this.Egain.nativeElement as HTMLInputElement).value="";
      (this.Ename.nativeElement as HTMLInputElement).value=v.name;
    } else {
      this.MODE = mode.selectingLink;
      (this.Egain.nativeElement as HTMLInputElement).value=(v as link).gain.toString();
      (this.Ename.nativeElement as HTMLInputElement).value="";
    }
  }

  delete(v: IViewable) {
    if(v==NULL){
      return;
    }
    let arr;
    switch (this.MODE) {
      case mode.selectingNode:
        this.deleteAllLinks(v as node);
        let index = this.removefromarr(this.nodes, v);
        if(index==this.nodes.length){
          this.node_name--;
        }
        for (; index < this.nodes.length; index++) {
          this.nodes[index].DecrementX();
        }
        this.axis_pointer--;
        break;
      case mode.selectingLink:
        this.leveldown(v as link);
        this.disconnectBothnodes(v as link);
        this.removefromarr(this.links, v);
        break;
    }
    this.MODE = mode.linking;
    this.selected = NULL;
    this.lastLeftnode = NULL;
    this.lastSelectednode = NULL;
    (this.Egain.nativeElement as HTMLInputElement).value = "";
    (this.Ename.nativeElement as HTMLInputElement).value = "";
    this.update_axis();
  }
  private leveldown(l :link){
    let links = l.from.OutLinks;
    for (let index = 0; index < links.length; index++) {
      if(links[index].to == l.to&&links[index].level>l.level){
        links[index].level--;
      }
    }
  }
  private removefromarr(arr: IViewable[], v: IViewable): number {
    for (var i = 0; i < arr.length; i++) {
      if (v == arr[i]) {
        arr.splice(i, 1);
        return i;
      }
    }
    return -1;
  }
  deleteAllLinks(v: node) {
    for (let index = 0; index < this.links.length; index++) {
      let l = this.links[index];
      if (l.from == v || l.to == v) {
        this.disconnectBothnodes(l);
        this.links.splice(index, 1);
        index--;
      }
    }
  }
  disconnectBothnodes(l: link) {
    let a: node = l.from;
    let b: node = l.to;
    this.removefromarr(a.Out, b);
    this.removefromarr(b.In, a);
    this.removefromarr(a.OutLinks, l);
    this.removefromarr(b.InLinks, l);
  }
  Mode_creatingNode() {
    this.MODE = mode.creatingNode;
  }
  resetSelection() {
    if(!this.holding){
      this.MODE = mode.linking;
      this.selected = NULL;
      this.lastLeftnode = NULL;
      this.lastSelectednode = NULL;
      (this.Egain.nativeElement as HTMLInputElement).value = "";
      (this.Ename.nativeElement as HTMLInputElement).value = "";
    }
  }
  keep_holding(){
    this.holding=true;
  }
  addnode() {
    let id = this.generator.generate();
    let name : string = "X"+this.node_name++;
    while(this.dublicateName(name)){
      name = "X"+this.node_name++;
    }
    let newnode = new node(id, this.axis_pointer, this.axis_height,name);
    this.nodes.push(newnode);
    this.axis_pointer++;
  }
  private dublicateName(name: string){
    for (let index = 0; index < this.nodes.length; index++) {
      if(this.nodes[index].name==name){
        return true;
      }
    }
    return false;
  }
  islinked(from: node, to: node): number {
    // if (from.Out.includes(to)) {
    //   return true;
    // }
    for (var i=from.OutLinks.length -1 ;i>-1;i--) {
      if(from.OutLinks[i].to == to){
        return from.OutLinks[i].level+1;
      }
    }
    return 0;
  }
  Link(from: node, to: node): void {
    var newLink = new link(from, to,this.islinked(from, to));
    from.OutLinks.push(newLink);
    to.InLinks.push(newLink);
    from.Out.push(to);
    to.In.push(from);
    this.links.push(newLink);
    this.links.sort((a:link,b:link)=>Math.abs(a.to.X-a.from.X)>Math.abs(b.to.X-b.from.X)? -1 : Math.abs(a.to.X-a.from.X)<Math.abs(b.to.X-b.from.X)? 1 : (a.level>b.level)? -1 : 1);
    this.update_axis();
  }
  mouseOut(v:node,e:MouseEvent){
    let cx = this.evaluate_x(v)+this.getOffset().left;
    let cy = this.axis_height+this.getOffset().top;
    console.log((Math.pow(e.clientX-cx,2)+Math.pow(e.clientY-cy,2)));
    console.log(this.NODEWIDTH/2);
    if(this.holding&&((Math.pow(e.clientX-cx,2)+Math.pow(e.clientY-cy,2))>=Math.pow(this.NODEWIDTH/2,2))){
      this.lastLeftnode = v;
    }
  }
  mouseUp(v: IViewable) {
    this.holding = false;
    if (this.MODE == mode.selectingNode && v instanceof node &&this.lastSelectednode != NULL) {
      if(v == this.lastSelectednode){
        if(this.lastSelectednode == this.lastLeftnode){
          this.Link(this.lastSelectednode, v as node);
          this.resetSelection();
        }
      }
      else{
        this.Link(this.lastSelectednode, v as node);
        this.resetSelection();
      }
    }
  }
  KeyDown(e: KeyboardEvent) {
    let keyName = e.key;
    if (this.selected != NULL && e.key === "Delete") {
      this.delete(this.selected);
    }
    if (e.key === "n" || e.key === "N") {
      this.addnode();
    }
  }
  getItem(arr: IViewable[], id: string) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return arr[i];
      }
    }
    throw new Error("couldn't find the id :" + id);
  }
  evaluate_curve(l: link): string {
    var res: string;
    let x1 = this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    let lev = l.level;
    //self loop
    if (x1 == x2) {
      let sign = 1;
      if(lev%2==0){
        sign = -1;
      }
      lev = Math.floor(lev/2);
      return `M ${x1 - this.NODEWIDTH / 4} ${this.axis_height} 
      C ${x1 - this.NODEWIDTH / 2.5} ${this.axis_height - sign *1.4* this.NODEWIDTH - sign * lev *this.LEVEL/2}
       ${x1 + this.NODEWIDTH / 2.5} ${this.axis_height - sign *1.4* this.NODEWIDTH - sign * lev * this.LEVEL/2}
      ${x2 + this.NODEWIDTH / 4} ${this.axis_height}`;
    }
    if (x2<x1){
      lev *=-1;
    }
    res = `M ${x1} ${this.axis_height} 
    Q ${(x1 + x2) / 2} ${this.axis_height - (x2 - x1) / 2 - (lev * this.LEVEL)} 
      ${x2} ${this.axis_height}`;
    return res;
  }
  evaluate_x(node: node): number {
    var res = 0;
    var n = ((80/100*window.innerWidth)) / (this.nodes.length+1);
    if(n<2 * this.NODEWIDTH){
      n = 2 * this.NODEWIDTH;
      this.extraWidth = n*(this.nodes.length+1)-((80/100*window.innerWidth))-this.NODEWIDTH;
    }
    if (!(this.nodes.length == 0)) {
      res = node.X * n;
    if (this.nodes[0] == node) {
        res += this.NODEWIDTH / 2;
      }
    }
    if(node.X==0){
      res-=this.NODEWIDTH/2;
    }
    return res +  ((80/100*window.innerWidth) / (this.nodes.length+1));
  }
  evaluate_curve_midPoint_y(l: link) {
    let x0 = this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    let lev = l.level;
    if (x2<x0){
      lev *=-1;
    }
    if (x0 == x2) {
      let sign  = 1;
      if(lev%2==0){
        sign = -1;
      }
      lev = Math.floor(lev/2);
      return (0.125)*this.axis_height+6*0.125*(this.axis_height - sign *1.4* this.NODEWIDTH - sign * lev * this.LEVEL/2)+0.125*(this.axis_height);
    }
    let y1 = this.axis_height - (x2 - x0) / 2;
    return 0.5 * this.axis_height + 0.5 * y1 - lev*this.LEVEL/2;
  }
  evaluate_curve_height(l:link):number{
    let x1 = this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    let lev = l.level;
    if (x1 == x2) {
      lev = Math.floor(lev/2);
      return 6/8*(1.4* this.NODEWIDTH + lev *this.LEVEL/2)
    }
    return Math.abs(x2 - x1) / 4 + (lev * this.LEVEL)/2;
  }
  evaluate_arrow(l: link): string {
    let res = "";
    let ArrowWidth = this.ArrowWidth;
    let mid_point_y = this.evaluate_curve_midPoint_y(l);
    let x1 = this.evaluate_x(l.from);
    let x2 = this.evaluate_x(l.to);
    let mid_point_x = (x2 + x1) / 2;
    if (x1 == x2) {
      ArrowWidth=1/3*ArrowWidth;
      let ArrowHeight=0.75*this.ArrowHeight
      return `${mid_point_x + 1 + (1 / 3) * ArrowWidth} ${mid_point_y} 
      ${mid_point_x - (ArrowWidth * 2) / 3} ${mid_point_y - (ArrowHeight) / 3} 
      ${mid_point_x - (ArrowWidth * 2) / 3} ${mid_point_y + (ArrowHeight) / 3}`;
    }
    if (x1 > x2) {
      ArrowWidth *= -1;
    }
    return `${mid_point_x + (1 / 3) * ArrowWidth} ${mid_point_y} ${
      mid_point_x - (ArrowWidth * 2) / 3
    } ${mid_point_y - (this.ArrowHeight * 1) / 3} ${
      mid_point_x - (ArrowWidth * 2) / 3
    } ${mid_point_y + (this.ArrowHeight * 1) / 3}`;
  }
  evaluate_node_color(n:node):string{
    if(n==this.startNode){
      return("rgb(20, 120, 0)");
    }
    if(n==this.endNode){
      return("rgb(20, 0, 120)");
    }
    if(this.MODE==mode.selectingNode&&n==this.lastSelectednode){
      return("rgb(182, 56, 56)");
    }
    return("rgb(156, 0, 0)");
  }
  editGain(e: any) {
    if(this.selected instanceof link){
      if(isNaN(Number(e.target.value))){
        e.target.value = "";
        return;
      }
      (this.selected as link).gain = Number(e.target.value);
    }
    else{
      e.target.value = "";
      return
    }
  }
  editName(e: any) {
    if(!(this.selected instanceof node)){
      e.target.value = "";
      return
    }
    let flag = false;
    this.nodes.forEach(n => {
      if(n.name===e.target.value){
        this.win.alert("another node with that same name exists");
        e.target.value = "";
        flag = true;
        return;
      }
    });
    if(flag){
      return;
    }
    (this.selected as node).name = e.target.value;
    e.target.value = "";
    
  }
  evaluateCanvasWidth():number{
    return 0.8*window.innerWidth+ this.extraWidth;
  }
  evaluateCanvasHeight():number{
    return this.axis_height*2;
  }
  resH(){
    (this.Eres.nativeElement as HTMLDivElement).style.height=`${this.win.innerHeight -(this.getOffset().top+this.evaluateCanvasHeight())}`;
  }
  mousemove(e:MouseEvent){
    console.log(e.clientX,(this.Eco.nativeElement as HTMLDivElement).clientLeft+(this.Eco.nativeElement as HTMLDivElement).offsetLeft);

    if(e.clientX-(this.Eco.nativeElement as HTMLDivElement).clientLeft<220){
      (this.Eco.nativeElement as HTMLDivElement).scrollBy(-10,0);
    }
    else if(-e.clientX+(this.Eco.nativeElement as HTMLDivElement).clientWidth+(this.Eco.nativeElement as HTMLDivElement).offsetLeft<10){
      (this.Eco.nativeElement as HTMLDivElement).scrollBy(10,0);

    }
  }
  selectStart(){
    if(this.MODE==mode.selectingNode&&this.lastSelectednode!=this.endNode){
      this.startNode=this.lastSelectednode;
    }
  }
  selectEnd(){
    if(this.MODE==mode.selectingNode&&this.lastSelectednode!=this.startNode){
      this.endNode=this.lastSelectednode;
    }
  }
  canSolve(){
    if(this.startNode==undefined||this.endNode==undefined){
      if(this.nodes.length>1){

          this.startNode=this.nodes[0];

          this.endNode=this.nodes[this.nodes.length-1];

        }
        else{window.alert("please add more nodes");return false;}

    }
    if(!(this.startNode.In.length==0&&this.endNode.Out.length==0)){
       window.alert("please make sure to pick applicable input & output nodes");
       return false;
     }
    return true;
  }
  forward_paths:string[]=[];
  loops:string[]=[];
  non_t_loops:string[][]=[];
  big_delta="";
  deltas:string[]=[];
  total_gain="";
  solve(){
    if(!this.canSolve()){
          return;

    }
    this.abbreviate();
    this.forward_paths=[];
    this.loops=[];
    this.non_t_loops=[];
    this.big_delta="";
    this.deltas=[];
    this.total_gain="";
    let x : Solver = new Solver();
    x.getPaths(this.nodes,this.startNode!,this.endNode!)
    var allPaths:pathInfo[]=x.getPathsList()
    var allLoops:pathInfo[]=x.getLoopsList()
    const loops_map=new Map<pathInfo,string>();  

    for (let index = 0; index < allLoops.length; index++) {
      loops_map.set(allLoops[index],`L${index+1}`);
      this.loops.push(`L${index+1} : ${allLoops[index].tostr()}`);
    }
    this.forward_paths=allPaths.map((path)=>path.tostr());

    var c :nonTouchingChecker = new nonTouchingChecker();
    var nonTouchingLoops:pathInfo[][][]= c.findNonTouchingLoops(this.nodes,allLoops);
    for (let index = 0; index < nonTouchingLoops.length; index++) {
      const level = nonTouchingLoops[index];//a -> n -> a+2
      for (let j = 0; j < level.length; j++) {
        for (let l = 0; l < level[j].length; l++) {
          if(j==0&&l==0){
            this.non_t_loops.push([]);
          }
          if(l==0){
            this.non_t_loops[index].push("["+loops_map.get(level[j][l])!);          
          }
          else if(l==level[j].length-1){
            this.non_t_loops[index].push(","+loops_map.get(level[j][l])!+"]");          
          }
          else{
            this.non_t_loops[index].push(","+loops_map.get(level[j][l])!);          
          }
        }
      }
    }
    var bigDelta=1;
    this.big_delta="1 "
    for(let i=0;i<allLoops.length;i++){
      bigDelta-=allLoops[i].gain
      this.big_delta+=(allLoops[i].gain>=0)?` - ${allLoops[i].gain}`:` + ${-allLoops[i].gain}`;
    }

    for(let i=0;i<nonTouchingLoops.length;i++){
      for(let j=0;j<nonTouchingLoops[i].length;j++){
        var temp=1;
        for(var l of nonTouchingLoops[i][j]){
          temp*=l.gain
        }
        bigDelta=(i%2===0? (bigDelta+temp):(bigDelta-temp))
        this.big_delta+=(i%2===0? ((temp>=0)?` + ${temp}`:` - ${-temp}`):((temp>=0)?` - ${temp}`:` + ${-temp}`))
      }
    }
    this.big_delta+=allLoops.length>0?" = "+bigDelta:"";

  
    
    var numerator=0;
    this.deltas=[];
    for(let i=0;i<allPaths.length;i++){
      var loopsAfterRemovingPath=x.getLoopsWithoutPath(allLoops,allPaths[i]) //now we have the loops excluding that path
      var c= new nonTouchingChecker()
      var nonTouchingLoopsAfterRemovingPath=c.findNonTouchingLoops(this.nodes,loopsAfterRemovingPath)
      var smallDelta=1;
      this.deltas[i]=pathInfo.tostr(allPaths[i].path)+" = 1 ";
      for(let j=0;j<loopsAfterRemovingPath.length;j++){
          if(j==0){
            this.deltas[i]+="+ (";
          }
          smallDelta-=loopsAfterRemovingPath[j].gain
          this.deltas[i]+=(loopsAfterRemovingPath[j].gain>=0)?` - ${loopsAfterRemovingPath[j].gain}`:` + ${-loopsAfterRemovingPath[j].gain}`;
          if(j==loopsAfterRemovingPath.length-1){
            this.deltas[i]+=")";
          }
      }
      let index=i;
      for(let i=0;i<nonTouchingLoopsAfterRemovingPath.length;i++){
        for(let j=0;j<nonTouchingLoopsAfterRemovingPath[i].length;j++){
          if(j==0){
            this.deltas[index]+="+ ("
          }
          var temp2=1;
          for(var l of nonTouchingLoopsAfterRemovingPath[i][j]){
            temp2*=l.gain
          }
          smallDelta=(i%2===0?smallDelta+temp2:smallDelta-temp2)
          this.deltas[index]+=(i%2===0? ((temp2>=0)?` + ${temp2}`:` - ${-temp2}`):((temp2>=0)?` - ${temp2}`:` + ${-temp2}`))
          if(j==nonTouchingLoopsAfterRemovingPath[i].length-1){
            this.deltas[index]+=")"
          }
        }
      }
      this.deltas[i]+=loopsAfterRemovingPath.length>0?" = "+smallDelta:"";
      numerator+=allPaths[i].gain*smallDelta;
      smallDelta=1    
    }
            var overall= numerator/bigDelta
    this.total_gain=`${overall}`;
  }
  private  abbreviate(){
    for (let index = 0; index < this.nodes.length; index++) {
      const node = this.nodes[index];
      var node_links:Map<node,link> = new Map();
      for (let j = 0; j < node.OutLinks.length; j++) {
        const link = node.OutLinks[j];
        var old = node_links.get(link.to);
        if(old!=undefined){
          old.gain+=link.gain;
          //remove link
          this.disconnectBothnodes(link);
          this.removefromarr(this.links, link);
          j--;
        }
        else{
          node_links.set(link.to,link);
        }
      }
    }
  }
}
