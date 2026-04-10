import {
	createSlice,
	type PayloadAction,
	type ValidateSliceCaseReducers,
	type CaseReducer,
	type SliceCaseReducers,
} from '@reduxjs/toolkit';
import type { BaseThunks } from './base.thunks';
import type { PaginatedResult } from '../types';

interface Pagination {
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	totalItems: number;
}
export interface BaseState<T> {
	items: T[];
	loading: boolean;
	error: string | null;
	pagination: Pagination;
}

export const createBaseSlice = <T, TCreate, TUpdate, Reducers extends SliceCaseReducers<BaseState<T>>>(
	name: string,
	thunks: BaseThunks<T, TCreate, TUpdate>,
	extraReducers: Reducers,
) => {
	const initialState: BaseState<T> = {
		items: [],
		loading: false,
		error: null,
		pagination: {
			currentPage: 1,
			itemsPerPage: 10,
			totalItems: 0,
			totalPages: 1,
		},
	};

	return createSlice({
		name,
		initialState,
		reducers: {
			resetError: (state) => {
				state.error = null;
			},
		},
		extraReducers: (builder) => {
			builder

				.addCase(thunks.getAll.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.getAll.fulfilled, (state, action: PayloadAction<T[]>) => {
					state.loading = false;
					state.error = null;
					state.items = action.payload as typeof state.items;
				})
				.addCase(thunks.getAll.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})

				.addCase(thunks.paginate.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.paginate.fulfilled, (state, action: PayloadAction<PaginatedResult<T>>) => {
					state.loading = false;
					state.error = null;
					state.items = action.payload.data as typeof state.items;
					state.pagination = action.payload.pagination as typeof state.pagination;
				})
				.addCase(thunks.paginate.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				});
		},
	});
};
