import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';
import { PlayerFrontendGame, CellApi, GridApi, PlayerApi, Shot } from '../api/models';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = `Are you sure you want to leave?`;
});

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public width: number = 10;
  public playerBoard!: number[][];
  public isReady: boolean = false;
  public currentPlayer!: PlayerFrontendGame;
  public currentIndex: number = 0;
  public players: PlayerApi[] = [];
  public playersData: PlayerFrontendGame[] = [];
  public shot: Shot[] = [];
  public logs: string[] = [];
  public userGrid!: GridApi;
  public shotGrid!: GridApi;


  constructor(private router: Router, private playerService: PlayerService) {
    this.players = this.playerService.getGamePlayers();
    this.userGrid = this.playerService.getUserGrid();
    this.shotGrid = this.playerService.getShotGrid();
  }


  ngOnInit() {
    this.playerBoard = this.getEmptyBoard();
    this.preparePlayers();
    this.playerService.setPlayersData(this.playersData);
    this.currentPlayer = this.getCurrentPlayer(this.currentIndex);
  }


  public getCellState(x: number, y: number, type: string): number {
    let cells: CellApi[] = [];

    if (type === 'user') {
      this.userGrid.Cells.forEach((cells1) => {
        cells1.forEach((cell) => cells.push(cell));
      });

      let foundCell = cells.find(
        (cell) => x === cell.Xaxis && y === cell.Yaxis
      );
      return Number(foundCell?.State);
    }

    if (type === 'shot') {
      this.shotGrid.Cells.forEach((cells1) => {
        cells1.forEach((cell) => cells.push(cell));
      });

      let foundCell = cells.find(
        (cell) => x === cell.Xaxis && y === cell.Yaxis
      );
      return Number(foundCell?.State);
    }

    return 0;
  }


  public getShipId(x: number, y: number): number {
    let cells: CellApi[] = [];

    this.userGrid.Cells.forEach((rows) => {
      rows.forEach((cell) => {
        cells.push(cell);
      });
    });

    let foundCell = cells.find((cell) => x === cell.Xaxis && y === cell.Yaxis);
    return Number(foundCell?.ShipId);
  }


  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  public getCurrentPlayer(i: number): PlayerFrontendGame {
    return this.playersData[i];
  }


  private preparePlayers() {
    this.players.forEach((player) => {
      this.playersData.push({
        id: player.id,
        name: player.name,
        team: player.team,
        isPlaying: true,
      });
    });
  }


  public toggleIsReady() {
    this.isReady = !this.isReady;
  }


  // public showNextPlayer(): void {
  //   this.router.navigate(["/player-ready"]);
  // }


  async getNextPlayer() {
    let index: number = ++this.currentIndex;

    if (this.playersData.length === index) {
      this.currentIndex = 0;
      this.currentPlayer = this.playersData[this.currentIndex];
    } else {
      this.currentPlayer = this.playersData[index];
    }

    this.shot.pop();
    this.toggleIsReady();
    // this.showNextPlayer();

    await this.playerService
      .getGridByPlayerId(this.currentPlayer.id, this.width, true)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setUserGrid(res);
          this.userGrid = this.playerService.getUserGrid();
        }
      });
    await this.playerService
      .getGridByPlayerId(this.currentPlayer.id, this.width, false)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setShotGrid(res);
          this.shotGrid = this.playerService.getShotGrid();
        }
      });
  }


  public async saveShot(x: number, y: number) {
    if (this.shot.length === 0) {
      const playerShot: Shot = {
        id: this.currentPlayer.id,
        xAxis: x,
        yAxis: y,
      };
      this.shot.push(playerShot);

      await this.playerService
        .postShot(playerShot)
        .toPromise()
        .then((res) => {
          if (res) {
            let logArray = res.log.split(';');
            logArray.forEach((log) => {
              if (log !== '') this.logs.unshift(log);
            });
          }
        });
    }
    await this.playerService
      .getPlayers()
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setGamePlayers(res);
          this.players = this.playerService.getGamePlayers();
        }
      });

    this.checkAlivePlayers();
    this.playerService.setPlayersData(this.playersData);
  }


  public async checkAlivePlayers() {
    this.playersData.forEach(async (player, i) => {
      let shipsHP: number[] = [];

      await this.playerService
        .getShipsByPlayerId(player.id)
        .toPromise()
        .then((res) => {
          if (res) {
            res.forEach((ship) => {
              if (ship.hp !== 0) shipsHP.push(ship.hp);
            });
          }
          if (shipsHP.length === 8) {
            this.playersData.splice(i, 1);
          }
          if (this.isGameOver() === true) {
            this.router.navigate(["/leaderboard"]);
          }
        });
    });
  }


  public isGameOver(): boolean {
    const team0Alive = this.playersData.find((player) => player.team === 0);
    const team1Alive = this.playersData.find((player) => player.team === 1);

    if (!team0Alive || !team1Alive) return true;
    else return false;
  }


  public sortLeaderboard(): PlayerApi[] {
    return this.players.sort((a, b) => b.points - a.points);
  }
}
