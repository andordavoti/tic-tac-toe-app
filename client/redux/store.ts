import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import logger from 'redux-logger';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['settings'],
};

const middlewares: any[] = [];
if (process.env.NODE_ENV === 'development') middlewares.push(logger);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(
        persistedReducer,
        applyMiddleware(...middlewares)
    );
    const persistor = persistStore(store);
    return { store, persistor };
};
