import { Component } from '@angular/core';
import { PlayerFront } from '../api/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss'],
})
export class LandingPageComponent {
  players: PlayerFront[] = [];
  limitNumPlayers = 6;
  confirmedPlayers = false;

  constructor(private router: Router) {}

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

  removePlayer(player: PlayerFront) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  confirmPlayers() {
    // PLAYER SERVICE! --> backend connection


    this.confirmedPlayers = true;
    // this.router.navigate(['/board']); // maybe delete later
  }
}
