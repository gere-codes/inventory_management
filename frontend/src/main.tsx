import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { privateInstance, refreshClient } from '@api';
import { authThunk, authServices } from '@auth';
import { store, persistor } from '@store';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</BrowserRouter>
	</StrictMode>,
);

privateInstance.interceptors.request.use(
	async (config) => {
		const token = await authServices.getFreshToken(refreshClient);

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// res interceptor
privateInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newToken = await authServices.getFreshToken(refreshClient);

				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return privateInstance(originalRequest);
			} catch (refreshError) {
				store.dispatch(authThunk.logout());
				authServices.setAccessToken('');
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
