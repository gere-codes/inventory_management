import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TLoginFormData, TRegisterFormData } from '@auth/auth.schema';
import { authServices } from '@auth/auth.service';
import { isAxiosError } from 'axios';
import type { TUser } from '@/shared/schema';

const register = createAsyncThunk<TUser, TRegisterFormData, { rejectValue: string }>(
	'auth/register',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authServices.register(credentials);
			return response.data.user;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response?.data || 'Register failed');
			} else {
				return rejectWithValue('Unknown error occurred while registering');
			}
		}
	},
);

const login = createAsyncThunk<TUser, TLoginFormData, { rejectValue: string }>(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authServices.login(credentials);
			return response?.data?.user;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data || 'Login failed');
			} else {
				return rejectWithValue('Unknown erro occurred while logging in');
			}
		}
	},
);

const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		await authServices.logout();
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data || 'Logout');
		} else {
			return rejectWithValue('Unknown erro occurred while logging out');
		}
	}
});

export const authThunk = {
	register,
	login,
	logout,
};
