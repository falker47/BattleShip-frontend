import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  const boardContainer = document.querySelector('#boards-container')

  const width = 10;

  function createBoard() {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = 'blue';

    boardContainer.append(gameBoardContainer);

    for (let i = 0; i < width*width; i++) {
      const block = document.createElement('div');
      block.classList.add('block');
      block.id = i;
      gameBoardContainer.append(block);
    }
  }
  createBoard();
  createBoard();

  class Ship {
    constructor(name, length) {
      this.name = name;
      this.length = length;
    }
  }

  const l1 = new Ship("l1", 1);
  const l2 = new Ship("l2", 2);
  const l3 = new Ship("l3", 3);
  const l4 = new Ship("l4", 4);
  const l5 = new Ship("l5", 5);

  const ships = [l1, l2, l3, l4, l5];
}
