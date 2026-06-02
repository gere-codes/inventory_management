import { privateInstance } from '../api/instance.api';
import type { TBaseQuery } from '../schema';
import type { ICollectionResult, IParams, PaginatedResult } from '../types';
import z from 'zod';

export interface IBaseService<
	T,
	TCreate,
	TUpdate,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TQuery extends TBaseQuery = TBaseQuery,
> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(data: TCreateBody): Promise<T>;
	update(id: string, data: TUpdateBody): Promise<T>;
	delete(id: string): Promise<T>;
	paginate(page: number, limit: number): Promise<PaginatedResult<T>>;
	search(term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
	getCollection(params?: TQuery): Promise<ICollectionResult<T>>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseService<T, TCreate, TUpdate, TCreateBody, TUpdateBody, TQuery> {
	protected readonly resource: string;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;
	protected paramSchema?: z.ZodSchema<TQuery>;

	constructor(
		resource: string,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
		paramSchema?: z.ZodSchema<TQuery>,
	) {
		this.resource = resource;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
		this.paramSchema = paramSchema;
	}

	protected abstract queryBuilder(params: TQuery): URLSearchParams | null;

	async getAll(): Promise<T[]> {
		const result = await privateInstance.get<{ success: boolean; data: T[] }>(`/${this.resource}`);
		return z.array(this.schema).parse(result.data.data);
	}

	async getById(id: string): Promise<T> {
		const result = await privateInstance.get<{ success: boolean; data: T }>(`/${this.resource}/${id}`);
		return this.schema.parse(result.data.data);
	}

	async create(body: TCreateBody): Promise<T> {
		const result = await privateInstance.post<{ success: boolean; data: T }>(`/${this.resource}`, body);
		return this.schema.parse(result.data.data);
	}

	async update(id: string, body: TUpdateBody): Promise<T> {
		const result = await privateInstance.put<{ success: boolean; data: T }>(`/${this.resource}/${id}`, body);
		return this.schema.parse(result.data.data);
	}

	async delete(id: string): Promise<T> {
		const result = await privateInstance.delete<{ success: boolean; data: T }>(`/${this.resource}/${id}`);
		return this.schema.parse(result.data.data);
	}

	async paginate(page: number, limit: number): Promise<PaginatedResult<T>> {
		const result = await privateInstance.get<{ success: boolean; data: PaginatedResult<T> }>(
			`/${this.resource}/paginate`,
			{
				params: {
					currentPage: page,
					itemsPerPage: limit,
				},
			},
		);

		const data = z.array(this.schema).safeParse(result.data.data.data);

		return {
			data: z.array(this.schema).parse(result.data.data.data),
			pagination: result.data.data.pagination,
		};
	}

	async search(term: string, page: number, limit: number): Promise<PaginatedResult<T>> {
		const result = await privateInstance.get(`/${this.resource}/search`, {
			params: {
				term,
				currentPage: page,
				itemsPerPage: limit,
			},
		});

		return {
			data: z.array(this.schema).parse(result.data.data.data),
			pagination: result.data.data.pagination,
		};
	}

	async getCollection(params: TQuery): Promise<ICollectionResult<T>> {
		const urlParams = new URLSearchParams();

		if (params) {
			urlParams.append('isPaginated', params.isPaginated.toString());

			if (params?.pagination) {
				if (params.pagination.page) urlParams.append('page', String(params.pagination.page));
				if (params.pagination.limit) urlParams.append('limit', String(params.pagination.limit));
				if (params.pagination.offset) urlParams.append('offset', String(params.pagination.offset));
			}

			const additionalQuery = this.queryBuilder(params);

			if (additionalQuery) {
				additionalQuery.forEach((value, key) => {
					urlParams.append(key, value);
				});
			}
		}

		const queryString = urlParams.toString();
		const url = queryString ? `/public/${this.resource}?${queryString}` : `/public/${this.resource}`;

		const response = await privateInstance.get(url);
		const { data, pagination } = response.data.data;

		return {
			data: z.array(this.schema).parse(data),
			pagination: pagination,
		};
	}
}
