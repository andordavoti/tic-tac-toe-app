import {
  GAME_LOADED,
  GAME_STATE_CHANGE,
  SET_LOBBY_ID,
  SET_PLAYER_ID,
  QUIT_GAME
} from './game.types';

interface Action {
  type: string
  payload: //TODO: what's the pay load type?
}

const initialState = {
  lobbyId: undefined,
  playerId: undefined,
  xIsNext: 0,
  fieldTypes: [],
  players: [],
  gameLoaded: false,
};

const gameReducer = (state = initialState, action: Action) => {
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

export default gameReducer