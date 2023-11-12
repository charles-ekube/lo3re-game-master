import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/Index';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web




const persistConfig = {
    key: 'root',
    storage,
    // blacklist: ['root']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, compose(applyMiddleware(thunk)),)
export const persistor = persistStore(store)