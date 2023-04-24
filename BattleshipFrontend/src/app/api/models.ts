export interface PlayerFront {
  id: string; // TODO temporary
  name: string;
  team: number;
  confirmed: boolean; // TODO temporary
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

export interface PlayerShipsData {
  playerId: string;
  team: number;
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
  confirmed: boolean;
}
