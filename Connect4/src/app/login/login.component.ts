import { ServerResponse } from './../_enums/ServerResponse';
import { LoginService } from './../_services/login.service';
import { DataService } from './../_services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginFailed: boolean;

  constructor(private loginService: LoginService, private router: Router, private data: DataService) { }

  ngOnInit(): void {
    this.loginFailed = false;
  }

  logIn(): void {
    this.loginService.login(this.username, this.password).subscribe(response => {
      console.log(response);
      if (response.message == ServerResponse.SUCCESS) {
        this.loginSucces(response.content);

      } else if (response.message == ServerResponse.WRONG_CREDENTIALS) {
        this.loginFailed = true;
      }
    }, error => console.log(error))
  }

  playAsGuest(): void {
    this.username = this.loginService.generateGuest();
    this.loginSucces(-1);
  }

  loginSucces(playerId: number): void {
    this.loginService.setLoginData(playerId);
    this.data.setPlayer(this.username);
    this.loginFailed = false;
    this.router.navigate(["home"]);
  }
}
