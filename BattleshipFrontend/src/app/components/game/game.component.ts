import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { CellApi, GridApi, PlayerApi, Shot } from '../../models/models';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = 'Are you sure you want to leave?';
});

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public width: number = 10;
  public playerBoard!: number[][];
  public userGrid!: GridApi;
  public shotGrid!: GridApi;
  public currentIndex;
  public currentPlayer;
  public players: PlayerApi[] = [];
  public playersData;
  public shot: Shot[] = [];
  public logs: string[];


  constructor(private router: Router, private playerService: PlayerService) {
    this.players = this.playerService.getGamePlayers();
    this.playersData = this.playerService.getPlayersData();

    this.userGrid = this.playerService.getUserGrid();
    this.shotGrid = this.playerService.getShotGrid();
    this.logs = this.playerService.getLogs();
    
    this.currentIndex = this.playerService.getCurrentIndex();
    this.currentPlayer = this.playerService.getCurrentPlayer();
  }


  ngOnInit() {
    this.playerBoard = this.getEmptyBoard();
  }


  public getCellState(x: number, y: number, type: string): number {
    let cells: CellApi[] = [];

    if (type === 'user') {
      this.userGrid.Cells.forEach((row) => {
        row.forEach((cell) => cells.push(cell));
      });

      const foundCell = cells.find((cell) => x === cell.Xaxis && y === cell.Yaxis);
      return Number(foundCell?.State);
    }
    
    if (type === 'shot') {
      this.shotGrid.Cells.forEach((row) => {
        row.forEach((cell) => cells.push(cell));
      });

      const foundCell = cells.find((cell) => x === cell.Xaxis && y === cell.Yaxis);
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

    const foundCell = cells.find((cell) => x === cell.Xaxis && y === cell.Yaxis);
    return Number(foundCell?.ShipId);
  }


  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }
  

  public saveShot(x: number, y: number): void {
    if (this.shot.length === 0) {
      const playerShot: Shot = {
        id: this.currentPlayer.id,
        xAxis: x,
        yAxis: y,
      };

      this.shot.push(playerShot);

      this.playerService
        .postShot(playerShot)
        .subscribe((res) => {
          const logsArray = res.log.split(';');

          logsArray.forEach((log) => {
            if (log !== '') this.playerService.setLogs(log);
          });

          this.updateShotGrid();
          this.updateGamePlayers();
          this.checkAlivePlayers();
          this.playerService.setPlayersData(this.playersData);
        })
    }
  }


  public getNextPlayer(): void {
    let index: number = ++this.currentIndex;
    
    if (this.playersData.length === index) {
      this.currentIndex = 0;
      this.currentPlayer = this.playersData[this.currentIndex];
    } else {
      this.currentPlayer = this.playersData[index];
    }

    this.playerService.setCurrentIndex(this.currentIndex); 
    this.playerService.setCurrentPlayer(this.currentPlayer);
    this.shot.pop();
    this.showNextPlayer();
    this.updateUserGrid();
    this.updateShotGrid();
  }


  private showNextPlayer(): void { 
    this.router.navigate(['/player']);
  }


  private updateUserGrid(): void {
    this.playerService
      .getGridByPlayerId(this.currentPlayer.id, this.width, true)
      .subscribe((userGrid) => {
        this.playerService.setUserGrid(userGrid);
        this.userGrid = this.playerService.getUserGrid();
      })
  }


  private updateShotGrid(): void {
    this.playerService
      .getGridByPlayerId(this.currentPlayer.id, this.width, false)
      .subscribe((shotGrid) => {
        this.playerService.setShotGrid(shotGrid);
        this.shotGrid = this.playerService.getShotGrid();
      })
  }


  private updateGamePlayers(): void {
    this.playerService
      .getPlayers()
      .subscribe((players) => {
        this.playerService.setGamePlayers(players);
        this.players = this.playerService.getGamePlayers();
      })
  }


  private checkAlivePlayers(): void {
    this.playersData.forEach((player, index) => {
      let shipsHP: number[] = [];

      this.playerService
        .getShipsByPlayerId(player.id)
        .subscribe((ships) => {
          ships.forEach((ship) => {
            if (ship.hp !== 0) shipsHP.push(ship.hp);
          });
  
          if (shipsHP.length === 0) {
            this.playersData.splice(index, 1);
          }
          if (this.isGameOver() === true) {
            this.router.navigate(['/leaderboard']);  
          }
        })
    });
  }


  public isGameOver(): boolean {
    const team0Alive = this.playersData.find((player) => player.team === 0);
    const team1Alive = this.playersData.find((player) => player.team === 1);

    if (!team0Alive || !team1Alive) return true;
    else return false;
  }
}
