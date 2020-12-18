import { MessageType } from './../_enums/MessageType';
import { EndpointDestination } from './../_enums/EndpointDestination';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { Point } from '../_models/Point';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private webSocketEndPoint: string = 'http://localhost:8080/ws';
  private stompClient: any;
  private topic: string = "/topic/";
  private endpointPrefix = "/app/";
  private username: string;
  private matchId: number;
  
  private searchGameResponse = new BehaviorSubject<any>({});
  searchGameResponseState = this.searchGameResponse.asObservable();

  private placeDiscMessage = new BehaviorSubject<any>({});
  placeDiscMessageState = this.placeDiscMessage.asObservable();

  constructor() {
  }

  connect(username: string) {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    let _this = this;
    this.topic += username;
    this.username = username;
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  sendSearchMatchMessage() {
    let message = {
      username: this.username,
      senderDestination: this.topic
    }
    this.sendMessage(message, EndpointDestination.searchMatch);
  }

  sendPlaceDiscMessage(x: number){
    let message = {
      username: this.username,
      senderDestination: this.topic,
      matchId: this.matchId,
      point: new Point(x)
    }
    this.sendMessage(message, EndpointDestination.placeDisc);
  }

  // on error, schedule a reconnection attempt
  private errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect(this.username);
    }, 5000);
  }

  private onMessageReceived(message) {
    this.handleMessage(JSON.parse(message.body));
  }

  private handleMessage(message) {
    switch (message.messageType) {
      case MessageType.MATCH_FOUND:
        this.matchId = message.matchId;
        console.log(message);
        this.searchGameResponse.next(message);
        break;
      case MessageType.PLACE_DISC:
        this.placeDiscMessage.next(message);
        break;
      default:
        break;
    }
  }

  private sendMessage(message, destination: string) {
    destination = this.endpointPrefix + destination;
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }
}
