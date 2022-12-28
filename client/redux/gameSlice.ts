import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { FieldTypes, GridNumber, PlayerId } from '../types/Game';

export interface GameState {
    lobbyId: undefined | string;
    playerId: undefined | PlayerId;
    xIsNext: number;
    fieldTypes: FieldTypes;
    players: any[];
    gameLoaded: boolean;
    gameStarted?: boolean;
    gameSize?: GridNumber;
    resetable?: boolean;
}

const initialState: GameState = {
    lobbyId: undefined,
    playerId: undefined,
    xIsNext: 0,
    fieldTypes: [],
    players: [],
    gameLoaded: false,
};

const namespace = 'game';

const gameSlice = createSlice({
    name: namespace,
    initialState,
    reducers: {
        setGameStateChange: (state, action: PayloadAction<GameState>) => ({
            ...state,
            ...action.payload,
        }),
        setGameLoaded: (state, action: PayloadAction<GameState>) => ({
            ...state,
            ...action.payload,
        }),
        setLobbyId: (state, action: PayloadAction<string>) => {
            state.lobbyId = action.payload;
        },
        setPlayerId: (state, action: PayloadAction<number>) => {
            state.playerId = action.payload;
        },
        quitGame: () => initialState,
    },
});

export const {
    setGameStateChange,
    setGameLoaded,
    setLobbyId,
    setPlayerId,
    quitGame,
} = gameSlice.actions;

export const useGame = () => useSelector(state => state.game);

export const useLobbyId = () => useSelector(state => state.game.lobbyId);

export default gameSlice.reducer;
