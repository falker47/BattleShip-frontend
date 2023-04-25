import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, PlayerAPI } from './models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  url = '';

  constructor(private httpClient: HttpClient) {}

  getPlayers() {
    return this.httpClient.get<PlayerAPI[]>(this.url);
  }

  getPlayersById() {
    return this.httpClient.get<Player[]>(this.url);
  }
}
