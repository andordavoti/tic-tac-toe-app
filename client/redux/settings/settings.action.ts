import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types';
import { ThemeMode } from '../../types/Theme';

export const setCurrentTheme = (theme: ThemeMode) => ({
  type: SET_THEME,
  payload: theme,
});

export const enableSystemTheme = (systemThemeEnabled: boolean) => ({
  type: USE_SYSTEM_THEME,
  payload: systemThemeEnabled,
});

export const enableHaptics = (hapticsEnabled: boolean) => ({
  type: USE_HAPTICS,
  payload: hapticsEnabled,
});
