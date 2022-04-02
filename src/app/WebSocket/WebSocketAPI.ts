// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// import * as SockJS from 'sockjs-client';
// import * as Stomp from 'stompjs';
// import { AppComponent } from '../app.component';
// import { update } from '../Response/update';

// export class WebSocketAPI {
//     webSocketEndPoint: string = 'http://localhost:8080/sim';
//     topic: string = "/sim/update";
//     stompClient: any;
//     appComponent: AppComponent;
//     constructor(appComponent: AppComponent){
//         this.appComponent = appComponent;
//     }
//     _connect() {
//         let ws = new SockJS(this.webSocketEndPoint);
//         this.stompClient = Stomp.over(ws);
//         const _this = this;
//         _this.stompClient.connect({}, function (frame:any) {
//             console.log("connected to : "+frame);
//             _this.stompClient.subscribe(_this.topic, (up: any) => {
//                     console.log(up);
//                     _this.onMessageReceived(up.body);
//                 });
//         }, this.errorCallBack.bind(this));
//     };

//     _disconnect() {
//         if (this.stompClient !== null) {
//             this.stompClient.disconnect();
//         }
//         console.log("Disconnected");
//     }

//     // on error, schedule a reconnection attempt
//     errorCallBack(error:Error) {

//         console.log("trying again in 7 seconds ... ")
//         setTimeout(() => {
//             this._connect();
//         },7000)
//     }

//     _send(message:string) {
//         console.log("calling logout api via web socket");
//         this.stompClient.send("/app/hello", {}, JSON.stringify(message));
//     }

//     onMessageReceived(update:any) {
//         console.log("Message Recieved from Server :: " + update);
//         this.appComponent.handleMessage(update);
//     }
// }
