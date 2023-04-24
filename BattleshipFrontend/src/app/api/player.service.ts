import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, PlayerFront, Shot, ShipsFront, GridApi, Ship, PlayerApi, ShipsApi } from './models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  // quando ci sarà il db online:
  // URL = 'https://api-battleship.azurewebsites.net/api/Players/';
  URL = 'https://localhost:7100/api/Players/'

  constructor(private httpClient: HttpClient) {}

  getPlayers() {
    return this.httpClient.get<PlayerApi[]>(this.URL + 'getPlayers');
  }

  getPlayersById(id: number) {
    return this.httpClient.get<PlayerApi>(this.URL + 'getPlayer/' + id);
  }

  getGridByPlayerId(
    id: number,
    gridSize: number,
    userGridTRUE_shotGridFALSE: boolean
  ) {
    return this.httpClient.get<GridApi>(
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
    return this.httpClient.get<ShipsApi[]>(this.URL + 'getShipsByPlayerId/' + id);
  }

  postCreateGame(players: PlayerFront[]) {
    return this.httpClient.post<string>(this.URL + 'postCreateGame', players);
  }

  postPlaceShips(ships: ShipsFront) {
    return this.httpClient.post<string>(this.URL + 'postPlaceShips', ships);
  }

  postShot(shot: Shot) {
    return this.httpClient.post<string>(this.URL + 'postShot', shot);
  }
}
