import { Component } from '@angular/core';
import { Player } from '../api/models';


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


  addPlayer(name: string) {
    if (!name) return;

    if (this.players.length < this.limitNumPlayers) {
      this.players.push({
        id: this.playerId++,
        name: name,
        group: Math.floor(Math.random() * 2),
        ships: {
          destroyer: [],       
          submarine: [],        
          cruiser: [],         
          battleship: [],     
          carrier: []
        },
        points: 0,
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
    // backend connection

    this.confirmedPlayers = true;
  }

}
