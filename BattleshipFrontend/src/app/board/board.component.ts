import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerFront, Player, DragModel, ShipData, PositionData } from '../api/models';
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
  public xInitial = 0;
  public yInitial = 0;

  constructor(private router: Router) {}


  ngOnInit () {
    this.playerBoard = this.getEmptyBoard();
    this.shipList1 = this.createFleet();
    this.shipList2 = [];
    console.log(this.playerBoard);
    console.log(this.shipList1);
  }


  // DRAG END
  public dragEnded(event: CdkDragEnd) {
    this.dragEnd = this.hoverPlace;
    // this.increaseZIndex(event.source.element); // TODO: we dont need this

    if (this.dragEnd.type === "cell" && this.dragStart.type !== "cell") {  // Moving from available ships to board ships
      this.moveFromshipList1To2(event.source.element.nativeElement.id);    
      this.shipList1[0] !== undefined ? this.shipList1[0].rotate = false : ''; // Updating rotate property in following ship in the "available ships list"
      event.source._dragRef.reset();
      
      console.clear();
      console.log(this.shipList1[0])
      this.shipList2.map(ship => 
        console.log(
          "ship name: " + ship.name + "\n", 
          "ship size: " + ship.size + "\n", 
          "ship x axis: " + ship.col + "\n", 
          "ship y axis: " + ship.row + "\n", 
          "is ship vertical?: " + ship.rotate
        )
      )
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
      console.log(index)
      let item = this.shipList2[index];                                    // Search dragged ship inside "ships on board list"
      item = this.updateShipsCss(item);                                    // Update dragged ship position on board
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
    let item = this.updateShipsCss(this.shipList1[index]);                 // Placing the new first ship of "available ships list" in the board
    this.shipList2.push(item);                                             // Pushing this ship to "ships on board list"
    this.shipList1.splice(index, 1);
  }

  // public updateOnBoardCss(ship: ShipComponent): ShipComponent { // TODO: we dont need this, is never used
  //   console.clear();
  //   ship.left = this.dragEnd.cellX;
  //   ship.top = this.dragEnd.cellY;
  //   return ship;
  // }

  public updateShipsCss(ship: ShipComponent): ShipComponent {             // Updating ship position on board
    ship.col = this.dragEnd.col;
    ship.row = this.dragEnd.row;
    ship.left = this.dragEnd.cellX - this.boardElement.nativeElement.getBoundingClientRect().x;
    ship.top = this.dragEnd.cellY - this.boardElement.nativeElement.getBoundingClientRect().y;
    return ship;
  }

  // Check if space is valid and available
  public hoveredElement(position: any, elementType: string, row: number, col: number) {
    let dropPlace = {} as DragModel;
    dropPlace.cellX = position.x;
    dropPlace.cellY = position.y;
    dropPlace.type = elementType;
    dropPlace.row = row;
    dropPlace.col = col;

    if (this.shipList1[0] !== undefined) {
      if (!this.shipList1[0].rotate) {                                   // If ship is horizontal
        if (this.shipList1[0].size <= (this.width - col + 1)) {          // If ship size is <= than remaining space in a row, we can place it there
          this.hoverPlace = dropPlace;
        } else {
          console.log("Ship does not fit in here!")
        }
      }
      else {                                                             // If ship is vertical
        if (this.shipList1[0].size <= (this.width - row + 1)) {          // If ship size is <= than remaining space in a col, we can place it there
          this.hoverPlace = dropPlace;
        } else {
          console.log("Ship does not fit in here!")
        }
      }
    }
    
  }

  // DRAG START
  public dragStarted(event: CdkDragStart) {
    this.dragStart = this.hoverPlace;
  }

  // DRAG MOVE // TODO: we dont need this
  // public dragMoved(event: CdkDragMove) {
  //   this.decreaseZIndex(event.source.element);
  // }

  // private decreaseZIndex(element: ElementRef) {
  //   element.nativeElement.style.zIndex = "-1";
  //   let el = element.nativeElement.children[0] as HTMLElement;
  //   el.style.zIndex = "-1";
  // }

  // private increaseZIndex(element: ElementRef) {
  //   element.nativeElement.style.zIndex = "100";
  //   let el = element.nativeElement.children[0] as HTMLElement;
  //   el.style.zIndex = "100";
  // }


  // Create fleet and board
  private createFleet(): Array<ShipComponent> {
    return [
      { name: 'ship_5_1', size: 5, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false }, // TODO: deployed is never use, maybe delete later
      { name: 'ship_4_1', size: 4, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_3_1', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_3_2', size: 3, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_2_1', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_2_2', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_2_3', size: 2, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_1_1', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
      { name: 'ship_1_2', size: 1, rotate: false, top: 0, left: 0, col: 0, row: 0, deployed: false },
    ];
  }
  
  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }

    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  rotate(i: number) {
    if (this.shipList1[0].deployed !== null) {
      this.shipList1[0].rotate = !this.shipList1[0].rotate;
    }
  }

  startGame() {
    const shipsData: ShipData[] = [];
    this.shipList2.forEach(ship => {  
      const s = {
        name: ship.name,
        length: ship.size,
        coordinates: ship.size === 5 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row], [ship.col+3, ship.row], [ship.col+4, ship.row]] // Horizontal ship
                   : ship.size === 5 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2], [ship.col, ship.row+3], [ship.col, ship.row+4]] // Vertical ship
                   : ship.size === 4 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row], [ship.col+3, ship.row]] 
                   : ship.size === 4 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2], [ship.col, ship.row+3]]
                   : ship.size === 3 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row], [ship.col+2, ship.row]] 
                   : ship.size === 3 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1], [ship.col, ship.row+2]]
                   : ship.size === 2 && !ship.rotate ? [[ship.col, ship.row], [ship.col+1, ship.row]] 
                   : ship.size === 2 &&  ship.rotate ? [[ship.col, ship.row], [ship.col, ship.row+1]]
                   : ship.size === 1 && !ship.rotate ? [[ship.col, ship.row]]
                   : []
      }
      shipsData.push(s);
    })

    const playerData: PositionData = {
      playerId: 1, // TODO: Hardcoding for now, then --> this.players.find(player => player.id === id)
      ships: shipsData,
    }

    // TODO: when it works, place this block of code in a service: fetch --> this.httpClient.post(...)
    fetch ('BACKEND_URL', {
      method: 'POST',
      body: JSON.stringify({
        playerData,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(res);
    }).then((data) => console.log(data)
    ).catch((error) => console.warn('Something went wrong', error));


    console.log(playerData)
    // this.router.navigate(["/game"]);
  }
}
