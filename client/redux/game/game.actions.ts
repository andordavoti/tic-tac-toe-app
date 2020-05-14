import {
  GAME_STATE_CHANGE,
  GAME_LOADED,
  SET_PLAYER_ID,
  SET_LOBBY_ID,
  QUIT_GAME,
} from './game.types';
import { GameState } from './game.reducer';

export const setGameStateChange = (gameState: GameState) => ({
  type: GAME_STATE_CHANGE,
  payload: gameState,
});

export const setGameLoaded = (gameState: GameState) => ({
  type: GAME_LOADED,
  payload: gameState,
});

export const setLobbyId = (lobbyId: string) => ({
  type: SET_LOBBY_ID,
  payload: lobbyId,
});

export const setPlayerId = (playerId: number) => ({
  type: SET_PLAYER_ID,
  payload: playerId,
});

export const quitGame = () => ({
  type: QUIT_GAME,
});
