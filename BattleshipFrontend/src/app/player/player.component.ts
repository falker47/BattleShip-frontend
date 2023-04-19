import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../api/models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', '../../styles.scss']
})
export class PlayerComponent {

  @Input() player!: Player;
  @Output() remove = new EventEmitter<Player>();

}
