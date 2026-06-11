import {
	createSlice,
	type PayloadAction,
	type ValidateSliceCaseReducers,
	type CaseReducer,
	type SliceCaseReducers,
	type ActionReducerMapBuilder,
	type Reducer,
} from '@reduxjs/toolkit';
import type { BaseThunks } from './base.thunks';
import type { ICollectionResult, IPagination, PaginatedResult } from '../types';
import { castDraft } from 'immer';

export type BaseState<T, TExtra = {}> = {
	list: {
		data: T[];
		status: 'idle' | 'loading' | 'succeeded' | 'failed';
		error: string | null;
	};
	item: {
		data: T | null;
		status: 'idle' | 'loading' | 'succeeded' | 'failed';
		error: string | null;
	};

	pagination: IPagination;
} & TExtra;

export const baseSlice = <
	T extends { id: string },
	TState extends BaseState<T>,
	TCreate extends object,
	TUpdate extends object,
	CustomeReducers extends SliceCaseReducers<BaseState<T>>,
>(
	name: string,
	thunks: BaseThunks<T, TCreate, TUpdate, any, any, any>,
	initialState: TState,
	customeReducers?: CustomeReducers,
	customExtraReducers?: (builder: ActionReducerMapBuilder<TState>) => void,
) => {
	return createSlice({
		name,
		initialState,
		reducers: {
			resetListError: (state) => {
				state.list.error = null;
			},
			setCurrentPage: (state, action) => {
				state.pagination.page = action.payload;
			},
			setItemsPerPage: (state, action) => {
				state.pagination.limit = action.payload;
			},
			...customeReducers,
		},
		extraReducers: (builder) => {
			builder

				// Get all
				.addCase(thunks.getAll.pending, (state) => {
					state.list.status = 'loading';
					state.list.error = null;
				})
				.addCase(thunks.getAll.fulfilled, (state, action: PayloadAction<T[]>) => {
					state.list.status = 'succeeded';
					state.list.error = null;
					state.list.data = castDraft(action.payload);
				})
				.addCase(thunks.getAll.rejected, (state, action) => {
					state.list.status = 'failed';
					state.list.error = (action.payload as string) || 'An error occurred';
				})

				// Get by Id
				.addCase(thunks.getById.pending, (state) => {
					state.item.status = 'loading';
					state.item.error = null;
				})
				.addCase(thunks.getById.fulfilled, (state, action: PayloadAction<T>) => {
					state.item.status = 'succeeded';
					state.item.error = null;
					state.item.data = action.payload as typeof state.item.data;
				})
				.addCase(thunks.getById.rejected, (state, action) => {
					state.item.status = 'failed';
					state.item.error = (action.payload as string) || 'An error occurred';
				})

				// create
				.addCase(thunks.create.pending, (state) => {
					state.list.status = 'loading';
					state.list.error = null;
				})
				.addCase(thunks.create.fulfilled, (state, action: PayloadAction<T>) => {
					state.list.status = 'succeeded';
					state.list.error = null;
					const item = castDraft(action.payload);
					// state.list.data.unshift(item);
					// state.pagination.totalItems += 1;
				})
				.addCase(thunks.create.rejected, (state, action) => {
					state.list.status = 'failed';
					state.list.error = (action.payload as string) || 'An error occurred';
				})
				// update
				.addCase(thunks.update.pending, (state) => {
					state.list.status = 'loading';
					state.list.error = null;
				})
				.addCase(thunks.update.fulfilled, (state, action: PayloadAction<T>) => {
					state.list.status = 'succeeded';
					state.list.error = null;
					const item = castDraft(action.payload);
					const itemIndex = state.list.data.findIndex((i) => i.id === item.id);

					if (itemIndex !== -1) {
						state.list.data[itemIndex] = item;
					}
				})
				.addCase(thunks.update.rejected, (state, action) => {
					state.list.status = 'failed';
					state.list.error = (action.payload as string) || 'An error occurred';
				})

				// delete
				.addCase(thunks.delete.pending, (state) => {
					state.list.status = 'loading';
				})
				.addCase(thunks.delete.fulfilled, (state, action: PayloadAction<T>) => {
					state.list.status = 'succeeded';
					const itemIndex = state.list.data.findIndex((i) => i.id === action.payload.id);
					if (itemIndex !== -1) {
						state.list.data.splice(itemIndex, 1);
						state.pagination.totalItems -= 1;
					}
				})
				.addCase(thunks.delete.rejected, (state, action) => {
					state.list.status = 'failed';
					state.list.error = (action.payload as string) || 'An error occurred';
				})

				// Get Collection
				.addCase(thunks.getCollection.pending, (state) => {
					state.list.status = 'loading';
					state.list.error = null;
				})
				.addCase(thunks.getCollection.fulfilled, (state, action: PayloadAction<ICollectionResult<T>>) => {
					state.list.status = 'succeeded';
					state.list.error = null;
					state.list.data = castDraft(action.payload.data);
					state.pagination = action.payload.pagination as typeof state.pagination;
				})
				.addCase(thunks.getCollection.rejected, (state, action) => {
					state.list.status = 'failed';
					state.list.error = (action.payload as string) || 'An error occurred';
				});

			if (customExtraReducers) {
				customExtraReducers(builder);
			}
		},
	});
};
