import { privateInstance, publicInstance } from '../api/instance.api';
import { paginationSchema, type TBaseQuery } from '../schema';
import type { ICollectionResult, IParams, PaginatedResult } from '../types';
import z from 'zod';

export interface IBaseService<
	T,
	TCreate,
	TUpdate,
	TStats,
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
	getStats(): Promise<TStats>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TStats,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseService<T, TCreate, TUpdate, TStats, TCreateBody, TUpdateBody, TQuery> {
	protected readonly resource: string;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;
	protected paramSchema?: z.ZodSchema<TQuery>;
	protected statsSchema: z.ZodSchema<TStats>;

	constructor(
		resource: string,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
		statsSchema: z.ZodSchema<TStats>,
		paramSchema?: z.ZodSchema<TQuery>,
	) {
		this.resource = resource;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
		this.paramSchema = paramSchema;
		this.statsSchema = statsSchema;
	}

	queryBuilder(params: TQuery): Record<string, any> {
		const query: Record<string, any> = {};

		if (!params) return query;

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				query[key] = value;
			}
		});

		return this.paramSchema?.parse(params) || {};
	}

	async getAll(): Promise<T[]> {
		const result = await privateInstance.get<{ success: boolean; payload: T[] }>(`/${this.resource}`);
		return z.array(this.schema).parse(result.data.payload);
	}

	async getById(id: string): Promise<T> {
		const result = await privateInstance.get<{ success: boolean; payload: T }>(`/${this.resource}/${id}`);
		return this.schema.parse(result.data.payload);
	}

	async create(body: TCreateBody): Promise<T> {
		const result = await privateInstance.post<{ success: boolean; payload: T }>(`/${this.resource}`, body);
		return this.schema.parse(result.data.payload);
	}

	async update(id: string, body: TUpdateBody): Promise<T> {
		const result = await privateInstance.put<{ success: boolean; payload: T }>(`/${this.resource}/${id}`, body);
		return this.schema.parse(result.data.payload);
	}

	async delete(id: string): Promise<T> {
		const result = await privateInstance.delete<{ success: boolean; payload: T }>(`/${this.resource}/${id}`);
		return this.schema.parse(result.data.payload);
	}

	async getCollection(params: TQuery): Promise<ICollectionResult<T>> {
		const queries = this.queryBuilder(params);

		const response = await publicInstance.get(`/public/${this.resource}`, { params: queries });
		const { items, pagination } = response.data.payload;

		return {
			items: z.array(this.schema).parse(items),
			pagination: paginationSchema.parse(pagination),
		};
	}

	async getStats(): Promise<TStats> {
		const response = await privateInstance.get(`/${this.resource}/stats`);
		return this.statsSchema.parse(response.data.payload);
	}
}
