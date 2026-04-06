import type { TUser } from '@/shared/schema';
import { createSlice } from '@reduxjs/toolkit';
import { authThunk } from '@auth/store/auth.thunks';

export type AuthState = {
	user: TUser;
	isAuthenticated: boolean;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
};

const initialState: AuthState = {
	user: {} as TUser,
	isAuthenticated: false,
	error: null,
	status: 'idle',
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// register
			.addCase(authThunk.register.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.register.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				state.status = 'succeeded';
			})
			.addCase(authThunk.register.rejected, (state, action) => {
				state.isAuthenticated = false;
				state.status = 'failed';
				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Register failed';
				}
			})

			// login
			.addCase(authThunk.login.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.login.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				state.status = 'succeeded';
			})
			.addCase(authThunk.login.rejected, (state, action) => {
				state.status = 'failed';
				state.isAuthenticated = false;
				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Login failed';
				}
			})

			// logout
			.addCase(authThunk.logout.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.logout.fulfilled, (state) => {
				state.status = 'succeeded';
				state.isAuthenticated = false;
				state.user = {} as TUser;
			})
			.addCase(authThunk.logout.rejected, (state, action) => {
				state.status = 'failed';
				state.isAuthenticated = false;
				state.user = {} as TUser;

				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Logout failed';
				}
			});
	},
});
