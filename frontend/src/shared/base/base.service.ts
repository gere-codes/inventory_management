import { privateInstance } from '../api/instance.api';
import type { PaginatedResult } from '../types';
import z from 'zod';

export interface IBaseService<T, TCreate, TUpdate> {
	getAll(): Promise<T[]>;
	getById(id: string | number): Promise<T>;
	create(data: TCreate): Promise<T>;
	update(id: string | number, data: TUpdate): Promise<T>;
	delete(id: string | number): Promise<T>;
	paginate(page: number, limit: number): Promise<PaginatedResult<T>>;
}
export abstract class BaseService<T, TCreate, TUpdate> implements IBaseService<T, TCreate, TUpdate> {
	protected apiUrl: string;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;

	constructor(
		resource: string,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
	) {
		this.apiUrl = resource;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
	}
}
