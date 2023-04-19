import { Component, Input } from '@angular/core';
import { Player } from '../api/models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent {

  @Input() players!: Player[];

  constructor() {

  }


  generateBoard() {

  }

}
