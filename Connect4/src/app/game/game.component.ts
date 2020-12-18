import { DataService } from './../_services/data.service';
import { Player } from './../_models/Player';
import { GameService } from './../_services/game.service';
import { toTypeScript } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CircleState } from '../_enums/CircleState';
import { Disc } from '../_models/Disc';
import { Point } from '../_models/Point';

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
  // CircleState = Object.freeze({ P1: 0, P2: 1, HoverP1: 2, HoverP2: 3, NotClicked: 4 });
  // grid = [];
  turn: number;
  prevDisc: Disc;
  players: Player[];
  myTurn: boolean;

  constructor(private data: DataService, private game: GameService) { }

  ngOnInit(): void {
    this.players = [];
    this.players.push(this.data.player);
    this.players.push(this.data.opponent);
    this.turn = 0; // ?
    this.game.turn = this.turn // ?
    // TODO: this.turn = this.data.turn ? 
    this.myTurn = true; // TODO: this needs to come from server.

    this.game.setComponent(this);
    this.setSizes();
    this.setupCanvas();
    this.game.initGrid(this.gridWidth, this.gridHeight);
    this.drawGrid();

    this.cvs.onclick = (m) => {
      if (this.myTurn) {
        let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth);
        if (x >= 0) {
          this.game.tryPlaceDisc(x);
          this.hover(x);
        }
      }
    }

    this.cvs.onmousemove = (m) => {
      if (this.myTurn) {
        let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth);
        if (x >= 0) { this.hover(x) };
      }
    }
  }

  setPlayers(players: Player[]){
    this.players = players;
  }

  private setSizes(): void {
    this.gridHeight = 6;
    this.gridWidth = this.gridHeight * (7 / 6);
    this.squareWidth = 80; // controls size of canvas
    this.halfSquareWidth = this.squareWidth / 2;
  }

  private setupCanvas(): void {
    this.cvs = this.canvas.nativeElement;
    this.cvs.width = this.gridWidth * this.squareWidth;
    this.cvs.height = this.gridHeight * this.squareWidth;
    this.ctx = this.cvs.getContext('2d');
  }

  private drawGrid(): void {
    this.ctx.rect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();

    for (let x = 0; x < this.game.grid.length; x++) {
      for (let y = 0; y < this.game.grid[x].length; y++) {
        const disc: Disc = this.game.grid[x][y];
        this.drawCircle(disc);
      }
    }
  }

  drawCircle(disc: Disc, circleState?: CircleState): void {
    this.ctx.beginPath();
    this.ctx.arc(
      disc.getPoint().getX() * this.squareWidth + this.halfSquareWidth,
      disc.getPoint().getY() * this.squareWidth + this.halfSquareWidth,
      this.halfSquareWidth * 0.8,
      0,
      2 * Math.PI
    )
    // TODO: check incoming circlestate for hovering and placing / check fillstyle
    this.ctx.fillStyle = circleState == undefined ? this.getCircleColor(disc.getCircleState()) : this.getCircleColor(circleState);
    this.ctx.fill();
  }

  private getCircleColor(circleState: CircleState): string {
    switch (circleState) {
      case CircleState.NotClicked:
        return "white";
      case CircleState.P1:
        return "red";
      case CircleState.P2:
        return "yellow";
      case CircleState.HoverP1:
        return "pink";
      case CircleState.HoverP2:
        return "khaki";
      default:
        break;
    }
  }

  // placeDisc(x): void {
  //   this.game.placeDisc(x);
  //   let disc = this.findCircle(x);
  //   disc.setCircleState(this.turn);
  //   this.players[this.turn].discCount -= 1;
  //   this.drawCircle(disc);
  //   this.update(disc);
  // }

  private hover(mx): void {
    let disc: Disc = this.game.findCircle(mx);
    try {
      this.drawCircle(this.prevDisc);
    } catch (error) { }
    this.prevDisc = disc;
    this.drawCircle(disc, this.turn + 2);
  }
}
