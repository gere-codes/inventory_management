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
	public update: AsyncThunk<T, { id: string; body: TUpdate }, {}>;
	public delete: AsyncThunk<T, string, {}>;
	public paginate: AsyncThunk<PaginatedResult<T>, { page: number; limit: number }, {}>;
	public search: AsyncThunk<PaginatedResult<T>, { term: string; page: number; limit: number }, {}>;

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
					this.handleError(error, `Error occurred while fetching  an item id ${id} of type ${resource}`),
				);
			}
		});

		this.create = createAsyncThunk<T, TCreate>(`${resource}/create`, async (body, { rejectWithValue }) => {
			try {
				return await service.create(body);
			} catch (error) {
				return rejectWithValue(this.handleError(error, `Error occurred while adding an item to ${resource}`));
			}
		});
		this.update = createAsyncThunk<T, { id: string; body: TUpdate }>(
			`${resource}/update`,
			async ({ id, body }, { rejectWithValue }) => {
				try {
					return await service.update(id, body);
				} catch (error) {
					return rejectWithValue(
						this.handleError(error, `Error occurred while updating an item id ${id} of ${resource}`),
					);
				}
			},
		);

		this.delete = createAsyncThunk<T, string>(`${resource}/delete`, async (id, { rejectWithValue }) => {
			try {
				return await service.delete(id);
			} catch (error) {
				return rejectWithValue(
					this.handleError(error, `Error occurred while deleting an item id ${id} of ${resource}`),
				);
			}
		});

		this.search = createAsyncThunk<PaginatedResult<T>, { term: string; page: number; limit: number }>(
			`${resource}/search`,
			async ({ term, page, limit }, { rejectWithValue }) => {
				try {
					return await service.search(term, page, limit);
				} catch (error) {
					return rejectWithValue(this.handleError(error, `Error occurred while serarching for ${resource}`));
				}
			},
		);

		this.paginate = createAsyncThunk<PaginatedResult<T>, { page: number; limit: number }>(
			`${resource}/paginate`,
			async ({ page, limit }, { rejectWithValue }) => {
				try {
					return await service.paginate(page, limit);
				} catch (error) {
					return rejectWithValue(this.handleError(error, `Error occurred while paginating ${resource}`));
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
