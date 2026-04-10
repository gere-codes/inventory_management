import { createAsyncThunk, type AsyncThunk } from '@reduxjs/toolkit';
import type { IBaseService } from './base.service';
import { isAxiosError } from 'axios';
import type { PaginatedResult } from '../types';

export abstract class BaseThunks<T, TCreate, TUpdate> {
	protected service: IBaseService<T, TCreate, TUpdate>;
	readonly resource: string;
	public getAll: AsyncThunk<T[], void, {}>;
	public getById: AsyncThunk<T, string, {}>;
	public create: AsyncThunk<T, TCreate, {}>;
	public paginate: AsyncThunk<PaginatedResult<T>, { page: number; limit: number }, {}>;

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

		this.getById = createAsyncThunk<T, string>(`${resource}/getById`, async (id, { rejectWithValue }) => {
			try {
				return await service.getById(id);
			} catch (error) {
				return rejectWithValue(
					this.handleError(error, `Error occurred while fetching ${resource} by id ${id}`),
				);
			}
		});

		this.create = createAsyncThunk<T, TCreate>(`${resource}/create`, async (body, { rejectWithValue }) => {
			try {
				return await service.create(body);
			} catch (error) {
				return rejectWithValue(this.handleError(error, `Error occurred while creating ${resource}`));
			}
		});

		this.paginate = createAsyncThunk<PaginatedResult<T>, { page: number; limit: number }>(
			`${resource}/paginate`,
			async ({ page, limit }, { rejectWithValue }) => {
				try {
					return await service.paginate(page, limit);
				} catch (error) {
					return rejectWithValue(
						this.handleError(error, `Error occurred while fetching paginated ${resource}`),
					);
				}
			},
		);
	}

	handleError = (error: any, defaultMessage: string) => {
		if (isAxiosError(error) && error.response) {
			return error.response.data;
		}
		return defaultMessage;
	};
}
