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
    this.currentPlayer = this.getCurrentPlayer(0);

    this.players.forEach((player) => {
      this.playersLeaderboard.push(player);
    });
  }


  getCellState(x: number, y: number, type: string): number {
    let cells: CellApi[] = [];
    if (type === 'user') {
      this.userGrid.Cells.forEach(cells1 => {
        cells1.forEach(cell => {
          cells.push(cell);
        })
      })
  
      let foundCell = cells.find(cell => x === cell.Xaxis && y === cell.Yaxis);
      return Number(foundCell?.State);
    }

    if (type === 'shot') {
      this.shotGrid.Cells.forEach(cells1 => {
        cells1.forEach(cell => {
          cells.push(cell);
        })
      })
  
      let foundCell = cells.find(cell => x === cell.Xaxis && y === cell.Yaxis);
      return Number(foundCell?.State);
    }

    return 0;
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
        team: player.team,
        isPlaying: true,
      });
    });
  }


  toggleIsReady() {
    this.isReady = !this.isReady;
  }


  async getNextPlayer() {
    let index: number = ++this.currentIndex;
    console.log('current index: GET NEXT PLAYER ' + this.currentIndex)
    console.log('index: (has to be equal to current index!) ' + index)
    
    if (this.playersData.length === index) {
      this.currentIndex = 0;
      this.currentPlayer = this.playersData[this.currentIndex];
      console.log('this.currentIndex = 0' + this.currentIndex)
    }
    else {
      this.currentPlayer = this.playersData[index];
      console.log('this.currentIndex !== 0' + this.currentIndex)
    }
    this.shot.pop();
    this.toggleIsReady();
    
    await this.playerService.getGridByPlayerId(this.currentPlayer.id, this.width, true).toPromise().then(res => {
      if (res) {
        this.playerService.setUserGrid(res);
        this.userGrid = this.playerService.getUserGrid();
      }
    });
    await this.playerService.getGridByPlayerId(this.currentPlayer.id, this.width, false).toPromise().then(res => {
      if (res) {
        this.playerService.setShotGrid(res);
        this.shotGrid = this.playerService.getShotGrid();
      }
    });
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

      this.playerService.getPlayers().toPromise().then(res => {
        if (res) {
          this.playerService.setGamePlayers(res);
          this.playersLeaderboard = this.playerService.getGamePlayers();
        }
      });

    this.isPlayerAlive();
    this.isGameOver();
  }


  isGameOver(): boolean {
    const team0Alive = this.playersData.find(player => player.team === 0);
    const team1Alive = this.playersData.find(player => player.team === 1);
    
    if (!team0Alive || !team1Alive) return true;
    else return false;
  }


  isPlayerAlive() {
    let shipsHP: number[] = [];
    let index: number = this.currentIndex + 1;
    console.log('this.currentIndex IS PLAYER ALIVE: ' + this.currentIndex)
    let newIndex = this.players.length === index ? 0 : index;
    this.playerService.getShipsByPlayerId(this.playersData[newIndex].id).toPromise().then(res => {
      if (res) {
        res.forEach(ship => {
          if (ship.hp !== 0) {
            shipsHP.push(ship.hp)
          }
        })
      }
    });
    if (shipsHP.length === 0) {
      this.playersData.slice(this.currentIndex, 1);
    } 
  }


  sortLeaderboard(): PlayerApi[] {
    return this.playersLeaderboard.sort((a, b) => b.points - a.points);
  }


  sortFinalLeaderboard(): PlayerApi[] {
    const team0Alive = this.playersData.find(player => player.team === 0);
    const team1Alive = this.playersData.find(player => player.team === 1);
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
