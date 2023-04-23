export interface PlayerFront {
  name: string;
  team: number;
}

export interface DragModel {
  cellX: number;
  cellY: number;
  type: string;
  row: number;
  col: number;
}

export interface ShipData {
  name: string;
  length: number;
  coordinates: Coordinates[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface PlayerShipsData { // TODO: delete ShipsFront and keep this one
  playerId: number;
  ships: Coordinates[][];
}


export interface Cell {
  id: string;
  gridId: number;
  xaxis: number;
  yaxis: number;
  state: number;
  shipId?: string;
}

export interface Grid {
  id: number;
  cells: Cell[][];
}

export interface Ship {
  id: number;
  playerId?: number;
  length: number;
  hp: number;
}

export interface Player {
  id: string;
  name: string;
  userGridId: number;
  shotGridId: number;
  team: number;
  points: number;
}
