import { Component } from '@angular/core';
import { PlayerService } from '../api/player.service';
import { Router } from '@angular/router';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = 'Are you sure you want to leave?';
});

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent {
  public width;

  constructor(private playerService: PlayerService, private router: Router) {
    this.width = this.playerService.getBoardSize();
  }

  
  public async startGame() {
    await this.playerService
      .getGridByPlayerId(1, this.width, true)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setUserGrid(res);
        }
      });

    await this.playerService
      .getGridByPlayerId(1, this.width, false)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setShotGrid(res);
        }
      });

    this.router.navigate(['/player']);
  }
}