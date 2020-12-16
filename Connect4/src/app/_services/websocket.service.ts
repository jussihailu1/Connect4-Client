import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private webSocketEndPoint: string = 'http://localhost:8080/ws';
  private stompClient: any;

  // Temporary
  private topic: string = "/topic/Jussi";

  constructor() {
    this._connect;
  }

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    let _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe("/topic/Jussi", function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  // on error, schedule a reconnection attempt
  private errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }
  
  private onMessageReceived(message) {
    console.log(message.body);
    // this.handleMessage(JSON.parse(message.body));
  }

  test() {
    this.stompClient.send("/app/Test", {}, JSON.stringify({senderDestination: "Piet"}));
  }
}
