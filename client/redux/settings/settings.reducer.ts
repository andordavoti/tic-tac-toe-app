import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types';
import { ThemeMode } from '../../types/Theme';

interface Action {
  type: string;
  payload: boolean | ThemeMode;
}

const INITIAL_STATE = {
  theme: 'light',
  systemThemeEnabled: true,
  hapticsEnabled: true,
};

export type SettingsState = typeof INITIAL_STATE & { theme: ThemeMode };

const settingsReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case USE_SYSTEM_THEME:
      return {
        ...state,
        systemThemeEnabled: action.payload,
      };
    case USE_HAPTICS:
      return {
        ...state,
        hapticsEnabled: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
