
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: Participant[];
  theme?: string;
}

export enum AppView {
  LIST_MANAGEMENT = 'LIST_MANAGEMENT',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}
