// Frontend

export interface PlayerInitialData {
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

export interface PlayerShipsData {
  playerId: string;
  ships: Coordinates[][];
}

export interface PlayerFrontend {
  id: string;
  name: string;
  userGridId: number;
  shotGridId: number;
  team: number;
  points: number;
  confirmed: boolean;
}

export interface Shot {
  id: number;
  xAxis: number;
  yAxis: number;
}

// Backend - Response chiamate get

export interface CellApi {
  id: string;
  gridId: number;
  xaxis: number;
  yaxis: number;
  state: number;
  shipId?: string;
}

export interface GridApi {
  id: number;
  cells: CellApi[][];
}

export interface PlayerApi {
  id: string;
  name: string;
  userGridId: number;
  shotGridId: number;
  team: number;
  points: number;
}

export interface ShipApi {
  id: number;
  playerId: number;
  length: number;
  hp: number;
}
