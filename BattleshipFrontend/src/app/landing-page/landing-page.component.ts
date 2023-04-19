import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss']
})
export class LandingPageComponent {

  players: string[] = ["alexia", "maurizio", "artiom", "flavio", "daniele"];
  limitNumPlayers: number = 6;
  confirmedPlayers: boolean = false;


  addPlayer(name: string) {
    console.log(name);
    if (!name) return;

    if (this.players.length < this.limitNumPlayers) {
      this.players.push(name);
      name = '';
      console.log(this.players)
    }
  }

  confirmPlayers() {
    // backend connection

    this.confirmedPlayers = true;
  }

}
