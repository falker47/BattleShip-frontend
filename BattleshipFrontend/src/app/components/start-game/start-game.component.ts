import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
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

  
  public startGame(): void {
    this.playerService
      .getGridByPlayerId(1, this.width, true)
      .subscribe((userGrid) => {
        this.playerService.setUserGrid(userGrid);
      })

    this.playerService
      .getGridByPlayerId(1, this.width, false)
      .subscribe((shotGrid) => {
        this.playerService.setShotGrid(shotGrid);
      })

    this.router.navigate(['/player']);
  }
}
