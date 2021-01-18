import { ServerResponse } from './_enums/ServerResponse';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';
import { DataService } from './_services/data.service';
import { Component } from '@angular/core';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Connect4';

  loggedIn: boolean;

  constructor(private router: Router, private loginService: LoginService) {
    this.loginService.logInMessageState.pipe(skip(1)).subscribe(() => this.loggedIn = true);

    if (!JSON.parse(localStorage.getItem("loggedIn"))) {
      this.loggedIn = false;
      this.router.navigate(['login']);
    } else{
      this.loggedIn = true;
    }
  }

  logOut() {
    this.loggedIn = false;
    localStorage.setItem("loggedIn", false.toString());
    this.router.navigate(['login'])
  }
}
