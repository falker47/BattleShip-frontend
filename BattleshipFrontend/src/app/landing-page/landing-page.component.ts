import { Component } from '@angular/core';
import { Player } from '../api/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss']
})
export class LandingPageComponent {

  players: Player[] = [];
  limitNumPlayers = 6;
  confirmedPlayers = false;
  playerId = 1;

  player: Player = {
    id: 0,
    name: '',
    team: 0,
    ships: {
      destroyer: [],       
      submarine: [],        
      cruiser: [],         
      battleship: [],     
      carrier: []
    },
    points: 0,
  }


  constructor(private router: Router) {}


  addPlayer(name: string) {
    if (!name) return;

    if (this.players.length === 0) {
      this.players.push({
        ...this.player,
        id: this.playerId++,
        name: name,
        team: 1, 
      });
      return;
    }

    if (this.players.length === 1) {
      this.players.push({
        ...this.player,
        id: this.playerId++,
        name: name,
        team: 2,
      });
      return;
    }

    if (this.players.length < this.limitNumPlayers) {
      this.players.push({
        ...this.player,
        id: this.playerId++,
        name: name,
        team: Math.floor(Math.random() * 2) + 1,
      });
    }

    console.log(this.players);
  }


  removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
    console.log(player);
    console.log(this.players);
  }


  confirmPlayers() {
    // backend connection: send confirmed array of player to backend

    this.confirmedPlayers = true;
    this.router.navigate(['/board']); // maybe delete later
  }

}
