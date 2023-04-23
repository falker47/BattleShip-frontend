import { Component } from '@angular/core';
import { PlayerFront } from '../api/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss']
})
export class LandingPageComponent {

  playersNames: PlayerFront[] = [];
  limitNumPlayers = 6;
  confirmedPlayers = false;


  constructor(private router: Router) {}


  addPlayer(name: string) {
    if (!name) return;

    if (this.playersNames.length === 0) {
      this.playersNames.push({
        name: name,
        team: 0, 
      });
      return;
    }

    if (this.playersNames.length === 1) {
      this.playersNames.push({
        name: name,
        team: 1,
      });
      return;
    }

    if (this.playersNames.length < this.limitNumPlayers) {
      this.playersNames.push({
        name: name,
        team: Math.floor(Math.random() * 2),
      });
    }
  }


  removePlayer(player: PlayerFront) {
    this.playersNames.splice(this.playersNames.indexOf(player), 1);
  }


  confirmPlayers() {
    this.confirmedPlayers = true;
    // this.router.navigate(['/board']); 
  }

}
