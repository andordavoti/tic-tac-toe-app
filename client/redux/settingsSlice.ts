import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from '../types/Theme';
import { useAppSelector } from './hooks';

interface SettingsState {
    theme: ThemeMode;
    systemThemeEnabled: boolean;
    hapticsEnabled: boolean;
}

const initialState: SettingsState = {
    theme: 'light',
    systemThemeEnabled: true,
    hapticsEnabled: true,
};

const namespace = 'settings';

const settingsSlice = createSlice({
    name: namespace,
    initialState,
    reducers: {
        setCurrentTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.theme = action.payload;
        },
        setUseSystemTheme: (state, action: PayloadAction<boolean>) => {
            state.systemThemeEnabled = action.payload;
        },
        toggleHaptics: state => {
            state.hapticsEnabled = !state.hapticsEnabled;
        },
    },
});

export const { setCurrentTheme, setUseSystemTheme, toggleHaptics } =
    settingsSlice.actions;

export const useSelectedTheme = () =>
    useAppSelector(state => state.settings.theme);

export const useSystemThemeEnabled = () =>
    useAppSelector(state => state.settings.systemThemeEnabled);

export const useHapticsEnabled = () =>
    useAppSelector(state => state.settings.hapticsEnabled);

export default settingsSlice.reducer;
