import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = "/account/login";
  private registerUrl = "/account/login";
  private numbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  private letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  private logInMessage = new BehaviorSubject<any>({});
  logInMessageState = this.logInMessage.asObservable();

  constructor(private http: HttpClient, private data: DataService) { }

  login(username: string, password: string): Observable<any> {
    let url = this.data.dataServerBaseURL + this.loginUrl;
    let body = {
      username: username,
      password: password
    }
    return this.http.post<any>(url, body);
  }

  register(){
    // ...
  }

  setLoginData(playerId: number): void {
    localStorage.setItem("loggedIn", true.toString());
    this.data.playerId = playerId;
    this.logInMessage.next({});
  }

  generateGuest(): string {
    let usernamePrefix = "Guest-";
    let usernameLength = 5;
    let usernameId = "";
    let array: any[];

    for (let i = 0; i < usernameLength; i++) {
      array = Math.random() < 0.5 ? this.letters : this.numbers;
      usernameId += array[Math.round(Math.random() * array.length)];
    }

    let guestUsername = usernamePrefix + usernameId;
    return guestUsername;
  }
}
