import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('board') boardElement!: ElementRef<HTMLElement>;
  public width: number = 10;
  public shipName: string = '';
  public playerBoard!: number[][];
  public xInitial: number = 0;
  public yInitial: number = 0;

  constructor(private router: Router, private playerService: PlayerService) {}

  ngOnInit() {
    this.playerBoard = this.getEmptyBoard();
    this.playerBoard = this.getEmptyBoard();
  }

  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= 2; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }
}
