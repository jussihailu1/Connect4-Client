import { DataService } from './../_services/data.service';
import { WebsocketService } from './../_services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private data: DataService, private ws: WebsocketService) { }

  ngOnInit(): void {
    this.ws.connect(this.data.player.username);
  }

  searchGame(): void {
    this.router.navigate(["loading"]);
  }

}
