import { FieldTypes, GridNumber, PlayerId } from '../../types/Game';
import {
    GAME_LOADED,
    GAME_STATE_CHANGE,
    SET_LOBBY_ID,
    SET_PLAYER_ID,
    QUIT_GAME,
} from './game.types';

const initialState = {
    lobbyId: undefined,
    playerId: undefined,
    xIsNext: 0,
    fieldTypes: [],
    players: [],
    gameLoaded: false,
};

export interface GameState {
    lobbyId: undefined | string;
    playerId: undefined | PlayerId;
    xIsNext: number;
    fieldTypes: FieldTypes;
    players: any[];
    gameLoaded: boolean;
    gameStarted: boolean;
    gameSize: GridNumber;
    resetable?: boolean;
}

const gameReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GAME_LOADED:
            return {
                ...state,
                ...action.payload,
                gameLoaded: true,
            };

        case GAME_STATE_CHANGE:
            return {
                ...state,
                ...action.payload,
            };
        case QUIT_GAME:
            return {
                ...initialState,
            };
        case SET_PLAYER_ID:
            return {
                ...state,
                playerId: action.payload,
            };

        case SET_LOBBY_ID:
            return {
                ...state,
                lobbyId: action.payload,
            };

        default:
            return state;
    }
};

export default gameReducer;
