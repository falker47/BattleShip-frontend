import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerFront } from '../api/models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', '../../styles.scss']
})
export class PlayerComponent {

  @Input() player!: PlayerFront;
  @Output() remove = new EventEmitter<PlayerFront>();

}
