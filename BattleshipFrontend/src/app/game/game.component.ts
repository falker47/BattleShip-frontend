import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';
import { PlayerFrontendGame, CellApi, PlayerApi, Shot } from '../api/models';

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
  public playersData: PlayerFrontendGame[] = [];
  public playersLeaderboard: PlayerFrontendGame[] = [];
  public team0: PlayerFrontendGame[] = [];
  public team1: PlayerFrontendGame[] = [];
  public shot: Shot[] = [];
  public logs: string[] = [];
  public players: PlayerApi[] = [
    { id: 1, name: 'Alexía', userGridId: 0, shotGridId: 0, team: 0, points: 111 },
    { id: 2, name: 'Flavio', userGridId: 0, shotGridId: 0, team: 1, points: 10 },
    { id: 3, name: 'Artiom', userGridId: 0, shotGridId: 0, team: 0, points: 70 },
    // { id: 4, name: 'Maurizio', userGridId: 0, shotGridId: 0, team: 1, points: 1000 },
    // { id: 5, name: 'Daniele', userGridId: 0, shotGridId: 0, team: 0, points: 50 },
    // { id: 6, name: 'Nicola', userGridId: 0, shotGridId: 0, team: 1, points: 666 },
  ] // TODO replace with information from backend;

  //   public grid: GridApi = {
  //    id: 0,
  //    cells: [[
  //     {
  //       id: 1,
  //       gridId: 0,
  //       xaxis: number,
  //       yaxis: number,
  //       state: number,
  //       shipId?: number,
  //     }
  //    ]]
  // }

  // public logs = [ // TODO delete later
  //   "gjndsjgbasjbgjbjfskbagllsdkgna jertw retjwet WE T wje t", 
  //   "asjdfbDF  qer fQW FHJq we f A FNW eh fh e HJ WE  WJ gfk", 
  //   "gjndsjgbasjbgjbjfskbagllsdkgna jertw retjwet WE T wsdgsndg DFU qwme fj MF jsad f arjwjr ewjkTJWjf kSDFje t", 
  //   "asjdfbDF  qer fQW FHJq we f A FNW eh fh e HJ WE  WJ gfk", 
  //   "gjndsjgbasjbgjbjfskbagllsdkgna jertw retjwet WE T wje t", 
  //   "asjdfbDF  qer fQW FHJq we f A FNW eh fh SFGSEG JWE TBEW FJ ASJf weNM FC e HJ WE  WJ gfk", 
  //   "gjndsjgbasjbgjbjfskbagllsdkgna jertw retjwet WE T wje t", 
  //   "asjdfbDF  qer fQW FHJq we f A FNW eh fh e HJ WE  WJ gfk"
  // ]


  constructor(private router: Router, private playerService: PlayerService) {}


  ngOnInit() {
    this.playerBoard = this.getEmptyBoard();
    this.preparePlayers();
    this.currentPlayer = this.getCurrentPlayer(0);

    this.playersData.forEach((player) => {
      if (player.team === 0) {
        this.team0.push(player);
      }
      if (player.team === 1) {
        this.team1.push(player);
      }
      this.playersLeaderboard.push(player);
    });
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
        userGridId: player.userGridId,
        shotGridId: player.shotGridId,
        team: player.team,
        points: player.points,
        isPlaying: true,
      });
    });
  }


  toggleIsReady() {
    this.isReady = !this.isReady;
  }


  getNextPlayer() {
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
              this.logs.push(log);
            }
          });
        }})
      }
  }


  isGameOver(): boolean {
    const isTeam0StillAlive = this.team0.find((player) => player.isPlaying === true);
    const isTeam1StillAlive = this.team1.find((player) => player.isPlaying === true);
    
    if (!isTeam0StillAlive || !isTeam1StillAlive) return true;
    else return false;
  }


  sortLeaderboard(): PlayerFrontendGame[] {
    return this.playersLeaderboard.sort((a, b) => b.points - a.points);
  }


  sortFinalLeaderboard(): PlayerFrontendGame[] | undefined {
    let totalPointsTeam0 = 0;
    this.team0.forEach(player => totalPointsTeam0 += player.points);
    let totalPointsTeam1 = 0;
    this.team1.forEach(player => totalPointsTeam1 += player.points);

    let playersByPoints = this.playersData.sort((a, b) => b.points - a.points);

    if (totalPointsTeam0 > totalPointsTeam1) {
      return playersByPoints.sort((a, b) => a.team - b.team);
    }
    if (totalPointsTeam0 < totalPointsTeam1) {
      return playersByPoints.sort((a, b) => b.team - a.team);
    }
    else return undefined;
  }


  restartGame() {
    this.router.navigate(['/']);
  }

}
