// import { Injectable } from '@angular/core';

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Q } from './components/Q';
// import { M } from './components/M';

// // import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ControllerService {
//   url = 'http://localhost:8080/sim/' ;
//   headeroption = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };
//   constructor(private http: HttpClient) { }

//   public start():Observable<Object>{
//     return this.http.get(this.url+"start");
//   }
//   public stop():Observable<Object>{
//     return this.http.get(this.url+"stop");
//   }
//   public pause():Observable<Object>{
//     return this.http.get(this.url+"pause");
//   }
//   public resume():Observable<Object>{
//     return this.http.get(this.url+"resume");
//   }
//   public replay():Observable<Object>{
//     return this.http.get(this.url+"replay");
//   }
//   public replayO():Observable<Object>{
//     return this.http.get(this.url+"replayO");
//   }
//   public new():Observable<Object>{
//     return this.http.get(this.url+"new");
//   }
//   public setq0(idq:string):Observable<Object>{
//     return this.http.get(this.url+"input"+"/"+idq+"/q0");
//   }
//   public setinput(rate:number):Observable<Object>{
//     return this.http.get(this.url+"input"+"/"+rate);
//   }
//   pauseRate(){
//     return this.http.get(this.url+"stopRate");
//   }
//   conRate(){
//     return this.http.get(this.url+"conRate");
//   }
//   public inputProducts(amount:number,q:Q):Observable<Object>{
//     return this.http.get(this.url+"input"+"/"+q.id+"/"+amount);
//   }
//   public addQ():Observable<Object>{
//     return this.http.get(this.url+"addQ");
//   }

//   public addM():Observable<Object>{
//     return this.http.get(this.url+"addM");
//   }
//   public removeQ(q:Q):Observable<Object>{
//     return this.http.delete(this.url+"removeQ/"+q.id);
//   }
//   public removeM(m:M):Observable<Object>{
//     return this.http.delete(this.url+"removeM/"+m.id);
//   }
//   public linkQ_M(q:Q,m:M){
//     //    @GetMapping("/linkQM/{idq}/{idm}")
//     return this.http.get(this.url+"linkQM/"+q.id+"/"+m.id);
//   }
//   public delinkQ_M(q:Q,m:M){
//     //    @GetMapping("/delink/{idq}/{idm}")
//     return this.http.delete(this.url+"delink/"+q.id+"/"+m.id);
//   }
//   public delinkM_Q(m:M){
//     //    @GetMapping("/delink/{idm}")
//     return this.http.delete(this.url+"delink/"+m.id);
//   }
//   public linkM_Q(q:M,m:Q){
//     //    @GetMapping("/linkQM/{idq}/{idm}")
//     return this.http.get(this.url+"linkMQ/"+q.id+"/"+m.id);
//   }
// }
