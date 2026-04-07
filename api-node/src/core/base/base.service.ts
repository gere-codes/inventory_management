import type { IBaseRepository } from './base.repository.js';
import z from 'zod';

export interface IBaseService<T, TCreate, TUpdate> {
	getAll(userId: string): Promise<T[]>;
	getById(userId: string, id: string): Promise<T>;
}
export abstract class BaseService<T, TCreate, TUpdate> implements IBaseService<T, TCreate, TUpdate> {
	protected repository: IBaseRepository<T, TCreate, TUpdate>;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate | Partial<T>>;

	constructor(
		repository: IBaseRepository<T, TCreate, TUpdate>,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate | Partial<T>>,
	) {
		this.repository = repository;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
	}

	protected abstract format(record: any): T;

	async getAll(userId: string): Promise<T[]> {
		const result = await this.repository.getAll(userId);

		const formattedResults = result.map((item) => this.format(item));
		return z.array(this.schema).parse(formattedResults);
	}

	async getById(id: string, userId: string): Promise<T> {
		const result = await this.repository.getById(id, userId);

		const formattedRecord = this.format(result);
		return this.schema.parse(formattedRecord);
	}
}
