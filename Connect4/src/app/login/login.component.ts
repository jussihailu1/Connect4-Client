import { WebsocketService } from './../_services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    // temporary
    private ws: WebsocketService) { }

  ngOnInit(): void {
    this.ws._connect();
    // this.ws.test()
  }

  signIn(): void{
    this.ws.test();
    // this.router.navigate(["home"]);
  }

}
