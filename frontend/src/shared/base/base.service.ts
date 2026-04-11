import { privateInstance } from '../api/instance.api';
import type { PaginatedResult } from '../types';
import z from 'zod';

export interface IBaseService<T, TCreate, TUpdate> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(data: TCreate): Promise<T>;
	update(id: string, data: TUpdate): Promise<T>;
	delete(id: string): Promise<T>;
	paginate(page: number, limit: number): Promise<PaginatedResult<T>>;
	search(term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
}
export abstract class BaseService<T, TCreate, TUpdate> implements IBaseService<T, TCreate, TUpdate> {
	protected readonly resource: string;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;

	constructor(
		resource: string,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
	) {
		this.resource = resource;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
	}
	async getAll(): Promise<T[]> {
		const result = await privateInstance.get<{ success: boolean; data: T[] }>(`/${this.resource}`);
		return z.array(this.schema).parse(result.data.data);
	}

	async getById(id: string): Promise<T> {
		const result = await privateInstance.get<{ success: boolean; data: T }>(`/${this.resource}/${id}`);
		return this.schema.parse(result.data.data);
	}

	async create(body: TCreate): Promise<T> {
		const result = await privateInstance.post<{ success: boolean; data: T }>(`/${this.resource}`, body);
		return this.schema.parse(result.data.data);
	}

	async update(id: string, body: TUpdate): Promise<T> {
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
}
