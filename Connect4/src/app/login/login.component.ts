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

  constructor(private router: Router, private data: DataService) { }

  ngOnInit(): void {
  }

  signIn(): void {
    this.data.setPlayer(this.username);
    this.router.navigate(["home"]);
  }

}
