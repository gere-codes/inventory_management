import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { authSlice } from '@auth';
import { productSlice } from '@products';
import { categorySlice } from '@categories';
import { supplierSlice } from '@suppliers';
import { modalSlice } from '@common';

const persistConfig = {
	key: 'root',
	storage,
	version: 1,
};

const rootReducer = combineReducers({
	auth: authSlice.reducer,
	product: productSlice.reducer,
	category: categorySlice.reducer,
	supplier: supplierSlice.reducer,
	modal: modalSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
