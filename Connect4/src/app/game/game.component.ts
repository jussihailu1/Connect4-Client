import { toTypeScript } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Disc } from '../_models/Disc';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gridWidth: number;
  gridHeight: number;
  squareWidth: number;
  halfSquareWidth: number;
  CircleState = Object.freeze({ P1: 0, P2: 1, HoverP1: 2, HoverP2: 3, NotClicked: 4 });
  grid = [];
  turn = 0;
  prevCircle = {};
  players = [{ discCount: 21 }, { discCount: 21 }];

  constructor() { }

  ngOnInit(): void {
    this.cvs = this.canvas.nativeElement;
    this.ctx = this.cvs.getContext('2d');
    this.setSizes();
    this.setupCanvas();
    this.initGrid();
    this.drawGrid();

    this.cvs.onclick = (m) => {
      let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth)
      this.placeDisc(x);
      this.hover(x);
    }

    this.cvs.onmousemove = (m) => {
      let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth)
      this.hover(x);
    }
  }

  setSizes(): void {
    this.gridHeight = 6;
    this.gridWidth = this.gridHeight * (7 / 6);
    this.squareWidth = 80; // controls size of canvas
    this.halfSquareWidth = this.squareWidth / 2;
  }

  setupCanvas(): void {
    this.cvs.width = this.gridWidth * this.squareWidth;
    this.cvs.height = this.gridHeight * this.squareWidth;
  }

  initGrid(): void {
    for (let x = 0; x < this.gridWidth; x++) {
      const row = [];
      for (let y = 0; y < this.gridHeight; y++) {
        row.push(new Disc(x, y, this.CircleState.NotClicked));
      }
      this.grid.push(row);
    }
  }

  drawGrid(): void {
    this.ctx.rect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();

    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        const circle = this.grid[x][y];
        this.drawCircle(circle);
      }
    }
  }

  drawCircle(disc, circleState?): void {
    this.ctx.beginPath();
    this.ctx.arc(
      disc.x * this.squareWidth + this.halfSquareWidth,
      disc.y * this.squareWidth + this.halfSquareWidth,
      this.halfSquareWidth * 0.8,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = circleState == undefined ? this.getCircleColor(disc.circleState) : this.getCircleColor(circleState);
    this.ctx.fill();
  }

  getCircleColor(circleState): string {
    switch (circleState) {
      case this.CircleState.NotClicked:
        return "white";
      case this.CircleState.P1:
        return "red";
      case this.CircleState.P2:
        return "yellow";
      case this.CircleState.HoverP1:
        return "pink";
      case this.CircleState.HoverP2:
        return "khaki";
      default:
        break;
    }
  }

  placeDisc(mx): void {
    let disc = this.findCircle(mx);
    disc.setCircleState(this.turn);
    this.players[this.turn].discCount -= 1;
    this.drawCircle(disc);
    this.update(disc);
  }

  hover(mx): void {
    let circle = this.findCircle(mx);
    if (null != circle) {
      this.drawCircle(this.prevCircle)
    }
    this.prevCircle = circle;
    this.drawCircle(circle, this.turn + 2)
  }

  findCircle(mx): Disc {
    for (let x = 0; x < this.grid.length; x++) {
      if (x == mx) {
        for (var y = this.grid[x].length - 1; y >= 0; y--) {
          const circle = this.grid[x][y];
          if (circle.circleState == this.CircleState.NotClicked) {
            return circle;
          }
        }
      }
    }
  }

  update(disc): void {
    if (this.checkWin(disc)) {
      alert();
    }
    this.switchTurn();
  }

  checkWin(disc): boolean {
    if (this.players[this.turn].discCount < 18) {
      // check vertical
      if (this.checkVerticalWin(disc)) { return true; }

      // check horizontal
      if (this.checkHorizontalWin(disc)) { return true; }

      // check diagonal /
      if (this.checkDiagonalForwardSlash(disc)) { return true; }

      // check diagonal \
      if (this.checkDiagonalBackwardSlash(disc)) { return true; }
    }
    return false;
  }

  checkVerticalWin(disc): boolean {
    if (disc.y < 3) {
      if (disc.circleState == this.grid[disc.x][disc.y + 1].circleState) {
        if (disc.circleState == this.grid[disc.x][disc.y + 2].circleState) {
          if (disc.circleState == this.grid[disc.x][disc.y + 3].circleState) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkHorizontalWin(disc): boolean {
    let _this = this;
    let leftCount = 0;
    let rightCount = 0;

    checkLeft(1);

    if (leftCount + rightCount == 3) { return true; }
    return false;

    function checkLeft(incr): void {
      if (_this.grid[disc.x - incr] != undefined) {
        if (_this.grid[disc.x - incr][disc.y].circleState == disc.circleState) {
          leftCount++;
          checkLeft(++incr);
        } else {
          checkRight(1);
        }
      } else {
        checkRight(1);
      }
    }

    function checkRight(incr): void {
      if (_this.grid[disc.x + incr] != undefined) {
        if (_this.grid[disc.x + incr][disc.y].circleState == disc.circleState) {
          rightCount++;
          this.checkRight(++incr);
        }
      }
    }
  }

  checkDiagonalForwardSlash(disc): boolean {
    let _this = this;
    let leftCount = 0;
    let rightCount = 0;

    checkLeft(1);

    if (leftCount + rightCount == 3) { return true; }
    return false;

    function checkLeft(incr): void {
      if (_this.grid[disc.x - incr] != undefined && _this.grid[disc.x - incr][disc.y + incr] != undefined) {
        if (_this.grid[disc.x - incr][disc.y + incr].circleState == disc.circleState) {
          leftCount++;
          checkLeft(++incr);
        } else {
          checkRight(1);
        }
      } else {
        checkRight(1);
      }
    }

    function checkRight(incr): void {
      if (_this.grid[disc.x + incr] != undefined && _this.grid[disc.x + incr][disc.y - incr] != undefined) {
        if (_this.grid[disc.x + incr][disc.y - incr].circleState == disc.circleState) {
          rightCount++;
          checkRight(++incr);
        }
      }
    }
  }

  checkDiagonalBackwardSlash(disc): boolean {
    let _this = this;
    let leftCount = 0;
    let rightCount = 0;

    checkLeft(1);

    if (leftCount + rightCount == 3) { return true; }
    return false;

    function checkLeft(incr): void {
      if (_this.grid[disc.x - incr] != undefined && _this.grid[disc.x - incr][disc.y - incr] != undefined) {
        if (_this.grid[disc.x - incr][disc.y - incr].circleState == disc.circleState) {
          leftCount++;
          checkLeft(++incr);
        } else {
          checkRight(1);
        }
      } else {
        checkRight(1);
      }
    }

    function checkRight(incr): void {
      if (_this.grid[disc.x + incr] != undefined && _this.grid[disc.x + incr][disc.y + incr] != undefined) {
        if (_this.grid[disc.x + incr][disc.y + incr].circleState == disc.circleState) {
          rightCount++;
          checkRight(++incr);
        }
      }
    }
  }

  switchTurn(): void {
    this.turn = 1 - this.turn;
  }
}
