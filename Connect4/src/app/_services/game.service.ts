import { GameComponent } from './../game/game.component';
import { WebsocketService } from './websocket.service';
import { Injectable } from '@angular/core';
import { CircleState } from '../_enums/CircleState';
import { Disc } from '../_models/Disc';
import { Point } from '../_models/Point';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  grid: Disc[][]
  turn: number;
  gameComponent: GameComponent;

  constructor(private ws: WebsocketService) {
    this.ws.placeDiscMessageState.subscribe(message => this.placeDisc(message));
  }

  setComponent(gameComponent: GameComponent){
    this.gameComponent = gameComponent;
  }

  initGrid(gridWidth, gridHeight): void {
    this.grid = [];
    for (let x = 0; x < gridWidth; x++) {
      const row = [];
      for (let y = 0; y < gridHeight; y++) {
        row.push(new Disc(new Point(x, y), CircleState.NotClicked));
      }
      this.grid.push(row);
    }
  }

  findCircle(mx): Disc {
    for (let x = 0; x < this.grid.length; x++) {
      if (x == mx) {
        for (var y = this.grid[x].length - 1; y >= 0; y--) {
          const circle = this.grid[x][y];
          if (circle.getCircleState() == CircleState.NotClicked) {
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
    if (message.discIsPlaced) {
      let disc = this.findCircle(message.disc.point.x);
      disc.setCircleState(this.turn);
      this.gameComponent.placeDisc(message, disc);
      this.setTurn(message.turn);
    } else {
      // show some error or something;
    }
  }

  setTurn(turn: number): void {
    this.turn = turn;
  }

  // placeDisc(x): Disc{
  //   let disc = this.findCircle(x);
  //   disc.setCircleState(this.turn);
  //   this.players[this.turn].discCount -= 1;
  //   this.switchTurn();
  //   return disc;
  // }

  // update(disc): void {
  //   if (this.checkWin(disc)) {
  //     alert();
  //   }
  //   this.switchTurn();
  // }

  // checkWin(disc): boolean {
  //   if (this.players[this.turn].discCount < 18) {
  //     // check vertical
  //     if (this.checkVerticalWin(disc)) { return true; }

  //     // check horizontal
  //     if (this.checkHorizontalWin(disc)) { return true; }

  //     // check diagonal /
  //     if (this.checkDiagonalForwardSlash(disc)) { return true; }

  //     // check diagonal \
  //     if (this.checkDiagonalBackwardSlash(disc)) { return true; }
  //   }
  //   return false;
  // }

  // checkVerticalWin(disc): boolean {
  //   if (disc.y < 3) {
  //     if (disc.circleState == this.grid[disc.x][disc.y + 1].circleState) {
  //       if (disc.circleState == this.grid[disc.x][disc.y + 2].circleState) {
  //         if (disc.circleState == this.grid[disc.x][disc.y + 3].circleState) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // checkHorizontalWin(disc): boolean {
  //   let _this = this;
  //   let leftCount = 0;
  //   let rightCount = 0;

  //   checkLeft(1);

  //   if (leftCount + rightCount == 3) { return true; }
  //   return false;

  //   function checkLeft(incr): void {
  //     if (_this.grid[disc.x - incr] != undefined) {
  //       if (_this.grid[disc.x - incr][disc.y].circleState == disc.circleState) {
  //         leftCount++;
  //         checkLeft(++incr);
  //       } else {
  //         checkRight(1);
  //       }
  //     } else {
  //       checkRight(1);
  //     }
  //   }

  //   function checkRight(incr): void {
  //     if (_this.grid[disc.x + incr] != undefined) {
  //       if (_this.grid[disc.x + incr][disc.y].circleState == disc.circleState) {
  //         rightCount++;
  //         this.checkRight(++incr);
  //       }
  //     }
  //   }
  // }

  // checkDiagonalForwardSlash(disc): boolean {
  //   let _this = this;
  //   let leftCount = 0;
  //   let rightCount = 0;

  //   checkLeft(1);

  //   if (leftCount + rightCount == 3) { return true; }
  //   return false;

  //   function checkLeft(incr): void {
  //     if (_this.grid[disc.x - incr] != undefined && _this.grid[disc.x - incr][disc.y + incr] != undefined) {
  //       if (_this.grid[disc.x - incr][disc.y + incr].circleState == disc.circleState) {
  //         leftCount++;
  //         checkLeft(++incr);
  //       } else {
  //         checkRight(1);
  //       }
  //     } else {
  //       checkRight(1);
  //     }
  //   }

  //   function checkRight(incr): void {
  //     if (_this.grid[disc.x + incr] != undefined && _this.grid[disc.x + incr][disc.y - incr] != undefined) {
  //       if (_this.grid[disc.x + incr][disc.y - incr].circleState == disc.circleState) {
  //         rightCount++;
  //         checkRight(++incr);
  //       }
  //     }
  //   }
  // }

  // checkDiagonalBackwardSlash(disc): boolean {
  //   let _this = this;
  //   let leftCount = 0;
  //   let rightCount = 0;

  //   checkLeft(1);

  //   if (leftCount + rightCount == 3) { return true; }
  //   return false;

  //   function checkLeft(incr): void {
  //     if (_this.grid[disc.x - incr] != undefined && _this.grid[disc.x - incr][disc.y - incr] != undefined) {
  //       if (_this.grid[disc.x - incr][disc.y - incr].circleState == disc.circleState) {
  //         leftCount++;
  //         checkLeft(++incr);
  //       } else {
  //         checkRight(1);
  //       }
  //     } else {
  //       checkRight(1);
  //     }
  //   }

  //   function checkRight(incr): void {
  //     if (_this.grid[disc.x + incr] != undefined && _this.grid[disc.x + incr][disc.y + incr] != undefined) {
  //       if (_this.grid[disc.x + incr][disc.y + incr].circleState == disc.circleState) {
  //         rightCount++;
  //         checkRight(++incr);
  //       }
  //     }
  //   }
  // }
}
