export interface IOccupancy {
  type?: string;
  event?: string;
  count?: number;
}

export class Occupancy implements IOccupancy {
  constructor(public type?: string, public event?: string, public count?: number) {
  }
}

