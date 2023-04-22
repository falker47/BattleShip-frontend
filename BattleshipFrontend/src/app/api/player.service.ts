import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, PlayerFront, Shot, ShipsFront, Grid, Ship } from './models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  URL = 'https://localhost:7100/api/Players/';

  constructor(private httpClient: HttpClient) {}

  getPlayers() {
    return this.httpClient.get<Player[]>(this.URL + 'getPlayers');
  }

  getPlayersById(id: number) {
    return this.httpClient.get<Player>(this.URL + 'getPlayer/' + id);
  }

  getGridByPlayerId(
    id: number,
    gridSize: number,
    userGridTRUE_shotGridFALSE: boolean
  ) {
    return this.httpClient.get<Grid>(
      this.URL +
        'getGridByPlayerId/' +
        id +
        '/' +
        gridSize +
        '/' +
        userGridTRUE_shotGridFALSE
    );
  }

  getShipsByPlayerId(id: number) {
    return this.httpClient.get<Ship[]>(this.URL + 'getShipsByPlayerId/' + id);
  }

  postCreateGame(players: PlayerFront[]) {
    return this.httpClient.post(this.URL + 'postCreateGame', players);
  }

  postPlaceShips(ships: ShipsFront) {
    return this.httpClient.post(this.URL + 'postPlaceShips', ships);
  }

  postShot(shot: Shot) {
    return this.httpClient.post(this.URL + 'postShot?' + 'id=' + shot.id + '&xAxis=' + shot.x + '&yAxis=' + shot.y, '')
  }
}
