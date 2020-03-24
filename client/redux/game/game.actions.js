import { GAME_STATE_CHANGE, GAME_LOADED, SET_PLAYER_ID, SET_LOBBY_ID } from './game.types';

export const setGameStateChange = gameState => ({
  type: GAME_STATE_CHANGE,
  payload: gameState,
});

export const setGameLoaded = gameState => ({
  type: GAME_LOADED,
  payload: gameState,
});

export const setLobbyId = lobbyId => ({
  type: SET_LOBBY_ID,
  payload: lobbyId,
});

export const setPlayerId = playerId => ({
  type: SET_PLAYER_ID,
  payload: playerId,
});
