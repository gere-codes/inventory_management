import { createAsyncThunk, type AsyncThunk } from '@reduxjs/toolkit';
import type { IBaseService } from './base.service';
import { isAxiosError } from 'axios';
import type { ICollectionResult, PaginatedResult } from '../types';
import type { TBaseQuery } from '../schema';

export abstract class BaseThunks<
	T,
	TCreate,
	TUpdate,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TService extends IBaseService<T, TCreate, TUpdate, TCreateBody, TUpdateBody> = IBaseService<
		T,
		TCreate,
		TUpdate,
		TCreateBody,
		TUpdateBody
	>,
	TQuery extends TBaseQuery = TBaseQuery,
> {
	public getAll: AsyncThunk<T[], void, {}>;
	public getById: AsyncThunk<T, string, {}>;
	public create: AsyncThunk<T, TCreateBody, {}>;
	public update: AsyncThunk<T, { id: string; body: TUpdateBody }, {}>;
	public delete: AsyncThunk<T, string, {}>;
	public paginate: AsyncThunk<PaginatedResult<T>, { page: number; limit: number }, {}>;
	public search: AsyncThunk<PaginatedResult<T>, { term: string; page: number; limit: number }, {}>;
	public getCollection: AsyncThunk<ICollectionResult<T>, TQuery, {}>;

	constructor(
		protected resource: string,
		protected service: TService,
	) {
		this.resource = resource;
		this.service = service;

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

		this.create = createAsyncThunk<T, TCreateBody>(`${resource}/create`, async (body, { rejectWithValue }) => {
			try {
				return await service.create(body);
			} catch (error) {
				return rejectWithValue(this.handleError(error, `Error occurred while adding an item to ${resource}`));
			}
		});
		this.update = createAsyncThunk<T, { id: string; body: TUpdateBody }>(
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

		this.getCollection = createAsyncThunk<ICollectionResult<T>, TQuery>(
			`${resource}/`,
			async (params, { rejectWithValue }) => {
				try {
					return await service.getCollection(params);
				} catch (error) {
					return rejectWithValue(this.handleError(error, `Error occurred while fetching ${resource}s`));
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
