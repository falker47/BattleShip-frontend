import { Component, Input } from '@angular/core';
import { PlayerApi } from '../api/models';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent {
  @Input() players!: PlayerApi[];
  @Input() logs!: string[];

  
  public sortLeaderboard(): PlayerApi[] {
    return this.players.sort((a, b) => b.points - a.points);
  }
}
