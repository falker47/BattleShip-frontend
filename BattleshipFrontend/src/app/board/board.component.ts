import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  PlayerApi,
  PlayerFrontend,
  DragModel,
  PlayerShipsData,
  Coordinates,
} from '../api/models';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ShipComponent } from './ship/ship.component';
import { Router } from '@angular/router';
import { PlayerService } from '../api/player.service';

window.addEventListener('beforeunload', (event) => {
  event.returnValue = `Are you sure you want to leave?`;
});

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('board') boardElement!: ElementRef<HTMLElement>;
  public width: number = 10;
  public shipName: string = '';
  public playerBoard!: number[][];
  public cellPixels!: number;
  public xInitial: number = 0;
  public yInitial: number = 0;
  public shipList1!: Array<ShipComponent>;
  public shipList2!: Array<ShipComponent>;
  public hoverPlace = {} as DragModel;
  public dragStart = {} as DragModel;
  public dragEnd = {} as DragModel;
  public currentPlayer!: PlayerFrontend;
  public currentIndex: number = 0;
  public playersFinalData: PlayerShipsData = {
    playerId: 0,
    PlayerShipsPosition: [],
  };
  public playersData: PlayerFrontend[] = [];

  public gamePlayers: PlayerApi[] = [];

  constructor(private playerService: PlayerService, private router: Router) {
    this.gamePlayers = this.playerService.getGamePlayers();
  }

  ngOnInit() {
    this.addConfirmedPropertyToPlayer();
    this.currentPlayer = this.getCurrentPlayer(this.currentIndex);
    this.playerBoard = this.getEmptyBoard();
    this.cellPixels = this.calculateCellPixels();
    this.shipList1 = this.createFleet();
    this.shipList2 = [];
  }

  private addConfirmedPropertyToPlayer() {
    this.gamePlayers.forEach((player) => {
      this.playersData.push({
        id: player.id,
        name: player.name,
        userGridId: player.userGridId,
        shotGridId: player.shotGridId,
        team: player.team,
        points: player.points,
        confirmed: false,
      });
    });
  }

  private getCurrentPlayer(index: number): PlayerFrontend {
    return this.playersData[index];
  }

  private createFleet(): Array<ShipComponent> {
    return [
      {
        size: 5,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_5_1_red',
      },
      {
        size: 4,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_4_1_green',
      },
      {
        size: 3,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_3_1_blue',
      },
      {
        size: 3,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_3_2_pink',
      },
      {
        size: 2,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_2_1_orange',
      },
      {
        size: 2,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_2_2_yellow',
      },
      {
        size: 2,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_2_3_lightgreen',
      },
      {
        size: 1,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_1_1_violet',
      },
      {
        size: 1,
        isVertical: false,
        top: 0,
        left: 0,
        col: 0,
        row: 0,
        occupiedCoords: [],
        cellPixels: 30,
        boardSize: 0,
        name: 'ship_1_2_lightblue',
      },
    ];
  }

  private getEmptyBoard(): number[][] {
    for (let i = 0; i <= this.playersData.length; i++) {
      if (i > 2) this.width += 5;
    }
    return Array.from({ length: this.width }, () => Array(this.width).fill(0));
  }

  public calculateCellPixels(): number {
    if (this.playersData.length === 2 || this.playersData.length === 3)
      return 30;
    if (this.playersData.length === 4 || this.playersData.length === 5)
      return 25;
    if (this.playersData.length >= 6) return 20;
    else return 30;
  }

  public getFinalData(): void {
    const occupiedCoords: Coordinates[][] = [];
    this.shipList2.forEach((ship) => occupiedCoords.push(ship.occupiedCoords));

    this.playersFinalData.playerId = this.currentPlayer.id;
    this.playersFinalData.PlayerShipsPosition = occupiedCoords;
  }

  public async confirmShips() {
    this.getFinalData();

    await this.playerService
      .postPlaceShips(this.playersFinalData)
      .toPromise()
      .then((res) => {
        if (res) {
          console.log(res);
          this.playersData.map((player) => {
            if (player.id === this.currentPlayer.id) {
              player.confirmed = true;
            }
          });

          let nextIndex = ++this.currentIndex;
          if (this.playersData[nextIndex] !== undefined) {
            this.currentPlayer = this.getCurrentPlayer(nextIndex);
            this.shipList1 = this.createFleet();
            this.shipList2 = [];
          }
        }
      });
  }

  public areAllPlayersReady(): boolean {
    return this.playersData.every((player) => player.confirmed === true);
  }

  public async startGame() {
    await this.playerService
      .getGridByPlayerId(1, this.width, true)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setUserGrid(res);
        }
      });
    await this.playerService
      .getGridByPlayerId(1, this.width, false)
      .toPromise()
      .then((res) => {
        if (res) {
          this.playerService.setShotGrid(res);
        }
      });
    this.router.navigate(['/game']);
  }

  // ------------- SHIPS POSITIONING - DRAG & DROP ------------------ //

  public rotateAvailableShip(i: number): void {
    this.shipList1[i].isVertical = !this.shipList1[i].isVertical;
  }

  public resetShip(i: number): void {
    this.moveFromshipList2To1(i.toString());
    this.hoverPlace = this.dragStart;
    if (this.shipList1[0] !== undefined) {
      this.shipList1[0].isVertical = false;
    }
  }

  public dragStarted(shipName: string): void {
    this.dragStart = this.hoverPlace;
    this.shipName = shipName;
  }

  public hoveredPlace(
    position: any,
    elementType: string,
    row: number,
    col: number
  ): void {
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

    if (this.shipName !== '') {
      let currentShip = this.shipList1.find(
        (ship) => ship.name === this.shipName
      );
      if (currentShip === undefined) {
        currentShip = this.shipList2.find(
          (ship) => ship.name === this.shipName
        );
      }
      if (currentShip !== undefined) {
        if (!currentShip.isVertical) {
          // *Current ship is HORIZONTAL
          if (currentShip.size <= this.width - col + 1) {
            // Current ship size is <= than remaining space in a row
            if (this.shipList2[0] !== undefined) {
              this.hoverPlace = dropPlace;

              this.shipList2.forEach((ship) => {
                // Checking for HORIZONTAL ships when placing a HORIZONTAL ship
                if (ship.name !== this.shipName) {
                  if (ship.col === col && ship.row === row) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (
                    ship.col + ship.size > col &&
                    ship.row === row &&
                    ship.col < col
                  ) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (
                    ship.col - col < currentShip!.size &&
                    ship.row === row &&
                    ship.col > col
                  ) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (ship.isVertical) {
                    // Checking for VERTICAL ships when placing a HORIZONTAL ship
                    if (
                      ship.col > col &&
                      col + currentShip!.size - 1 >= ship.col &&
                      row >= ship.row &&
                      row <= ship.row + ship.size - 1
                    ) {
                      this.hoverPlace = this.dragStart;
                    }
                    if (ship.row === row && ship.col < col) {
                      this.hoverPlace = dropPlace;
                    }
                  }
                }
              });
            } else {
              this.hoverPlace = dropPlace;
            }
          } else {
            this.hoverPlace = this.dragStart;
          }
        } else {
          // *Current ship is VERTICAL
          if (currentShip.size <= this.width - row + 1) {
            // Current ship size is <= than remaining space in a col
            if (this.shipList2[0] !== undefined) {
              this.hoverPlace = dropPlace;

              this.shipList2.forEach((ship) => {
                // Checking for VERTICAL ships when placing a VERTICAL ship
                if (ship.name !== this.shipName) {
                  if (ship.col === col && ship.row === row) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (
                    ship.row + ship.size > row &&
                    ship.col === col &&
                    ship.row < row
                  ) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (
                    ship.row - row < currentShip!.size &&
                    ship.col === col &&
                    ship.row > row
                  ) {
                    this.hoverPlace = this.dragStart;
                  }
                  if (!ship.isVertical) {
                    // Checking for HORIZONTAL ships when placing a VERTICAL ship
                    if (
                      ship.row > row &&
                      row + currentShip!.size - 1 >= ship.row &&
                      col >= ship.col &&
                      col <= ship.col + ship.size - 1
                    ) {
                      this.hoverPlace = this.dragStart;
                    }
                    if (ship.col === col && ship.row < row) {
                      this.hoverPlace = dropPlace;
                    }
                  }
                }
              });
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

    if (this.dragEnd.type === 'cell' && this.dragStart.type !== 'cell') {
      // Dropping ship inside the board
      this.moveFromshipList1To2(event.source.element.nativeElement.id);
      if (this.shipList1[0] !== undefined) {
        this.shipList1[0].isVertical = false;
      }
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type !== 'cell' && this.dragStart.type !== 'list') {
      // Dropping ship outside DropLists
      this.moveFromshipList2To1(event.source.element.nativeElement.id);
      if (this.shipList1[0] !== undefined) {
        this.shipList1[0].isVertical = false;
      }
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type === 'list' && this.dragStart.type === 'list') {
      // Moving ship around available ships
      event.source._dragRef.reset();
    }

    if (this.dragEnd.type === 'cell' && this.dragStart.type === 'cell') {
      // Moving ship around the board
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
    ship.left =
      this.dragEnd.cellX -
      this.boardElement.nativeElement.getBoundingClientRect().x;
    ship.top =
      this.dragEnd.cellY -
      this.boardElement.nativeElement.getBoundingClientRect().y;
    ship.col = this.dragEnd.col;
    ship.row = this.dragEnd.row;
    ship.occupiedCoords =
      ship.size === 5 && !ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col + 1, Y: ship.row },
            { X: ship.col + 2, Y: ship.row },
            { X: ship.col + 3, Y: ship.row },
            { X: ship.col + 4, Y: ship.row },
          ]
        : ship.size === 5 && ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col, Y: ship.row + 1 },
            { X: ship.col, Y: ship.row + 2 },
            { X: ship.col, Y: ship.row + 3 },
            { X: ship.col, Y: ship.row + 4 },
          ]
        : ship.size === 4 && !ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col + 1, Y: ship.row },
            { X: ship.col + 2, Y: ship.row },
            { X: ship.col + 3, Y: ship.row },
          ]
        : ship.size === 4 && ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col, Y: ship.row + 1 },
            { X: ship.col, Y: ship.row + 2 },
            { X: ship.col, Y: ship.row + 3 },
          ]
        : ship.size === 3 && !ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col + 1, Y: ship.row },
            { X: ship.col + 2, Y: ship.row },
          ]
        : ship.size === 3 && ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col, Y: ship.row + 1 },
            { X: ship.col, Y: ship.row + 2 },
          ]
        : ship.size === 2 && !ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col + 1, Y: ship.row },
          ]
        : ship.size === 2 && ship.isVertical
        ? [
            { X: ship.col, Y: ship.row },
            { X: ship.col, Y: ship.row + 1 },
          ]
        : ship.size === 1 && !ship.isVertical
        ? [{ X: ship.col, Y: ship.row }]
        : [];
    return ship;
  }

  public dragMoved(event: CdkDragMove): void {
    this.decreaseZIndex(event.source.element);
  }

  private decreaseZIndex(element: ElementRef): void {
    element.nativeElement.style.zIndex = '-1';
    let elem = element.nativeElement.children[0] as HTMLElement;
    elem.style.zIndex = '-1';
  }

  private increaseZIndex(element: ElementRef): void {
    element.nativeElement.style.zIndex = '100';
    let elem = element.nativeElement.children[0] as HTMLElement;
    elem.style.zIndex = '100';
  }
}
