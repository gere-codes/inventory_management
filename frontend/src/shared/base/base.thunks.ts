import { createAsyncThunk, type AsyncThunk } from '@reduxjs/toolkit';
import type { IBaseService } from './base.service';
import { isAxiosError } from 'axios';
import type { PaginatedResult } from '../types';

export abstract class BaseThunks<T, TCreate, TUpdate> {
	protected service: IBaseService<T, TCreate, TUpdate>;
	readonly resource: string;
	public getAll: AsyncThunk<T[], void, {}>;
	public paginated: AsyncThunk<PaginatedResult<T>, { page: number; limit: number }, {}>;

	constructor(service: IBaseService<T, TCreate, TUpdate>, resource: string) {
		this.service = service;
		this.resource = resource;

		this.getAll = createAsyncThunk<T[], void>(`${resource}/getAll`, async (_, { rejectWithValue }) => {
			try {
				return await service.getAll();
			} catch (error) {
				return rejectWithValue(this.handleError(error, `Error occurred while fetching ${resource}`));
			}
		});
	}

	handleError = (error: any, defaultMessage: string) => {
		if (isAxiosError(error) && error.response) {
			return error.response.data;
		}
		return defaultMessage;
	};
}
