export interface Player {
  id: number;
  name: string;
  group: number;
  ships: Ships;
  points: number;
}

export interface Coordinates {
  coordinates: number[];
}

export interface Ships {
  destroyer: Coordinates[];        // Size 2
  submarine: Coordinates[];        // Size 3
  cruiser: Coordinates[];          // Size 3
  battleship: Coordinates[];       // Size 4
  carrier: Coordinates[];          // Size 5
}

export interface Ship {
  id: number;
  name: string;
  coordinates: Coordinates[];
  sunk: boolean;
}
