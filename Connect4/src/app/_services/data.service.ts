import { Record } from './../_models/Record';
import { Color } from './../_enums/Color';
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

  dataServerBaseURL: string = "http://localhost:8087";
  playerIsGuest: boolean;
  playerId: number;
  player: Player;
  turn: number;
  myTurn: boolean;
  players: Player[];
  myColor: string;
  opponentsColor: string;
  myHoverColor: string;
  opponentsHoverColor: string;
  record: Record;

  setPlayers(players: Player[]) {
    this.players = players;
    this.player.id = players.find(p => p.username == this.player.username).id;
  }

  setPlayer(username: string): void {
    this.player = new Player(username);
    this.playerIsGuest = this.playerId == -1;
  }

  setTurn(turn: number): void {
    this.turn = turn;
  }

  setColors(myColor: string, opponentsColor: string) {
    this.myColor = myColor.toLowerCase();
    this.opponentsColor = opponentsColor.toLowerCase();
  }

  // TODO: getJSColor function which returns js name of picked color i.e. hotpink instead of pink
}