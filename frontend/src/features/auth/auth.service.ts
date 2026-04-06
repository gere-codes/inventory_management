import { publicInstance } from '@api/instance.api';
import type { TLoginFormData, TRegisterFormData } from './auth.schema';
import type { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

const login = async (credentials: TLoginFormData) => {
	return await publicInstance.post('/auth/login', credentials);
};

const register = async (credentials: TRegisterFormData) => {
	return await publicInstance.post('/auth/register', credentials);
};

const logout = async (): Promise<AxiosResponse> => {
	setAccessToken('');

	return await publicInstance.post('/auth/logout');
};

let accessToken: string | null = null;
let accessTokenExp: number | null = null;
let refreshPromise: Promise<string> | null = null;

const setAccessToken = (token: string) => {
	if (!token) {
		accessTokenExp = 0;
		return;
	}
	accessToken = token;
	const { exp } = jwtDecode<{ exp: number }>(token);
	accessTokenExp = exp;
};

const getAccessToken = () => {
	return accessToken;
};

const isTokenValid = () => {
	if (!accessToken || !accessTokenExp) return false;
	return accessTokenExp * 1000 > Date.now();
};

const getFreshToken = async (refreshClient: any) => {
	if (isTokenValid()) return accessToken!;

	if (!refreshPromise) {
		refreshPromise = refreshClient
			.post('/auth/refresh')
			.then((res: any) => {
				setAccessToken(res.data.accessToken);
				return res.data.accessToken;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
};

export const authServices = {
	login,
	register,
	logout,
	getFreshToken,
	setAccessToken,
	isTokenValid,
	getAccessToken,
};
