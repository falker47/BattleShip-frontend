import { Component } from '@angular/core';
import { PlayerApi, PlayerInitialData } from '../api/models';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = `Are you sure you want to leave?`;
});

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss'],
})
export class LandingPageComponent {
  public players: PlayerInitialData[] = [];
  public limitNumPlayers = 6;
  public gamePlayers: PlayerApi[] = [];

  constructor(private router: Router, private playerService: PlayerService) {}

  addPlayer(name: string) {
    if (!name) return;

    if (this.players.length === 0) {
      this.players.push({
        name: name,
        team: 0,
      });
      return;
    }
    if (this.players.length === 1) {
      this.players.push({
        name: name,
        team: 1,
      });
      return;
    }
    if (this.players.length < this.limitNumPlayers) {
      this.players.push({
        name: name,
        team: Math.floor(Math.random() * 2),
      });
    }
  }

  removePlayer(player: PlayerInitialData) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  confirmPlayers() {
    let res = this.playerService
      .postCreateGame(this.players)
      .subscribe((res) => console.log(res));
    if (res) {
      setTimeout(() => this.playerService.getPlayers().subscribe(res => this.playerService.setGamePlayers(res)), 5000);
      setTimeout(() => this.router.navigate(['/board']), 6000);
    }
  }
}
