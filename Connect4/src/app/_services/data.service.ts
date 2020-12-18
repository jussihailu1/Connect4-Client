import { MessageType } from './../_enums/MessageType';
import { skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Player } from './../_models/Player';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  player: Player;
  opponent: Player;
  lobbyId: number;

  constructor() {
  }

  setPlayer(username: string){
    this.player = new Player(username);
  }

  setOpponent(player: Player){
    this.opponent = this.opponent;
  }
}