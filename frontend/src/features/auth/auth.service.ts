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
	return await publicInstance.post('/auth/logout');
};
