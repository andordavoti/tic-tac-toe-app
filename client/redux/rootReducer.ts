import { combineReducers } from 'redux';
import gameReducer, { GameState } from './game/game.reducer';
import settingsReducer, { SettingsState } from './settings/settings.reducer';

const rootReducer = combineReducers({
  game: gameReducer,
  settings: settingsReducer,
});

export default rootReducer;

export interface AppState {
  game: GameState;
  settings: SettingsState;
}
