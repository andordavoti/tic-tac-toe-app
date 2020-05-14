import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import logger from 'redux-logger';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';
import createSentryMiddleware from 'redux-sentry-middleware';
import * as Sentry from 'sentry-expo';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['settings'],
};

const middlewares: any[] = [];
middlewares.push(createSentryMiddleware(Sentry as any));
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
