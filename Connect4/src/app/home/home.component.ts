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

  constructor(private router: Router, private data: DataService, private ws: WebsocketService) { }

  ngOnInit(): void {
    this.setColors();
    this.username = this.data.player.username;
    this.ws.connect(this.data.player.username);
  }

  private setColors(){
    this.myColor = "Red";
    this.opponentsColor = "Yellow";

    let keys = Object.keys(Color);
    this.colors = keys.slice(keys.length / 2);
  }

  searchGame(): void {
    if(this.myColor == this.opponentsColor){
      // pop-up error with: "You and opponent cannot have same color"
    }else{
      this.data.setColors(this.myColor, this.opponentsColor);      
      this.router.navigate(["loading"]);
    }
  }

}
