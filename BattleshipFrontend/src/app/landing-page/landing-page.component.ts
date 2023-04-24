import { Component } from '@angular/core';
import { PlayerFront } from '../api/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss']
})
export class LandingPageComponent {

  public players: PlayerFront[] = [];
  public limitNumPlayers = 6;
  public id: string = '1';


  constructor(private router: Router) {}


  addPlayer(name: string) {
    if (!name) return;

    if (this.players.length === 0) {
      this.players.push({
        id: this.id,
        name: name,
        team: 0,
        confirmed: false
      });
      return;
    }

    if (this.players.length === 1) {
      this.players.push({
        id: (Number(this.id) + 1).toString(),
        name: name,
        team: 1,
        confirmed: false
      });
      return;
    }

    if (this.players.length < this.limitNumPlayers) {
      this.players.push({
        id: (Number(this.id) + 1).toString(),
        name: name,
        team: Math.floor(Math.random() * 2),
        confirmed: false
      });
    }
  }


  removePlayer(player: PlayerFront) {
    this.players.splice(this.players.indexOf(player), 1);
  }


  confirmPlayers() {
    console.log(this.players);
    this.router.navigate(['/board']); 
  }

}
