import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerFront, Player, DragModel, ShipData, PlayerPositionData } from '../api/models';
import { CdkDragDrop, transferArrayItem, moveItemInArray, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { ShipComponent } from './ship/ship.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: PlayerFront[]; // TODO: then change to type Player to get full info from backend
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
      { name: 'ship_5_1', size: 5, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_4_1', size: 4, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_3_1', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_3_2', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_1', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_2', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_2_3', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_1_1', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
      { name: 'ship_1_2', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, occupiedCoords: [] },
    ];
  }
  
  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  rotate(i: number) {
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

    console.log(this.shipName)

    if (this.shipName !== '') {                                                 // Checking where is the dragged ship (list1 or list2?)
      let currentShip = this.shipList1.find(ship => ship.name === this.shipName);
        console.log("list 1: " + currentShip)
      if (currentShip === undefined) {
        currentShip = this.shipList2.find(ship => ship.name === this.shipName);
        console.log("list 2: " + currentShip)
      }
      if (currentShip !== undefined) {                                          // Found ship
        if (!currentShip.rotate) {                                              // If ship is horizontal
          if (currentShip.size <= (this.width - col + 1)) {                     // If ship size is <= than remaining space in a row, we can place it there
            if (this.shipList2[0] === undefined) this.hoverPlace = dropPlace;
            this.shipList2.forEach(ship => {                                    // Checking if space is not taken
              if ((ship.col !== col && ship.row !== row) && (ship.col + ship.size - 1) < col) { 
                this.hoverPlace = dropPlace;
              }
            })
          } else {
            this.hoverPlace = this.dragStart;
            console.log("Ship does not fit in here!");
          }
        } else {                                                               // If ship is vertical
          if (currentShip.size <= (this.width - row + 1)) {                    // If ship size is <= than remaining space in a col, we can place it there
            if (this.shipList2[0] === undefined) this.hoverPlace = dropPlace;
            this.shipList2.forEach(ship => {                                   // Checking if space is not taken
              if ((ship.col !== col && ship.row !== row) && (ship.row + ship.size - 1) < row ) {
                this.hoverPlace = dropPlace;
              }
            })
          } else {
            this.hoverPlace = this.dragStart;
            console.log("Ship does not fit in here!");
          }
        }
      }
    }
  }


  // DRAG END
  public dragEnded(event: CdkDragEnd) {
    this.dragEnd = this.hoverPlace;

    // if (this.dragEnd !== this.dragStart) {
    //   let currentShip = this.shipList1.find(ship => ship.name === this.shipName);
    //   if (currentShip !== undefined) {
    //      // move1to2       
    //   } else {
    //     currentShip = this.shipList2.find(ship => ship.name === this.shipName);
    //   }
    // } else {
    //   event.source._dragRef.reset();
    // }

    if (this.dragEnd.type === "cell" && this.dragStart.type !== "cell") {  // Moving from available ships to board ships
      this.moveFromshipList1To2(event.source.element.nativeElement.id);    
      this.shipList1[0] !== undefined ? this.shipList1[0].rotate = false : '';
      event.source._dragRef.reset();

      // console.clear();
      // this.shipList2.map(ship => 
      //   console.log(
      //     "ship name: " + ship.name + "\n", 
      //     "ship size: " + ship.size + "\n", 
      //     "ship x axis: " + ship.col + "\n", 
      //     "ship y axis: " + ship.row + "\n", 
      //     "is ship vertical?: " + ship.rotate + "\n",
      //     ship.occupiedCoords
      //   )
      // )
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
  }


  private moveFromshipList2To1(id: string) {
    let index: number = +id;                                               
    let item = this.shipList2[index];
    let temp = [item].concat(this.shipList1);
    this.shipList1 = temp;
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
        ship.size === 5 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row], [ship.col+3, ship.row], [ship.col+4, ship.row]]
      : ship.size === 5 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2], [ship.col, ship.row+3], [ship.col, ship.row+4]]
      : ship.size === 4 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row], [ship.col+3, ship.row]] 
      : ship.size === 4 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2], [ship.col, ship.row+3]]
      : ship.size === 3 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row]] 
      : ship.size === 3 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2]]
      : ship.size === 2 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row]] 
      : ship.size === 2 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1]]
      : ship.size === 1 && !ship.rotate ? [[ship.col, ship.row]]
      : []
    return ship;
  }


  getFinalData() {
    this.shipList2.forEach(ship => {  
      const shipData = {
        name: ship.name,
        length: ship.size,
        coordinates: ship.occupiedCoords
      }
      this.shipsFinalData.push(shipData);
    })

    this.playerFinalData = {
      playerId: 0, // TODO: Hardcoding for now, then --> this.players.find(player => player.id === id)
      ships: this.shipsFinalData,
    }
  }


  startGame() {
    this.getFinalData();
    console.log(this.playerFinalData)

    // TODO: when it works, place this block of code in a service: fetch --> this.httpClient.post(...)
    // fetch ('BACKEND_URL', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     data: this.playerFinalData,
    //   }),
    //   headers: {
    //     'Content-type': 'application/json; charset=UTF-8'
    //   }
    // }).then((res) => {
    //   if (res.ok) return res.json();
    //   return Promise.reject(res);
    // }).then((data) => console.log(data)
    // ).catch((error) => console.warn('Something went wrong', error));


    // console.log(this.playerFinalData)
    // this.router.navigate(["/game"]);
  }
}
