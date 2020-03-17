import { GAME_CONNECTING_START, GAME_CONNECTING_SUCCESS, GAME_WAITING_PLAYERS } from './types';

export const gameConnectionStart = () => ({
  type: GAME_CONNECTING_START,
});

export const gameConnectionSuccess = lobby => ({
  type: GAME_CONNECTING_SUCCESS,
  payload: lobby,
});

export const gameWaitingPlayers = players => ({
  type: GAME_WAITING_PLAYERS,
  payload: players,
});
