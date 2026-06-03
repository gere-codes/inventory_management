import { privateInstance, publicInstance } from '../api/instance.api';
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

	queryBuilder(params: TQuery): Record<string, any> {
		const query: Record<string, any> = {};

		if (!params) return query;

		if (params.isPaginated !== undefined) {
			query.isPaginated = Boolean(params.isPaginated);
		}

		if (params.pagination) {
			const { page, limit, offset } = params.pagination;
			if (page) query.page = page;
			if (limit) query.limit = limit;
			if (offset) query.offset = offset;
		}

		if (params.filter && typeof params.filter === 'object') {
			Object.entries(params.filter).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					query[key] = value;
				}
			});
		}

		if (params.sort?.field) {
			query.sort = params.sort.field;
			query.order = params.sort.order || 'desc';
		}

		return query;
	}

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

	async getCollection(params: TQuery): Promise<ICollectionResult<T>> {
		const queries = this.queryBuilder(params);

		const response = await publicInstance.get(`/public/${this.resource}`, { params: queries });
		const { data, pagination } = response.data.data;

		return {
			data: z.array(this.schema).parse(data),
			pagination: pagination ?? null,
		};
	}
}
