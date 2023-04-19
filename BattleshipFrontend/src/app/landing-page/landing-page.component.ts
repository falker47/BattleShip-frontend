import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss']
})
export class LandingPageComponent {

  // Temporary memory --> backend
  players: string[] = ["alexia", "maurizio", "artiom", "flavio", "daniele"];
  limitNumPlayers: number = 6;


  addPlayer(name: string) {
    console.log(name);
    if (!name) return;

    if (this.players.length < this.limitNumPlayers) {
      this.players.push(name);
      name = '';
    }
  }
  
}
