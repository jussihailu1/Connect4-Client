import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  foundGame(): void{
    this.router.navigate(["game"]);
  }

}
