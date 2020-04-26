import { createSelector } from 'reselect';

const selectSettingsState = state => state.settings;

export const selectSettings = createSelector([selectSettingsState], settings => settings);

export const selectHaptics = createSelector([selectSettingsState], settings => settings.hapticsEnabled);