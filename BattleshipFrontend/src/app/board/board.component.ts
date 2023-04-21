import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Player, Ship } from '../api/models';
import { CdkDragDrop, transferArrayItem   } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: Player[];
  @ViewChild('shipsContainer') shipsContainer!: ElementRef<HTMLElement>;
  ships: Ship[] = [];
  droppedShips: Ship[] = [];
  width = 10;
  boardCells: string[] = [];



  ngOnInit() {
    this.generateGameBoard();

    this.createShip('ship_5_1', 5);
    this.createShip('ship_4_1', 4);
    this.createShip('ship_3_1', 3);
    this.createShip('ship_3_2', 3);
    this.createShip('ship_2_1', 2);
    this.createShip('ship_2_2', 2);
    this.createShip('ship_2_3', 2);
    this.createShip('ship_1_1', 1);
    this.createShip('ship_1_2', 1);
  }

  
  generateGameBoard() {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    this.boardCells = [].constructor(this.width * this.width);
  }
  

  createShip(name: string, length: number) { 
    this.ships.push({
      name: name,
      // playerId: , // TODO: add the playerId
      length: length,
      hp: length
    })
  }


  flip() {
    this.shipsContainer.nativeElement.classList.toggle('flip');
    // Array.from(this.shipsContainer.nativeElement.children).forEach(child => {
    //   child.classList.toggle('flip');
    // })
  }


  // DRAG AND DROP ANGULAR MATERIAL
  
  drop(event: CdkDragDrop<Ship[]>) {
    console.log(event);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }



  start() {
    console.log("Start game...");
  }

}
