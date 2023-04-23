export interface Cell {
  id: string;
  gridId: number;
  shipId: string;
  ship: string;
  xaxis: number;
  yaxis: number;
  state: number;
}

export interface Grid {
  id: number;
  playerId: number;
  cells: Cell[];
  player: string;
  playerShotGrids: string[];
  playerUserGrids: string[];
}

export interface shotGrid {
  id: number;
  playerId: number;
  cells: Cell[];
  player: string;
  playerShotGrids: string[];
  playerUserGrids: string[];
}

export interface userGrid {
  id: number;
  playerId: number;
  cells: Cell[];
  player: string;
  playerShotGrids: string[];
  playerUserGrids: string[];
}

// Landing Page Component
export interface PlayerFront {   // Info sent to backend
  name: string;
  team: number;
}


// Board Component
export interface Player {       // Info received from backend
  id: string;
  name: string;
  team: number;
  userGridId: number;
  shotGridId: number;
  points: number;
  grids: Grid[];
  ships: Ship[];
  shotGrid: shotGrid;
  userGrid: userGrid;
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

export interface PlayerPositionData {
  playerId: number;
  ships: Coordinates[][];
}




// export interface ShipsPosition {
//   ship_4_1: Coordinates[]; // Size 4
//   ship_3_1: Coordinates[]; // Size 3
//   ship_3_2: Coordinates[]; // Size 3
//   ship_3_3: Coordinates[]; // Size 3
//   ship_2_1: Coordinates[]; // Size 2
//   ship_2_2: Coordinates[]; // Size 2
//   ship_2_3: Coordinates[]; // Size 2   // Example: [1,4] [5,6]
//   ship_1_1: Coordinates[]; // Size 1
//   ship_1_2: Coordinates[]; // Size 1
// }

export interface Ship {
  id?: number;
  name: string,
  playerId?: number;
  length: number;
  hp?: number;
}
