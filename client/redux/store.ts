import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import settingsReducer from './settingsSlice';

const rootReducer = combineReducers({
    game: gameReducer,
    settings: settingsReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['settings'],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        __DEV__
            ? getDefaultMiddleware({
                  serializableCheck: false,
              }).concat(logger)
            : getDefaultMiddleware({
                  serializableCheck: false,
              }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
