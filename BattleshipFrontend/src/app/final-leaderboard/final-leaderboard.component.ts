import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerApi } from '../api/models';
import { PlayerService } from '../api/player.service';

@Component({
  selector: 'app-final-leaderboard',
  templateUrl: './final-leaderboard.component.html',
  styleUrls: ['./final-leaderboard.component.scss']
})
export class FinalLeaderboardComponent {
  public playersData;
  public players;

  constructor(private playerService: PlayerService, private router: Router) {
    this.playersData = this.playerService.getPlayersData();
    this.players = this.playerService.getGamePlayers();
  }

  
  sortFinalLeaderboard(): PlayerApi[] {
    const team0Alive = this.playersData.find((player) => player.team === 0);
    const team1Alive = this.playersData.find((player) => player.team === 1);

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
