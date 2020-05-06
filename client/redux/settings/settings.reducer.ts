import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types'

interface Action {
    type: string
    payload: boolean | 'light' | 'dark'
}

const INITIAL_STATE = {
    theme: 'light',
    systemThemeEnabled: true,
    hapticsEnabled: true,
}

const settingsReducer = (state = INITIAL_STATE, action: Action) => {
    switch (action.type) {
        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        case USE_SYSTEM_THEME:
            return {
                ...state,
                systemThemeEnabled: action.payload
            }
        case USE_HAPTICS:
            return {
                ...state,
                hapticsEnabled: action.payload
            }
        default:
            return state
    }
}

export default settingsReducer