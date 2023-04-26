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
  @ViewChild('board') boardElement!: ElementRef<HTMLElement>;
  public width: number = 10;
  public playerBoard!: number[][];
  public isReady: boolean = false;
  public currentPlayer!: PlayerFrontendGame;
  public currentIndex: number = 0;
  public players: PlayerApi[] = [];
  public playersData: PlayerFrontendGame[] = [];
  public playersLeaderboard: PlayerApi[] = [];
  public team0: PlayerApi[] = [];
  public team1: PlayerApi[] = [];
  public shot: Shot[] = [];
  public logs: string[] = [];
  public userGrid!: GridApi;
  public shotGrid!: GridApi;
  public cellState!: string[][];
 

  //   public grid: GridApi = {
  //    id: 0,
  //    cells: [[
  //     {
  //       id: 1,
  //       gridId: 0,
  //       xaxis: number,
  //       yaxis: number,
  //       state: number, // 0: water, 1: ship, 2: shooted ship, 3: shooted water
  //       shipId?: number,
  //     }
  //    ]]
  // }


  constructor(private router: Router, private playerService: PlayerService) {
    this.players = this.playerService.getGamePlayers();
  }


  ngOnInit() {
    this.playerBoard = this.getEmptyBoard();
    this.preparePlayers();
    this.currentPlayer = this.getCurrentPlayer(0);

    this.players.forEach((player) => {
      if (player.team === 0) {
        this.team0.push(player);
      }
      if (player.team === 1) {
        this.team1.push(player);
      }
      this.playersLeaderboard.push(player);
    });
  }

  getCellState(): void {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.userGrid.cells.at(i)?.at(j)?.State === 0) {
          this.cellState[i][j] = 'water';
        }
        if (this.userGrid.cells.at(i)?.at(j)?.State === 1) {
          this.cellState[i][j] = 'ship';
        }
        if (this.userGrid.cells.at(i)?.at(j)?.State === 2) {
          this.cellState[i][j] = 'ship-shooted';
        }
        if (this.userGrid.cells.at(i)?.at(j)?.State === 3) {
          this.cellState[i][j] = 'water-shooted';
        }
      }
    }

  }


  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  getCurrentPlayer(i: number): PlayerFrontendGame {
    return this.playersData[i];
  }


  preparePlayers() {
    this.players.forEach((player) => {
      this.playersData.push({
        id: player.id,
        name: player.name,
        isPlaying: true,
      });
    });
  }


  toggleIsReady() {
    this.isReady = !this.isReady;
    this.userGrid = this.playerService.getUserGrid();
    this.shotGrid = this.playerService.getShotGrid();
    console.log(this.userGrid )
    console.log(this.shotGrid )
    this.getCellState();
  }


  async getNextPlayer() {
    let index: number = ++this.currentIndex;
    this.currentPlayer = this.playersData[this.currentIndex];
    this.shot.pop();

    if (this.players.length === index) {
      this.currentIndex = 0;
      this.currentPlayer = this.playersData[this.currentIndex];
    }
    if (this.currentPlayer.isPlaying === false) {
      this.currentPlayer = this.playersData[++index];
    }
    
    this.playerService.getGridByPlayerId(this.currentPlayer.id, this.width, true).toPromise().then(res => {
      if (res) {
        this.playerService.setUserGrid(res);
      }
    });
    this.playerService.getGridByPlayerId(this.currentPlayer.id, this.width, false).toPromise().then(res => {
      if (res) {
        this.playerService.setShotGrid(res);
      }
    });

    this.toggleIsReady();
  }


  async saveShot (x: number, y: number) {
    if (this.shot.length === 0) {
      const playerShot: Shot = {
        id: this.currentPlayer.id,
        xAxis: x,
        yAxis: y,
      };
      this.shot.push(playerShot);
      
      await this.playerService.postShot(playerShot).toPromise().then(res => {
        if (res) {
          let logArray = res.log.split(';');
          logArray.forEach(log => {
            if (log !== "") {
              this.logs.unshift(log);
            }
          });
        }})
      }
      this.playerService.getPlayers().subscribe(
        res => this.playerService.setGamePlayers(res)
      );

      this.playersLeaderboard = this.playerService.getGamePlayers();
  }


  isGameOver(): boolean {
    const team0Alive = this.isTeamAlive(this.team0).find(el => el === true);
    const team1Alive = this.isTeamAlive(this.team1).find(el => el === true);

    if (!team0Alive || !team1Alive) return true;
    else return false;
  }


  isTeamAlive(team: PlayerApi[]): boolean[] {
    let isTeamStillAlive: boolean[] = [];
    team.forEach((player) => {
      this.playersData.forEach(p => {
        if (player.id === p.id) {
          if (p.isPlaying === true) {
            isTeamStillAlive.push(true);
          }
          else isTeamStillAlive.push(false);
        } else isTeamStillAlive.push(false);
      })
    });
    return isTeamStillAlive;
  }


  sortLeaderboard(): PlayerApi[] {
    return this.playersLeaderboard.sort((a, b) => b.points - a.points);
  }


  sortFinalLeaderboard(): PlayerApi[] {
    const team0Alive = this.isTeamAlive(this.team0).find(el => el === true);
    const team1Alive = this.isTeamAlive(this.team1).find(el => el === true);
    let playersByPoints = this.players.sort((a, b) => b.points - a.points);

    if (team0Alive && !team1Alive) {
      return playersByPoints.sort((a, b) => a.team - b.team);
    }
    if (team1Alive && !team0Alive) {
      return playersByPoints.sort((a, b) => b.team - a.team);
    }
    else return playersByPoints;
  }


  restartGame() {
    this.router.navigate(['/']);
  }

}
