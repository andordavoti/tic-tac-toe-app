import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const selectSettingsState = (state: AppState) => state.settings;

export const selectSettings = createSelector(
    [selectSettingsState],
    settings => settings
);

export const selectHaptics = createSelector(
    [selectSettingsState],
    settings => settings.hapticsEnabled
);
export const selectTheme = createSelector(
    [selectSettingsState],
    settings => settings.theme
);
export const selectSystemTheme = createSelector(
    [selectSettingsState],
    settings => settings.systemThemeEnabled
);
