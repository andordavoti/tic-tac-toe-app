import { GAME_STATE_CHANGE, GAME_LOADED } from './types';

export const gameStateChange = state => ({
  type: GAME_STATE_CHANGE,
  payload: state,
});

export const gameLoaded = state => ({
  type: GAME_LOADED,
  payload: state,
});
