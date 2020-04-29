import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types'

export const setCurrentTheme = theme => ({
    type: SET_THEME,
    payload: theme
})

export const useSystemTheme = systemThemeEnabled => ({
    type: USE_SYSTEM_THEME,
    payload: systemThemeEnabled
})

export const useHaptics = hapticsEnabled => ({
    type: USE_HAPTICS,
    payload: hapticsEnabled
})