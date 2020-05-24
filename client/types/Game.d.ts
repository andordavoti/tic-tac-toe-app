export interface Player {
    connected: boolean;
    id: string;
}

export type PlayerId = number;
export type LobbyId = string;
export type FieldTypes = null[] | string[];
export type Winner = null | 'x' | 'o';
export type GridNumber = 3 | 4 | 5;
export type GridString = '3' | '4' | '5';
export type WinnerColumns = [] | number[];
