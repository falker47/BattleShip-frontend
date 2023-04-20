import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Player, Ship } from '../api/models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: Player[];
  @ViewChild('shipsContainer') shipsContainer!: ElementRef<HTMLElement>;
  shipsArray: Ship[] = [];
  width = 10;
  cells: number[] = [];
  draggedShip!: EventTarget | null;
  notDropped = true;


  ngOnInit() {
    this.generateGameBoard();

    this.createShip('ship_4_1', 4);
    this.createShip('ship_3_1', 3);
    this.createShip('ship_3_2', 3);
    this.createShip('ship_3_3', 3);
    this.createShip('ship_2_1', 2);
    this.createShip('ship_2_2', 2);
    this.createShip('ship_2_3', 2);
    this.createShip('ship_1_1', 1);
    this.createShip('ship_1_2', 1);

    // this.shipsArray.forEach(ship => this.addShipCell(ship));
  }

  
  generateGameBoard() {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    this.cells = [].constructor(this.width * this.width);
  }
  

  createShip(name: string, length: number) { 
    this.shipsArray.push({
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

  isHorizontal() {
    return !this.shipsContainer.nativeElement.classList.contains('flip'); 
  }

  handleSpaceValidity(ship: Ship, startCoord: number) {
    // Check if space is valid
    let validStart = this.isHorizontal() 
      // Horizontal
      ? startCoord <= this.width * this.width - ship.length // total celdas en la tabla menos ship length
      ? startCoord 
      : this.width * this.width - ship.length 
      // Vertical
      : startCoord <= this.width * this.width - this.width * ship.length // total celdas en la tabla menos ancho por ship length
      ? startCoord
      : startCoord - ship.length * this.width + this.width

  
    let shipCells: Element[] = [];
    let domShips = Array.from(this.shipsContainer.nativeElement.children);

    for (let i = 0; i < ship.length; i++) {
      if (this.isHorizontal()) {  
        // console.log(domShips[Number(validStart) + i])
        shipCells.push(domShips[Number(validStart) + i]);
      } else {
        shipCells.push(domShips[Number(validStart) + i * this.width]);
      }
    }
    console.log(shipCells)

    // Check ships enter in the space correctly without "getting cut"  // ! FAIL
    let valid;
    if (this.isHorizontal()) {
      shipCells.every((_shipCell, index) => {
        valid = Number(shipCells[0].id) % this.width !== this.width - (shipCells.length - (index + 1));
      })
    } else {
      shipCells.every((_shipCell, index) => {
        valid = Number(shipCells[0].id) < 90 + (this.width * index + 1);
      })
    }

    // Check ships do not overlap
    const notTaken = shipCells.every(shipCell => !shipCell.classList.contains('taken'));

    return { shipCells, valid, notTaken }
  }

  addShipCell(ship: Ship, startCoord: number) {
    const { shipCells, valid, notTaken } = this.handleSpaceValidity(ship, startCoord);  

    if (valid && notTaken) {
      shipCells.forEach(shipCell => {
        shipCell.classList.add(ship.name);
        shipCell.classList.add('taken');
      })
    } else {
      this.notDropped = true;
    }
  }




  dragStart(e: Event) {
    this.draggedShip = e.target;
    this.notDropped = false;
  }

  dragOver(e: Event) {
    e.preventDefault();
  }

  dropShip(e: Event, i: number) {
    const startCoord = i;
    const ship = this.shipsArray[Number((this.draggedShip as Element).id)]; 
    // console.log(ship)

    if (!this.notDropped) {     
      this.addShipCell(ship, startCoord);
      (this.draggedShip as Element).remove();
    }
  }




  start() {
    console.log("Start game...");
  }

}
