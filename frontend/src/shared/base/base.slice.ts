import {
	createSlice,
	type PayloadAction,
	type ValidateSliceCaseReducers,
	type CaseReducer,
	type SliceCaseReducers,
} from '@reduxjs/toolkit';
import type { BaseThunks } from './base.thunks';
import type { PaginatedResult } from '../types';
import { castDraft } from 'immer';

interface Pagination {
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	totalItems: number;
}
export interface BaseState<T> {
	items: T[];
	item: T | null;
	loading: boolean;
	error: string | null;
	pagination: Pagination;
}

export const baseSlice = <
	T extends { id: string | number },
	TCreate extends object,
	TUpdate extends object,
	Reducers extends SliceCaseReducers<BaseState<T>>,
>(
	name: string,
	thunks: BaseThunks<T, TCreate, TUpdate>,
	extraReducers: Reducers,
) => {
	const initialState: BaseState<T> = {
		items: [],
		item: null,
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

				// Get all
				.addCase(thunks.getAll.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.getAll.fulfilled, (state, action: PayloadAction<T[]>) => {
					state.loading = false;
					state.error = null;
					state.items = castDraft(action.payload);
				})
				.addCase(thunks.getAll.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})

				// Get by Id
				.addCase(thunks.getById.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.getById.fulfilled, (state, action: PayloadAction<T>) => {
					state.loading = false;
					state.error = null;
					state.item = action.payload as typeof state.item;
				})
				.addCase(thunks.getById.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})

				// create
				.addCase(thunks.create.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.create.fulfilled, (state, action: PayloadAction<T>) => {
					state.loading = false;
					state.error = null;
					const item = castDraft(action.payload);
					state.items.unshift(item);
					state.pagination.totalItems += 1;
				})
				.addCase(thunks.create.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})
				// update
				.addCase(thunks.update.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(thunks.update.fulfilled, (state, action: PayloadAction<T>) => {
					state.loading = false;
					state.error = null;
					const item = castDraft(action.payload);
					const itemIndex = state.items.findIndex((i) => i.id === item.id);

					if (itemIndex !== -1) {
						state.items[itemIndex] = item;
					}
				})
				.addCase(thunks.update.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})

				// delete
				.addCase(thunks.delete.pending, (state) => {
					state.loading = true;
				})
				.addCase(thunks.delete.fulfilled, (state, action: PayloadAction<T>) => {
					state.loading = false;
					const itemIndex = state.items.findIndex((i) => i.id === action.payload.id);
					if (itemIndex !== -1) {
						state.items.splice(itemIndex, 1);
						state.pagination.totalItems -= 1;
					}
				})
				.addCase(thunks.delete.rejected, (state, action) => {
					state.loading = false;
					state.error = (action.payload as string) || 'An error occurred';
				})

				// Get paginated
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
