import { Record } from './../_models/Record';
import { ServerResponse } from './../_enums/ServerResponse';
import { RecordService } from './../_services/record.service';
import { DataService } from './../_services/data.service';
import { WebsocketService } from './../_services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color } from '../_enums/Color';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username: string;
  myColor: string;
  opponentsColor: string;
  colors: string[];
  record: Record;
  playerIsGuest: boolean;
  recordDataLoaded: boolean;

  constructor(private router: Router, private data: DataService, private ws: WebsocketService, private recordService: RecordService) { }

  ngOnInit(): void {
    this.playerIsGuest = false;
    this.record = undefined;
    this.recordDataLoaded = false;
    this.setColors();
    this.username = this.data.player.username;
    this.ws.connect(this.data.player.username);
    this.playerIsGuest = this.data.playerIsGuest;
    if (!this.playerIsGuest) {
      this.getAndSetRecord();
    }else{
      this.recordDataLoaded = true;
    }
  }

  private getAndSetRecord() {
    this.recordService.getRecord(this.data.playerId).subscribe(response => {
      if (response.message == ServerResponse.SUCCESS) {
        this.data.record = response.content;
        this.record = response.content;
        this.recordDataLoaded = true;
      } else {
        console.log("ERROR");
      }
    })
  }

  private setColors() {
    this.myColor = "Red";
    this.opponentsColor = "Yellow";

    let keys = Object.keys(Color);
    this.colors = keys.slice(keys.length / 2);
  }

  searchGame(): void {
    if (this.myColor == this.opponentsColor) {
      // pop-up error with: "You and opponent cannot have same color"
    } else {
      this.data.setColors(this.myColor, this.opponentsColor);
      this.router.navigate(["loading"]);
    }
  }

}
