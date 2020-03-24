import {
  GAME_LOADED,
  GAME_STATE_CHANGE,
  SET_LOBBY_ID,
  SET_PLAYER_ID,
  SET_LOBBY_DATA,
} from './game.types';

const initialState = {
  lobbyId: undefined,
  playerId: undefined,
  fieldTypes: [],
  players: [],
  gameLoaded: false,
};

export const gameReducer = (state = initialState, action) => {
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
