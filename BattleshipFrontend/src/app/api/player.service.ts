import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PlayerInitialData,
  PlayerShipsData,
  PlayerFrontendGame,
  GridApi,
  PlayerApi,
  ShipApi,
  Shot,
  LogApi,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  // private URL = 'https://localhost:7100/api/Players/';
  private URL = 'https://api-battleship.azurewebsites.net/api/Players/';
  private gamePlayer: PlayerApi[] = [];
  private gamePlayerUserGrid!: GridApi;
  private gamePlayerShotGrid!: GridApi;
  public width!: number;
  public currentIndex: number = 0;
  public currentPlayer!: PlayerFrontendGame;
  public playersData: PlayerFrontendGame[] = [];
  public logs: string[] = [];

  constructor(private httpClient: HttpClient) {}


  getPlayers() {
    return this.httpClient.get<PlayerApi[]>(this.URL + 'getPlayers');
  }

  getPlayersById(id: number) {
    return this.httpClient.get<PlayerApi>(this.URL + 'getPlayer/' + id);
  }

  getGridByPlayerId(id: number, gridSize: number, userGridTRUE_shotGridFALSE: boolean) {
    return this.httpClient.get<GridApi>(this.URL + 'getGridByPlayerId/' + id + '/' + gridSize + '/' + userGridTRUE_shotGridFALSE);
  }

  getShipsByPlayerId(id: number) {
    return this.httpClient.get<ShipApi[]>(this.URL + 'getShipsByPlayerId/' + id);
  }

  postCreateGame(players: PlayerInitialData[]) {
    return this.httpClient.post(this.URL + 'postCreateGame', players);
  }

  postPlaceShips(ships: PlayerShipsData) {
    return this.httpClient.post<string>(this.URL + 'postPlaceShips', ships);
  }

  postShot(shot: Shot) {
    return this.httpClient.post<LogApi>(this.URL + 'postShot', shot);
  }

  setGamePlayers(gamePlayer: PlayerApi[]) {
    this.gamePlayer = gamePlayer;
  }

  setUserGrid(userGrid: GridApi) {
    this.gamePlayerUserGrid = userGrid;
  }

  setShotGrid(shotGrid: GridApi) {
    this.gamePlayerShotGrid = shotGrid;
  }

  getGamePlayers(): PlayerApi[] {
    return this.gamePlayer;
  }

  getUserGrid(): GridApi {
    return this.gamePlayerUserGrid;
  }

  getShotGrid(): GridApi {
    return this.gamePlayerShotGrid;
  }

  // ------- Sharing information between components ------- // 

  getBoardSize(): number {
    return this.width;
  }
  setBoardSize(width: number) {
    this.width = width;
  }

  getPlayersData() {
    return this.playersData;
  }
  setPlayersData(playersData: PlayerFrontendGame[]) {
    this.playersData = playersData;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
  setCurrentIndex(currentIndex: number) {
    this.currentIndex = currentIndex;
  }

  getCurrentPlayer(): PlayerFrontendGame {
    return this.currentPlayer;
  }
  setCurrentPlayer(currentPlayer: PlayerFrontendGame) {
    this.currentPlayer = currentPlayer;
  }

  getLogs(): string[] {
    return this.logs;
  }
  setLogs(logs: string) {
    this.logs.unshift(logs);
  }
}
