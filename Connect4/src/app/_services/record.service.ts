import { GameResult } from './../_enums/GameResult';
import { Record } from './../_models/Record';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private url = "/record";

  constructor(private http: HttpClient, private data: DataService) { }

  getRecord(playerId): Observable<any> {
    let url = this.data.dataServerBaseURL + this.url + "/" + playerId;
    return this.http.get<any>(url);
  }

  
  updateRecord(gameResult: GameResult) {
    let url = this.data.dataServerBaseURL + this.url;
    let body = {
      playerId: this.data.playerId,
      gameResult: gameResult
    }
    return this.http.post<any>(url, body);
  }
}
