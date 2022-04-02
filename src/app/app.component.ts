import { Component, ElementRef, ViewChild } from '@angular/core';
import { IViewable } from './components/IViewable';
import { link } from './components/link';
import { M } from './components/M';
import { mode } from './components/mode';
import { Q } from './components/Q';
import { ControllerService } from './controller.service';
import { update } from './Response/update';
import { WebSocketAPI } from './WebSocket/WebSocketAPI';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'producer-consumer';
  
  @ViewChild('canvas')
  Ecanvas!: ElementRef;
  canvas!:SVGElement;
  webSocketAPI!: WebSocketAPI;
  greeting: any;
  name!: string;
  MODE!:mode;
  selected!:IViewable;
  simulting!:boolean
  queues!:Q[];
  services!:M[];
  links!:link[];
  service:ControllerService;
  win:Window;
  txt="";
  selectedQ!:Q;
  boolReplay!:boolean;
  stopB!:boolean;
  constructor(s:ControllerService){
    this.service=s; 
    this.win=window;
    this.simulting=false;
  }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(this);
    this.queues=[];
    this.services=[];
    this.links=[];
    this.MODE=mode.linking;

  }
  ngAfterViewInit(){
    document.addEventListener('keydown',this.KeyDown.bind(this),false);
    
    this.webSocketAPI._connect();
    this.canvas = (this.Ecanvas.nativeElement as SVGElement);

    // this.win.w=window.innerWidth;
    // this.win.h=window.innerHeight;
    // this.win.w=this.win.w-this.getOffset().left-12
    // this.win.h=this.win.h-this.getOffset().top-12
    // this.canvas.setAttribute("width",(this.win.w-this.getOffset().left-12).toString())
    // this.canvas.setAttribute("height",(this.win.h-this.getOffset().top-12).toString())
    // let offx=this.canvas.getBoundingClientRect().x;
    // let offy=this.canvas.getBoundingClientRect().y;

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
    if(v instanceof M){
      this.MODE=mode.selectingM;
    }
    else if(v instanceof Q){
      this.MODE=mode.selectingQ;
    }
    else{
      this.MODE=mode.selectingLink;
    }
  }
  delete(v:IViewable){
    let arr;
    switch(this.MODE){
      case mode.selectingM:
        this.service.removeM(<M>v).subscribe((data:any)=>{
          console.log(data);
          arr=this.services;
          this.removefromarr(arr,v);
          this.deleteAllLinks(v);
        });
        break;
        
      case mode.selectingQ:
        this.service.removeQ(<Q>v).subscribe((data:any)=>{
          console.log(data);
          arr=this.queues
          this.removefromarr(arr,v);
          this.deleteAllLinks(v);
        });
        break;
      
      case mode.selectingLink:
        if((<link>this.selected).from instanceof Q &&(<link>this.selected).to instanceof M ){
          this.service.delinkQ_M(<Q>(<link>this.selected).from,<M>(<link>this.selected).to).subscribe((data:any)=>{
            console.log(data);
            arr=this.links;
            this.removefromarr(arr,v);
          })
        }
        else if((<link>this.selected).from instanceof M &&(<link>this.selected).to instanceof Q ){
          this.service.delinkM_Q(<M>(<link>this.selected).from).subscribe((data:any)=>{
            console.log(data);
            arr=this.links;
            this.removefromarr(arr,v);
          })
        }
        break;

      default:
        return;
    }
  }
  private removefromarr(arr:IViewable[],v:IViewable){
    for(var i=0;i<arr.length;i++){
      if(v==arr[i]){
        arr.splice(i,1);
        return;
      }
    }
  }
  resetSelection(e:MouseEvent){
    // if(this.MODE==mode.selectingQ||this.MODE==mode.selectingM){
    //   console.log("resetted selection")
    //   this.MODE=mode.linking;
    // }
    if(this.MODE==mode.creatingM){
      console.log("just created a machine")
      this.addM(e);
    }
    else if(this.MODE==mode.creatingQ){
      console.log("just created a queue")
      this.addQ(e);
    }
  }
  setQ(){
    this.MODE=mode.creatingQ;
  }
  setM(){
    this.MODE=mode.creatingM;
  }
  mouseUp(v:IViewable){
    console.log("mouse left:");
    console.log(v);
    console.log("links:");
    console.log(this.links);
    if(this.MODE==mode.selectingM&&v instanceof Q){
      this.service.linkM_Q(<M>this.selected,v).subscribe(data=>{
        console.log(data);
        if(<string>data==="F"){
          window.alert("The Service Already Got a Consumer");
          return;
        }
        else if(<string>data==="S"){
        this.links.push(new link(this.selected,v));
        }
      })
      
    }else if(this.MODE==mode.selectingQ && v instanceof M){
      this.service.linkQ_M(<Q>this.selected,v).subscribe(data=>{
        console.log(data);
        if(<string>data==="F"){
          window.alert("The same queue can't provide and consume the same machine");
          return;
        }
        else if(<string>data==="S"){
        this.links.push(new link(this.selected,v));
        }
      })
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
    if(e.key==='m'||e.key==="M"){
      this.MODE=mode.creatingM;
    } 
    if(e.key==='q'||e.key==="Q"){
      this.MODE=mode.creatingQ;
    }
  }
  keyQ(e:MouseEvent,q:Q){
    if(e.shiftKey){
      this.service.setq0(q.id).subscribe(data=>{
        if(this.selectedQ){
          this.selectedQ.color="#84b3bb"
        }
        console.log(data);
        this.selectedQ=q;
        // q.color="#A0b199";
        q.color="deepskyblue";
      });
    }
  }

addQ(ev:MouseEvent){
  this.service.addQ().subscribe((data:any)=>{
    console.log(data);
    let q=new Q(data,ev.clientX-this.getOffset().left,ev.clientY-this.getOffset().top);
    this.queues.push(q);
    })
  }
  addM(ev:MouseEvent){
    this.service.addM().subscribe((data:any)=>{
      console.log(data);
      var m=new M(data,ev.clientX-this.getOffset().left,ev.clientY-this.getOffset().top,100);
      this.services.push(m);
    })
  }
  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(u:string){
 
    console.log((u as string).replace("\n",""));
  
    var up=JSON.parse((u as string).replace("\n",""));
    let q=this.getV(this.queues,up.idQ);
    q.update(up.qnumber,up.qTNumber);
    if(up.idM==="before"||up.idM==='input'){
      return;
    }
    let m=this.getV(this.services,up.idM);
    m.update(up.mfree,up.mColor);
  }
  async replay(){
    ( document.getElementById("resume") as HTMLInputElement).disabled=true;
    this.service.replay().subscribe(history=>{
      console.log(history)
      let i=0;
      let arr=history as any
      console.log(arr)
      this.turnOff()
      while((arr[i]!.idM==="before")){
        let q=this.getV(this.queues,arr[i].idQ);
        q.update(arr[i].qnumber,arr[i].qTNumber)
        i++;
      }
      let st=Date.now()
      let m=this.getV(this.services,arr[i].idM);
      m.update(arr[i].mfree,arr[i].mColor)
      let q=this.getV(this.queues,arr[i].idQ);
      q.update(arr[i].qnumber,arr[i].qTNumber)
      i++;
      // while(i<arr.length){

      let t=0
      for (var j=i;  j< arr.length ; j++){
          t+=arr[j].duration
        setTimeout(this.updateA.bind(this), t, arr[j])
        console.log(t)
        if(j==arr.length-1&&this.simulting){

          setTimeout(()=>{          
            ( document.getElementById("resume") as HTMLInputElement).disabled=false;
          }, t)

        }
      }
    })
    
  }
  updateA(x:any){
    let m=this.getV(this.services,x.idM);
    console.warn(m)
    m.update(x.mfree,x.mColor)
    let q=this.getV(this.queues,x.idQ);
    console.warn(q)
    q.update(x.qnumber,x.qTNumber)
    console.log(x)
  }
  private delay(ms: number)
  {
    console.log(ms)
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  turnOff(){
      for (var i=0;i<this.services.length;i++){
        (this.services[i] as M).turnOff()
    }
  }
  getV(arr:IViewable[], id:string ){
    for (var i=0;i<arr.length;i++) {
      if(arr[i].id===id){
        return arr[i];
      }
    }
    throw new Error("couldn't find the id :"+id);
  }

  deleteAllLinks(v:IViewable){
    for (let index = 0; index < this.links.length; index++) {
      let l = this.links[index];
      if (l.from==v||l.to==v){
        console.log("yes");
        this.links.splice(index,1);
        index--;
      }
    }
  }
  changeRate(e:any){
    if(!this.selectedQ){window.alert("Pick a starting queue first by holding shift while clicking on a queue");return;}
    this.service.setinput(e.target.value).subscribe(data=>{
      console.log(data);    
    });
  }
  inputProducts(e:any){
    if(this.selected instanceof Q){
      this.service.inputProducts(e.target.value,this.selected).subscribe(data=>{
        console.log(data);    
      });
    }
  }
  start(){
    
    this.service.start().subscribe(data=>{
      console.log(data); 
      if(data==="cant start"){
        window.alert("cannot start please connect every machine");

        return;
      }   
      this.simulting=true;
      ( document.getElementById("Q") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("M") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("delete") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("start") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("resume") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("FastBack") as HTMLInputElement).disabled=this.simulting;
      // ( document.getElementById("Back") as HTMLInputElement).disabled=this.simulting;
    })
    
  }
  new(){
    this.service.new().subscribe(x=>{
      console.log(x)
      this.queues=[];
      this.services=[];
      this.links=[];
      this.simulting=false;
      ( document.getElementById("Q") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("M") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("delete") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("start") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("resume") as HTMLInputElement).disabled=this.simulting;
      ( document.getElementById("FastBack") as HTMLInputElement).disabled=this.simulting;
    })
  }
  stop(){
    this.service.stop().subscribe(data=>{
      console.log(data);
      this.simulting=false;
      ( document.getElementById("Q") as HTMLInputElement).disabled=true;
      ( document.getElementById("M") as HTMLInputElement).disabled=true;
      ( document.getElementById("delete") as HTMLInputElement).disabled=true;
      ( document.getElementById("start") as HTMLInputElement).disabled=true;
      ( document.getElementById("resume") as HTMLInputElement).disabled=true;
      ( document.getElementById("FastBack") as HTMLInputElement).disabled=false;
    
    })
  }
  pause(){
    this.service.pause().subscribe(data=>{
      console.log(data);    
      ( document.getElementById("resume") as HTMLInputElement).disabled=false;
      ( document.getElementById("pause") as HTMLInputElement).disabled=true;
      ( document.getElementById("FastBack") as HTMLInputElement).disabled=false;

    
    })
  }
  pauseRate(){
    this.service.pauseRate().subscribe(x=>{
      console.log(x)
    })
  }
  conRate(){
    this.service.conRate().subscribe(x=>{
      console.log(x)
    })
  }
  resume(){
    this.service.resume().subscribe(data=>{
      console.log(data);
      ( document.getElementById("pause") as HTMLInputElement).disabled=false;    
      ( document.getElementById("FastBack") as HTMLInputElement).disabled=true;
      // ( document.getElementById("Back") as HTMLInputElement).disabled=true;   
    })
  }
  // replayO(){
  //     this.service.replayO().subscribe(x=>{
  //       console.log(x);
  //     })
  // }
  // // Need test
  // replay() {
  //   this.service.replay().subscribe(data => {
  //     console.log(data);    
  //     this.simulting = true;
  //     (document.getElementById("Q") as HTMLInputElement).disabled = this.simulting;
  //     (document.getElementById("M") as HTMLInputElement).disabled = this.simulting;
  //     (document.getElementById("delete") as HTMLInputElement).disabled = this.simulting;
  //     (document.getElementById("start") as HTMLInputElement).disabled = this.simulting;
  //     (document.getElementById("resume") as HTMLInputElement).disabled = this.simulting;
  //   })    
  // }
  
}