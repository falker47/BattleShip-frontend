export interface Player {
  id: number;                     // 1, 2, 3, 4, 5, or 6
  name: string;
  group: number;                  // 1 or 2
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
