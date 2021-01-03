import { DataService } from './../_services/data.service';
import { Player } from './../_models/Player';
import { GameService } from './../_services/game.service';
import { toTypeScript } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DiscState } from '../_enums/CircleState';
import { Disc } from '../_models/Disc';
import { Point } from '../_models/Point';
import { Router } from '@angular/router';

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
  turn: number;
  prevDisc: Disc;
  players: Player[];
  myTurn: boolean;
  gameDone: boolean;
  winnerUsername: string;
  me: Player;
  opponent: Player;
  myDiscImg: string;
  opponentsDiscImg: string;

  constructor(private data: DataService, private game: GameService, private router: Router) { }

  ngOnInit(): void {
    this.players = this.data.players;
    this.turn = this.data.turn;
    this.game.turn = this.data.turn;
    this.gameDone = false;
    this.setMyTurn();
    this.setPlayers();
    this.setDiscImgs();
    this.game.setComponent(this);
    this.setSizes();
    this.setupCanvas();
    this.game.initGrid(this.gridWidth, this.gridHeight);
    this.drawGrid();

    this.cvs.onclick = (m) => {
      if (this.myTurn && !this.gameDone) {
        let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth);
        if (x >= 0 && this.game.rowNotFull(x)) {
          console.log(this.data.player.id);
          this.game.tryPlaceDisc(x);
          this.hover(x);
        }
      }
    }

    this.cvs.onmousemove = (m) => {
      if (this.myTurn && !this.gameDone) {
        let x = Math.floor((m.x - this.cvs.offsetLeft) / this.squareWidth);
        if (x >= 0) { this.hover(x) };
      }
    }
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

  private getCircleColor(circleState: DiscState): string {
    switch (circleState) {
      case DiscState.NotClicked:
        return "white";
      case DiscState.P1:
        return this.data.player.id == 0 ? this.data.myColor : this.data.opponentsColor;
      case DiscState.P2:
        return this.data.player.id == 1 ? this.data.myColor : this.data.opponentsColor;
      case DiscState.HoverP1:
        return "grey";
      case DiscState.HoverP2:
        return "grey";
      default:
        break;
    }
  }

  private hover(x): void {
    if (this.game.rowNotFull(x)) {
      let disc: Disc = this.game.findCircle(x);
      try {
        this.drawCircle(this.prevDisc);
      } catch (error) { }
      this.prevDisc = disc;
      this.drawCircle(disc, this.turn + 2);
    }
  }

  private setMyTurn(): void {
    this.myTurn = this.turn == this.data.player.id;
  }

  private setDiscImgs() {
    this.myDiscImg = "assets/" + this.data.myColor + "-disc.png";
    this.opponentsDiscImg = "assets/" + this.data.opponentsColor + "-disc.png";
  }

  setPlayers(message?) {
    this.players = message == undefined ? this.data.players : message.players;
    this.me = this.players[this.data.player.id];
    this.opponent = this.players[1 - this.data.player.id];
  }

  placeDisc(turn: number, disc: Disc) {
    this.drawCircle(disc);
    this.turn = turn;
    this.setMyTurn();
  }

  drawCircle(disc: Disc, circleState?: DiscState): void {
    this.ctx.beginPath();
    this.ctx.arc(
      disc.getPoint().getX() * this.squareWidth + this.halfSquareWidth,
      disc.getPoint().getY() * this.squareWidth + this.halfSquareWidth,
      this.halfSquareWidth * 0.8,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = circleState == undefined ? this.getCircleColor(disc.getDiscState()) : this.getCircleColor(circleState);
    this.ctx.fill();
  }

  showWin(player: Player, winningDiscs: Disc[]): void {
    this.gameDone = true;
    this.winnerUsername = player.username;
    this.outlineWinningDiscs(winningDiscs);
  }

  outlineWinningDiscs(winningDiscs): void {
    const lineWidth = 6;

    for (const disc of winningDiscs) {
      this.ctx.beginPath();
      this.ctx.arc(
        disc.point.x * this.squareWidth + this.halfSquareWidth,
        disc.point.y * this.squareWidth + this.halfSquareWidth,
        this.halfSquareWidth * 0.8 + lineWidth / 2,
        0,
        2 * Math.PI
      )
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  goHome(){
    this.router.navigate(["home"]);
  }

  playAgain(){
    this.router.navigate(["loading"]);
  }
}
