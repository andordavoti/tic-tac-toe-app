import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types'

export const setCurrentTheme = theme => ({
    type: SET_THEME,
    payload: theme
})

export const useSystemTheme = systemTheme => ({
    type: USE_SYSTEM_THEME,
    payload: systemTheme
})

export const useHaptics = hapticsEnabled => ({
    type: USE_HAPTICS,
    payload: hapticsEnabled
})