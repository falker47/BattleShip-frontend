import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerFront, Player, DragModel, PlayerShipsData, Coordinates } from '../api/models';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ShipComponent } from './ship/ship.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: PlayerFront[]; // TODO: when backend ready, change to type Player to get full info
  @ViewChild("board") boardElement!: ElementRef<HTMLElement>;
  public width: number = 10;
  public shipName: string = '';
  public playerBoard!: number[][];
  public xInitial: number = 0;
  public yInitial: number = 0;
  public playerFinalData!: PlayerShipsData;
  public shipList1!: Array<ShipComponent>;
  public shipList2!: Array<ShipComponent>;
  public hoverPlace = {} as DragModel;
  public dragStart = {} as DragModel;
  public dragEnd = {} as DragModel;


  constructor(private router: Router) {}


  ngOnInit () {
    this.playerBoard = this.getEmptyBoard();
    this.shipList1 = this.createFleet();
    this.shipList2 = [];
  }


  private createFleet(): Array<ShipComponent> {
    return [
      { name: 'ship_5_1_red', size: 5, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_4_1_green', size: 4, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_3_1_blue', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_3_2_pink', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_1_orange', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_2_yellow', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_3_lightgreen', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_1_1_violet', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_1_2_lightblue', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
    ];
  }
  

  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  public rotateAvailableShip(i: number): void {
    this.shipList1[i].rotate = !this.shipList1[i].rotate;
  }


  public resetShip(i: number): void {
    this.moveFromshipList2To1(i.toString());
    this.hoverPlace = this.dragStart;
    if (this.shipList1[0] !== undefined) {
      this.shipList1[0].rotate = false;
    }
  }


  public dragStarted(shipName: string): void {
    this.dragStart = this.hoverPlace;
    this.shipName = shipName;
  }


  public hoveredPlace(position: any, elementType: string, row: number, col: number): void { 
    let dropPlace = {} as DragModel;
    dropPlace.cellX = position.x;
    dropPlace.cellY = position.y;
    dropPlace.type = elementType;
    dropPlace.row = row;
    dropPlace.col = col;
    this.dropValidation(dropPlace, row, col);
  }


  public dropValidation(dropPlace: DragModel, row: number, col: number): void {
    this.hoverPlace = dropPlace ? dropPlace : this.dragStart;

    if (this.shipName !== '') {                                                 // Checking where is the dragged ship
      let currentShip = this.shipList1.find(ship => ship.name === this.shipName);
      if (currentShip === undefined) {
        currentShip = this.shipList2.find(ship => ship.name === this.shipName);
      }
      if (currentShip !== undefined) {
        if (!currentShip.rotate) {                                              // *Current ship is HORIZONTAL
          if (currentShip.size <= (this.width - col + 1)) {                     // Current ship size is <= than remaining space in a row
            if (this.shipList2[0] !== undefined) {
              this.hoverPlace = dropPlace;
              
              this.shipList2.forEach(ship => {                                  // Checking if space is taken
                if (ship.name !== this.shipName) {                           
                  if ((ship.col === col && ship.row === row)) {
                    this.hoverPlace = this.dragStart;                                                  
                  }
                  if ((ship.col + ship.size) > col && ship.row === row && ship.col < col) {
                    this.hoverPlace = this.dragStart;
                  }
                  if ((ship.col - col) < (currentShip!.size) && ship.row === row && ship.col > col) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (ship.rotate) {                                            // *Checking for VERTICAL ships when placing a HORIZONTAL ship
                    if (ship.col > col                                                           
                      && (col + currentShip!.size - 1) >= ship.col                 
                      && (row >= ship.row && row <= (ship.row + ship.size - 1))) { 
                      this.hoverPlace = this.dragStart;
                    }
                    if (ship.row === row && ship.col < col) {
                      this.hoverPlace = dropPlace;
                    }
                  } 
                }
              })
            } else { 
              this.hoverPlace = dropPlace; 
            }
          } else {
            this.hoverPlace = this.dragStart;
          }

        } else {                                                              // *Current ship is VERTICAL
          if (currentShip.size <= (this.width - row + 1)) {                   // Current ship size is <= than remaining space in a row
            if (this.shipList2[0] !== undefined) {
              this.hoverPlace = dropPlace;

              this.shipList2.forEach(ship => {                                // Checking if space is taken
                if (ship.name !== this.shipName) {
                  if ((ship.col === col && ship.row === row)) {
                    this.hoverPlace = this.dragStart;
                  }
                  if ((ship.row + ship.size) > row && ship.col === col && ship.row < row) {
                    this.hoverPlace = this.dragStart;
                  }
                  if ((ship.row - row) < (currentShip!.size) && ship.col === col && ship.row > row) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (!ship.rotate) {                                         // *Checking for HORIZONTAL ships when placing a VERTICAL ship
                    if (ship.row > row 
                      && (row + currentShip!.size - 1) >= ship.row 
                      && (col >= ship.col && col <= (ship.col + ship.size - 1))) { 
                      this.hoverPlace = this.dragStart;
                    }
                    if (ship.col === col && ship.row < row) {
                      this.hoverPlace = dropPlace;
                    }
                  }
                }                               
              })
            } else { 
              this.hoverPlace = dropPlace; 
            }
          } else {
            this.hoverPlace = this.dragStart;
          }
        }
      }
    }
  }


  public dragEnded(event: CdkDragEnd): void {
    this.dragEnd = this.hoverPlace;
    this.increaseZIndex(event.source.element);

    if (this.dragEnd.type === "cell" && this.dragStart.type !== "cell") {  // Dropping ship inside the board
      this.moveFromshipList1To2(event.source.element.nativeElement.id);    
      if (this.shipList1[0] !== undefined) {
        this.shipList1[0].rotate = false;
      }
      event.source._dragRef.reset();
    }
    
    if (this.dragEnd.type !== "cell" && this.dragStart.type !== "list") {  // Dropping ship outside DropLists
      this.moveFromshipList2To1(event.source.element.nativeElement.id);
      if (this.shipList1[0] !== undefined) {
        this.shipList1[0].rotate = false;
      }
      event.source._dragRef.reset();
    }
   
    if (this.dragEnd.type === "list" && this.dragStart.type === "list") {  // Moving ship around available ships
      event.source._dragRef.reset();
    }
   
    if (this.dragEnd.type === "cell" && this.dragStart.type === "cell") {  // Moving ship around the board  // !BUG
      let index = Number(event.source.element.nativeElement.id);          
      let item = this.shipList2[index];                                    
      item = this.updateShip(item);                                        
      this.shipList2.splice(index, 1);                                     
      this.shipList2.push(item);                                           
      event.source._dragRef.reset();
    }
  }


  private moveFromshipList2To1(id: string): void {
    let index = Number(id);                                               
    let item = this.shipList2[index];
    let aux = [item].concat(this.shipList1);
    this.shipList1 = aux;
    this.shipList2.splice(index, 1);
  }


  private moveFromshipList1To2(id: string): void {
    let index = Number(id);                                               
    let item = this.updateShip(this.shipList1[index]);                     
    this.shipList2.push(item);                                            
    this.shipList1.splice(index, 1);
  }


  public updateShip(ship: ShipComponent): ShipComponent {
    ship.left = this.dragEnd.cellX - this.boardElement.nativeElement.getBoundingClientRect().x;
    ship.top = this.dragEnd.cellY - this.boardElement.nativeElement.getBoundingClientRect().y;
    ship.col = this.dragEnd.col;
    ship.row = this.dragEnd.row;
    ship.occupiedCoords =
        ship.size === 5 && !ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col+1, y: ship.row}, {x: ship.col+2, y: ship.row}, {x: ship.col+3, y: ship.row}, {x: ship.col+4, y: ship.row}]
      : ship.size === 5 &&  ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col, y: ship.row+1}, {x: ship.col, y: ship.row+2}, {x: ship.col, y: ship.row+3}, {x: ship.col, y: ship.row+4}]
      : ship.size === 4 && !ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col+1, y: ship.row}, {x: ship.col+2, y: ship.row}, {x: ship.col+3, y: ship.row}]
      : ship.size === 4 &&  ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col, y: ship.row+1}, {x: ship.col, y: ship.row+2}, {x: ship.col, y: ship.row+3}]
      : ship.size === 3 && !ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col+1, y: ship.row}, {x: ship.col+2, y: ship.row}]
      : ship.size === 3 &&  ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col, y: ship.row+1}, {x: ship.col, y: ship.row+2}]
      : ship.size === 2 && !ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col+1, y: ship.row}]
      : ship.size === 2 &&  ship.rotate ? [{x: ship.col, y: ship.row}, {x: ship.col, y: ship.row+1}]
      : ship.size === 1 && !ship.rotate ? [{x: ship.col, y: ship.row}]
      : []
    return ship;
  }


  public dragMoved(event: CdkDragMove): void {
    this.decreaseZIndex(event.source.element);
  }
  

  private decreaseZIndex(element: ElementRef): void {
    element.nativeElement.style.zIndex = "-1";
    let elem = element.nativeElement.children[0] as HTMLElement;
    elem.style.zIndex = "-1";
  }
  
  
  private increaseZIndex(element: ElementRef): void {
    element.nativeElement.style.zIndex = "100";
    let elem = element.nativeElement.children[0] as HTMLElement;
    elem.style.zIndex = "100";
  }


  public getFinalData(): void {
    const occupiedCoords: Coordinates[][] = [];
    this.shipList2.forEach(ship => occupiedCoords.push(ship.occupiedCoords));

    this.playerFinalData = {
      playerId: 0, // TODO: Hardcoding for now, then --> this.players.find(player => player.id === id)
      ships: occupiedCoords
    }
  }


  public startGame(): void {
    this.getFinalData();
    console.log(this.playerFinalData)
    // this.router.navigate(["/game"]);
  }

}
