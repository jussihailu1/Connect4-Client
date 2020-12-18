import { DataService } from './../_services/data.service';
import { MessageType } from './../_enums/MessageType';
import { WebsocketService } from './../_services/websocket.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs/operators';
import { Player } from '../_models/Player';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    private router: Router,
    private data: DataService,
    private ws: WebsocketService
  ) { }

  ngOnInit(): void {
    this.ws.searchGameResponseState.pipe(skip(1)).subscribe(message => {
      this.foundGame(message);
    });
    this.ws.sendSearchMatchMessage();
  }

  foundGame(message) {
    let opponent = message.players.find(p => p.username != this.data.player.username)
    this.data.setOpponent(opponent);
    this.data.lobbyId = message.lobbyId;
    this.router.navigate(["game"]);
  }
}
