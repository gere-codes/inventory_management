import type { IBaseRepository } from './base.repository.js';
import z from 'zod';
import type { PaginatedResult } from '../types/general.js';

export interface IBaseService<T, TCreate, TUpdate> {
	getAll(userId: string): Promise<T[]>;
	getById(userId: string, id: string): Promise<T>;
	create(userId: string, data: TCreate): Promise<T>;
	update(userId: string, id: string, data: TUpdate): Promise<T>;
	delete(userId: string, id: string): Promise<T>;
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

	async create(userId: string, data: TCreate): Promise<T> {
		const result = await this.repository.create(userId, data);

		return this.schema.parse(this.format(result));
	}

	async update(id: string, userId: string, data: TUpdate): Promise<T> {
		const result = await this.repository.update(id, userId, data);
		return this.schema.parse(this.format(result));
	}

	async delete(userId: string, id: string): Promise<T> {
		const deletedItem = await this.repository.delete(userId, id);

		return this.schema.parse(this.format(deletedItem));
	}

	async paginate(userId: string, page: number, limit: number): Promise<PaginatedResult<T>> {
		const { data, pagination } = await this.repository.paginate(userId, page, limit);
		const formattedData = data.map((item) => this.format(item));
		const responseData = z.array(this.schema).parse(formattedData);

		return {
			data: responseData,
			pagination,
		};
	}
}
