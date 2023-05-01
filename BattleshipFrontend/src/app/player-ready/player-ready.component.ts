// import { Component } from '@angular/core';
// import { PlayerService } from '../api/player.service';
// import { Router } from '@angular/router';
// import { PlayerFrontendGame } from '../api/models';

// @Component({
//   selector: 'app-player-ready',
//   templateUrl: './player-ready.component.html',
//   styleUrls: ['./player-ready.component.scss']
// })
// export class PlayerReadyComponent {
//   public currentPlayer!: PlayerFrontendGame;
//   public currentIndex;
//   public playersData;

//   constructor(private playerService: PlayerService, private router: Router) {
//     this.players = this.playerService.getGamePlayers();
//     this.playersData = this.playerService.getPlayersData();
//     this.userGrid = this.playerService.getUserGrid();
//     this.shotGrid = this.playerService.getShotGrid();
    
//     this.currentIndex = this.playerService.getCurrentIndex();
//     this.currentPlayer = this.getCurrentPlayer(this.currentIndex);
//     this.playerService.setCurrentPlayer(this.currentPlayer);
//   }

//   getCurrentPlayer(i: number): PlayerFrontendGame {
//     return this.playersData[i];
//   }

//   play() {
//     this.router.navigate(["/game"]);
//   }
// }
