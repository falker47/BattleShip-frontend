import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerFront, Player, DragModel, ShipData, PlayerPositionData, Coordinates } from '../api/models';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ShipComponent } from './ship/ship.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: PlayerFront[]; // TODO: when backend ready, change to type Player to get full info
  @ViewChild("board", { read: ElementRef, static: false }) boardElement!: ElementRef<HTMLElement>;
  @ViewChild("cols") cols!: ElementRef<HTMLElement>;
  @ViewChild("rows") rows!: ElementRef<HTMLElement>;
  public width = 10;
  public shipList1!: Array<ShipComponent>;
  public shipList2!: Array<ShipComponent>;
  public playerBoard!: number[][];
  public hoverPlace: DragModel = {} as DragModel;
  public dragStart: DragModel = {} as DragModel;
  public dragEnd: DragModel = {} as DragModel;
  public shipName = '';
  public xInitial = 0;
  public yInitial = 0;
  public shipsFinalData: ShipData[] = [];
  public playerFinalData!: PlayerPositionData;


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


  public rotate(i: number) {
    if (this.shipList1[i] !== null) {
      this.shipList1[i].rotate = !this.shipList1[i].rotate;
    }
  }


  // DRAG START
  public dragStarted(shipName: string) {
    this.dragStart = this.hoverPlace;
    this.shipName = shipName;
  }


  // DRAGGING
  public hoveredElement(position: any, elementType: string, row: number, col: number) {
    let dropPlace = {} as DragModel;
    dropPlace.cellX = position.x;
    dropPlace.cellY = position.y;
    dropPlace.type = elementType;
    dropPlace.row = row;
    dropPlace.col = col;

    if (this.shipList1 !== undefined) console.log('Lista 1: ' + this.shipList1[0])
    if (this.shipList2 !== undefined) console.log('Lista 2: ' + this.shipList2[0])

    if (this.shipName !== '') {                                                 // Checking where is the dragged ship (list1 or list2?)
      let currentShip = this.shipList1.find(ship => ship.name === this.shipName);
      if (currentShip === undefined) {
        currentShip = this.shipList2.find(ship => ship.name === this.shipName);
      }
      if (currentShip !== undefined) {                                          // Found ship
        if (!currentShip.rotate) {                                              // If ship is horizontal
          if (currentShip.size <= (this.width - col + 1)) {                     // If ship size is <= than remaining space in a row, we can place it there
            if (this.shipList2[0] !== undefined) {
              this.hoverPlace = dropPlace;
              this.shipList2.forEach(ship => {                                  // Checking if space is taken
                if (ship.name !== this.shipName ) {                            
                  if ((ship.col === col && ship.row === row)) {
                    this.hoverPlace = this.dragStart;                                                  
                  }
                  if ((ship.col + ship.size) > col && ship.row === row && ship.col < col) {            
                    this.hoverPlace = this.dragStart;
                  }
                  if ((ship.col - col) < (currentShip!.size) && ship.row === row && ship.col > col) {  
                    this.hoverPlace = this.dragStart;
                  }
                  if (ship.rotate) {                                                // Check for vertical ships when placing a horizontal ship
                    if (ship.col > col                                                // ship.col is smaller than the col where we want to place the current ship
                      && (col + currentShip!.size - 1) >= ship.col                    // col plus current ship size is bigger or equal to ship.col
                      && (row >= ship.row                                             // row is between ship.row and ship.row + ship.size
                      && row <= (ship.row + ship.size - 1))
                    ) { 
                      this.hoverPlace = this.dragStart;
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
        } else {                                                                    // If ship is vertical
            if (currentShip.size <= (this.width - row + 1)) {                       // If ship size is <= than remaining space in a row, we can place it there
              if (this.shipList2[0] !== undefined) {
                this.hoverPlace = dropPlace;
                this.shipList2.forEach(ship => {                                    // Checking if space is taken
                  if (ship.name !== this.shipName ) {
                    if ((ship.col === col && ship.row === row)) {
                      this.hoverPlace = this.dragStart;
                    }
                    if ((ship.row + ship.size) > row && ship.col === col && ship.row < row) {
                      this.hoverPlace = this.dragStart;
                    }
                    if ((ship.row - row) < (currentShip!.size) && ship.col === col && ship.row > row) {
                      this.hoverPlace = this.dragStart;
                    }
                    if (!ship.rotate) {                                             // Check for horizontal ships when placing a vertical ship
                      if (ship.row > row                                              // ship.row is smaller than the row where we want to place the current ship
                        && (row + currentShip!.size - 1) >= ship.row                  // row plus size of the current ship is bigger or equalto ship.row
                        && (col >= ship.col && col <= (ship.col + ship.size - 1))     // col is between ship.col and ship.col + ship.size
                      ) { 
                        this.hoverPlace = this.dragStart;
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


  // DRAG END
  public dragEnded(event: CdkDragEnd) {
    this.dragEnd = this.hoverPlace;

    if (this.dragEnd.type === "cell" && this.dragStart.type !== "cell") {  // Moving from available ships to board ships
      this.moveFromshipList1To2(event.source.element.nativeElement.id);    
      if (this.shipList1[0] !== undefined) {
        this.shipList1[0].rotate = false;
      }
      event.source._dragRef.reset();
    }
    
    if (this.dragEnd.type !== "cell" && this.dragStart.type !== "list") {  // Moving from board ships to available ships when dropping ship outside DropLists
      this.moveFromshipList2To1(event.source.element.nativeElement.id);
      event.source._dragRef.reset();
    }
   
    if (this.dragEnd.type === "list" && this.dragStart.type === "list") {  // Moving ship around available ships
      event.source._dragRef.reset();
    }
   
    if (this.dragEnd.type === "cell" && this.dragStart.type === "cell") {  // Moving ship around board
      let index: number = +event.source.element.nativeElement.id;          
      let item = this.shipList2[index];                                    // Search dragged ship inside "ships on board list"
      item = this.updateShip(item);                                        // Update dragged ship position on board
      this.shipList2.splice(index, 1);                                     // Delete dragged ship from "ships on board list" to:
      this.shipList2.push(item);                                           // Push it at the end of the array
      event.source._dragRef.reset();
    }


    if (this.shipList1 !== undefined) console.log('Lista 1: ' + this.shipList1[0].name)
    if (this.shipList2 !== undefined) console.log('Lista 2: ' + this.shipList2[0].name)
  }


  private moveFromshipList2To1(id: string) {
    let index: number = +id;                                               
    let item = this.shipList2[index];
    let aux = [item].concat(this.shipList1);
    this.shipList1 = aux;
    this.shipList2.splice(index, 1);
  }


  private moveFromshipList1To2(id: string) {
    let index: number = +id;                                               // Index will be always 0
    let item = this.updateShip(this.shipList1[index]);                     // Placing the new first ship of "available ships list" in the board
    this.shipList2.push(item);                                             // Pushing this ship to "ships on board list"
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


  public getFinalData() {
    this.shipList2.forEach(ship => {  
      const shipData = {
        name: ship.name,
        length: ship.size,
        coordinates: ship.occupiedCoords
      }
      this.shipsFinalData.push(shipData);
    })

    const coords: Coordinates[][] = [];
    this.shipsFinalData.forEach(ship => coords.push(ship.coordinates))

    this.playerFinalData = {
      playerId: 0, // TODO: Hardcoding for now, then --> this.players.find(player => player.id === id)
      ships: coords
    }
  }


  public startGame() {
    this.getFinalData();
    console.log(this.playerFinalData)
    // this.router.navigate(["/game"]);
  }
}
