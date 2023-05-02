import { Component } from '@angular/core';
import { PlayerInitialData } from '../api/models';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = 'Are you sure you want to leave?';
});

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss', '../../styles.scss'],
})
export class LandingPageComponent {
  public players: PlayerInitialData[] = [];
  public limitNumPlayers: number = 6;

  
  constructor(private router: Router, private playerService: PlayerService) {}


  public addPlayer(inputName: string): void {
    const name = inputName.replace(/\s/g, '').charAt(0).toUpperCase() + inputName.slice(1);
    if (!inputName || name === '' || this.isNameTaken(name)) return;

    if (this.players.length === 0) {
      this.players.push({
        name: name,
        team: Math.floor(Math.random() * 2),
      });
      return;
    }
    if (this.players.length === 1) {
      this.players.push({
        name: name,
        team: this.players[0].team === 0 ? 1 : 0,
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


  private isNameTaken(name: string): boolean {
    let repeatedNames: boolean[] = [];
    this.players.forEach((player) => {
      if (player.name === name) repeatedNames.push(true);
      else repeatedNames.push(false);
    });

    if (repeatedNames.find((item) => item === true)) return true;
    else return false;
  }


  public removePlayer(player: PlayerInitialData): void {
    this.players.splice(this.players.indexOf(player), 1);
  }


  public confirmPlayers(): void {
    this.playerService
      .postCreateGame(this.players)
      .subscribe(() => {
        this.playerService
          .getPlayers()
          .subscribe((players) => {
            this.playerService.setGamePlayers(players);
            this.goToBoard();
          })
      })
  }

  
  private goToBoard(): void {
    this.router.navigate(['/board']);
  }
}
