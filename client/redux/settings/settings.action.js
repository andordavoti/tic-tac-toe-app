import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types'

export const setCurrentTheme = theme => {
    return {
        type: SET_THEME,
        payload: theme
    }
}

export const useSystemTheme = systemTheme => {
    return {
        type: USE_SYSTEM_THEME,
        payload: systemTheme
    }
}

export const useHaptics = hapticsEnabled => {
    return {
        type: USE_HAPTICS,
        payload: hapticsEnabled
    }
}