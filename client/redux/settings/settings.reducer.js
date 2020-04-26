import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS } from './settings.types'

const INITIAL_STATE = {
    theme: 'light',
    systemTheme: true,
    hapticsEnabled: true,
}

const settingsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_THEME:
            console.log('setting theme to: ', action.payload)
            return {
                ...state,
                theme: action.payload
            }
        case USE_SYSTEM_THEME:
            return {
                ...state,
                systemTheme: action.payload
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