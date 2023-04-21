import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Player, Ship, DragModel } from '../api/models';
import { CdkDragDrop, transferArrayItem, moveItemInArray, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { ShipComponent } from './ship/ship.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: Player[];
  @ViewChild("board", { read: ElementRef, static: false }) boardElement!: ElementRef<HTMLElement>;
  @ViewChild("cols") cols!: ElementRef<HTMLElement>;
  @ViewChild("rows") rows!: ElementRef<HTMLElement>;
  public width = 10;
  public shipList1!: Array<ShipComponent>;
  public shipList2!: Array<ShipComponent>;
  public boardP1!: number[][];
  public hoverPlace: DragModel = {} as DragModel;
  public dragStart: DragModel = {} as DragModel;
  public dragEnd: DragModel = {} as DragModel;
  public xInitial = 0;
  public yInitial = 0;

  constructor(private router: Router) {}


  ngOnInit () {
    this.boardP1 = this.getEmptyBoard();
    this.shipList1 = this.createFleet();
    this.shipList2 = [];
    console.log(this.shipList1)
  }
  

  // DRAG END (DROP)
  public dragEnded(event: CdkDragEnd) {
    this.dragEnd = this.hoverPlace;
    this.increaseZIndex(event.source.element);

    if (this.dragEnd.type === "cell" && this.dragStart.type !== "cell") {
      this.moveFromshipList1To2(event.source.element.nativeElement.id);
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type !== "cell" && this.dragStart.type !== "list") {
      this.moveFromshipList2To1(event.source.element.nativeElement.id);
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type === "list" && this.dragStart.type === "list") {
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type === "cell" && this.dragStart.type === "cell") {
      let index: number = +event.source.element.nativeElement.id;
      let item = this.shipList2[index];
      item = this.updateShipsCss(item);
      this.shipList2.splice(index, 1);
      this.shipList2.push(item);
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
    let index: number = +id;
    let item = this.updateShipsCss(this.shipList1[index]);
    this.shipList2.push(item);
    this.shipList1.splice(index, 1);
  }

  public updateOnBoardCss(ship: ShipComponent): ShipComponent {
    ship.left = this.dragEnd.cellX;
    ship.top = this.dragEnd.cellY;
    return ship;
  }

  public updateShipsCss(ship: ShipComponent): ShipComponent {
    ship.left = this.dragEnd.cellX - this.boardElement.nativeElement.getBoundingClientRect().x;
    ship.top = this.dragEnd.cellY - this.boardElement.nativeElement.getBoundingClientRect().y;
    return ship;
  }

  // Check if space is valid and available
  public hoveredElement(position: any, elementType: string, row: number, col: number, event: Event) {
    let dropPlace = {} as DragModel;
    dropPlace.cellX = position.x;
    dropPlace.cellY = position.y;
    dropPlace.type = elementType;
    dropPlace.row = row;
    dropPlace.col = col;

    // Horizontal check - right side
    if (col <= (this.width - this.shipList1[0].size + 1)) { 
      this.hoverPlace = dropPlace;
    } else {
      console.log("Ship does not fit in here!")
    }
  }

  // DRAG START
  public dragStarted(event: CdkDragStart) {
    this.dragStart = this.hoverPlace;
  }

  // DRAG MOVE
  public dragMoved(event: CdkDragMove) {
    this.decreaseZIndex(event.source.element);
  }

  private decreaseZIndex(element: ElementRef) {
    element.nativeElement.style.zIndex = "-1";
    let el = element.nativeElement.children[0] as HTMLElement;
    el.style.zIndex = "-1";
  }

  private increaseZIndex(element: ElementRef) {
    element.nativeElement.style.zIndex = "100";
    let el = element.nativeElement.children[0] as HTMLElement;
    el.style.zIndex = "100";
  }


  // Create fleet and board
  private createFleet(): Array<ShipComponent> {
    return [
      { name: 'ship_5_1', size: 5, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_4_1', size: 4, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_3_1', size: 3, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_3_2', size: 3, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_2_1', size: 2, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_2_2', size: 2, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_2_3', size: 2, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_1_1', size: 1, rotate: false, top: 0, left: 0, deployed: false },
      { name: 'ship_1_2', size: 1, rotate: false, top: 0, left: 0, deployed: false },
    ];
  }
  
  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }

    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }


  rotate(event: Event) {
    console.log(event)
    this.shipList1[0].rotate = !this.shipList1[0].rotate;
  }


  startGame() {
    // Send positioning of ships to backend
    
    console.log("Start game...");
    // this.router.navigate(["/game"]);
  }
}
