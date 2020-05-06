import { createSelector } from 'reselect';

interface State {
    settings: {
        hapticsEnabled: boolean
        theme: 'light' | 'dark'
        systemThemeEnabled: boolean
    }
}

const selectSettingsState = (state: State) => state.settings;

export const selectSettings = createSelector([selectSettingsState], settings => settings);

export const selectHaptics = createSelector([selectSettingsState], settings => settings.hapticsEnabled);
export const selectTheme = createSelector([selectSettingsState], settings => settings.theme);
export const selectSystemTheme = createSelector([selectSettingsState], settings => settings.systemThemeEnabled);