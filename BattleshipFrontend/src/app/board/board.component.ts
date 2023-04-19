import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../api/models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: Player[];
  width: number = 10;

  constructor() {}

  ngOnInit() {
    if (this.players.length === 3) this.width += 5;
    if (this.players.length === 4) this.width += 10;
    if (this.players.length === 5) this.width += 15;
    if (this.players.length === 6) this.width += 20;

    console.log(this.players);
  }

}
