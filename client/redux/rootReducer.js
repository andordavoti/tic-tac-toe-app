import { combineReducers } from 'redux';
import gameReducer from './game/game.reducer';
import settingsReducer from './settings/settings.reducer';

const rootReducer = combineReducers({
  game: gameReducer,
  settings: settingsReducer
});

export default rootReducer;
