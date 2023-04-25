import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerAPI } from './models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  URL = '';

  constructor(private httpClient: HttpClient) {}


  getPlayers() {
    return this.httpClient.get<PlayerAPI[]>(this.URL);
  }

  getPlayersById() {
    return this.httpClient.get<PlayerAPI[]>(this.URL);
  }

}
