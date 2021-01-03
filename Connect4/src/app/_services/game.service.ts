import { GameComponent } from './../game/game.component';
import { WebsocketService } from './websocket.service';
import { Injectable } from '@angular/core';
import { DiscState } from '../_enums/CircleState';
import { Disc } from '../_models/Disc';
import { Point } from '../_models/Point';
import { MessageType } from '../_enums/MessageType';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  grid: Disc[][]
  turn: number;
  gameComponent: GameComponent;

  constructor(private ws: WebsocketService) {
    this.ws.placeDiscMessageState.pipe(skip(1)).subscribe(message => this.placeDisc(message));
  }

  setComponent(gameComponent: GameComponent) {
    this.gameComponent = gameComponent;
  }

  initGrid(gridWidth, gridHeight): void {
    this.grid = [];
    for (let x = 0; x < gridWidth; x++) {
      const row = [];
      for (let y = 0; y < gridHeight; y++) {
        row.push(new Disc(new Point(x, y), DiscState.NotClicked));
      }
      this.grid.push(row);
    }
  }

  findCircle(mx): Disc {
    for (let x = 0; x < this.grid.length; x++) {
      if (x == mx) {
        for (var y = this.grid[x].length - 1; y >= 0; y--) {
          const circle = this.grid[x][y];
          if (circle.getDiscState() == DiscState.NotClicked) {
            return circle;
          }
        }
      }
    }
  }

  tryPlaceDisc(x): void {
    this.ws.sendPlaceDiscMessage(x);
  }

  placeDisc(message) {
    let disc = this.findCircle(message.disc.point.x);
    disc.setDiscState(this.turn);
    this.gameComponent.placeDisc(message.turn, disc);
    this.gameComponent.setPlayers(message);

    if (message.messageType == MessageType.GAME_WON) {
      this.gameComponent.showWin(message.player, message.winningDiscs);
    } else {
      this.setTurn(message.turn);
    }
  }

  rowNotFull(x): boolean {
    return this.grid[x][0].getDiscState() == DiscState.NotClicked;
  }

  setTurn(turn: number): void {
    this.turn = turn;
  }
}
