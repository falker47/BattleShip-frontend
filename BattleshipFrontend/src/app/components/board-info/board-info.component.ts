import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerFrontend } from '../../models/models';
import { ShipComponent } from '../ship/ship.component';

@Component({
  selector: 'app-board-info',
  templateUrl: './board-info.component.html',
  styleUrls: ['./board-info.component.scss']
})
export class BoardInfoComponent {
  @Input() shipList1!: Array<ShipComponent>;
  @Input() currentPlayer!: PlayerFrontend;
  @Output() confirmShips = new EventEmitter();
}
