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
  X: number;
  Y: number;
}

export interface PlayerShipsData {
  playerId: number;
  PlayerShipsPosition: Coordinates[][];
}

export interface PlayerFrontend {
  id: number;
  name: string;
  userGridId: number;
  shotGridId: number;
  team: number;
  points: number;
  confirmed: boolean;
}

export interface PlayerFrontendGame {
  id: number;
  name: string;
  team: number;
  isPlaying: boolean;
}

export interface Shot {
  id: number; // playerId
  xAxis: number;
  yAxis: number;
}

// Backend - Response types

export interface CellApi {
  id: string;
  GridId: number;
  Xaxis: number;
  Yaxis: number;
  State: number;
  ShipId?: number;
}

export interface GridApi {
  GridId: number;
  Cells: CellApi[][];
}

export interface PlayerApi {
  id: number;
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

export interface LogApi {
  log: string;
}