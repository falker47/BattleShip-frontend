export interface Player {
  id: number;                     // BLA BLA BLA 
  name: string;
  team: number;                   // 1 or 2
  ships: Ships;
  points: number;
}

export interface Coordinates {
  coordinates: number[];
}

export interface Ships {
  destroyer: Coordinates[];        // Size 2   //  Example: [1,4] [5,6]
  submarine: Coordinates[];        // Size 3
  cruiser: Coordinates[];          // Size 3
  battleship: Coordinates[];       // Size 4
  carrier: Coordinates[];          // Size 5
}

export interface Ship {
  id: number;
  name: string;
  length: number;
  hp: number;
  coordinates: Coordinates[];
}
