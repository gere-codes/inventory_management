import type { IBaseRepository } from './base.repository.js';
import z from 'zod';
import type { ICollectionResult, IQueryOptions, PaginatedResult, QueryOptions } from '../types/general.js';
import { baseQuerySchema, type TBaseQuery, type TContext } from '../schema/general.schema.js';
import { AppError } from '../utils/app-error.util.js';

export interface IBaseService<T, TCreate, TUpdate, TQuery extends TBaseQuery = TBaseQuery> {
	getAll(userId: string): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(userId: string, data: TCreate): Promise<T>;
	update(userId: string, id: string, data: TUpdate): Promise<T>;
	delete(userId: string, id: string): Promise<T>;
	getCollection(context: TContext, options?: TQuery): Promise<ICollectionResult<T> | T[]>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TRepository extends IBaseRepository<T, TCreate, TUpdate> = IBaseRepository<T, TCreate, TUpdate>,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseService<T, TCreate, TUpdate, TQuery> {
	protected repository: TRepository;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;

	constructor(
		repository: TRepository,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
	) {
		this.repository = repository;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
	}

	async getAll(userId: string): Promise<T[]> {
		const result = await this.repository.getAll(userId);
		return z.array(this.schema).parse(result);
	}

	async getById(id: string): Promise<T> {
		const result = await this.repository.findOne(id);
		return this.schema.parse(result);
	}

	async create(userId: string, data: TCreate): Promise<T> {
		const parsedData = await this.createSchema.parseAsync(data);

		const fullPayload = { ...parsedData, userId };

		const id = await this.repository.create(fullPayload);

		const item = await this.repository.findOne(id);

		return this.schema.parse(item);
	}

	async update(userId: string, id: string, data: TUpdate): Promise<T> {
		const parsedData = await this.updateSchema.parseAsync(data);

		const item = await this.repository.findById(id);

		if (!item) throw new Error('Item not found');

		if (item.userId !== userId) throw new AppError(401, 'Unauthorized');

		await this.repository.update(id, parsedData);

		const updatedItem = await this.repository.findOne(id);

		return this.schema.parse(updatedItem);
	}

	async delete(userId: string, id: string): Promise<T> {
		const item = await this.repository.findById(id);
		if (item.userId !== userId) throw new AppError(401, 'Unauthorized');

		const deletedItem = await this.repository.findOne(id);
		await this.repository.delete(id);

		return this.schema.parse(deletedItem);
	}

	async getCollection(context: TContext, options: TQuery): Promise<ICollectionResult<T> | T[]> {
		if (Boolean(options.isPaginated) === false) {
			const response = await this.repository.findAll(context, options);
			return z.array(this.schema).parse(response);
		}

		const { data, pagination } = await this.repository.findManyAndCount(context, options);

		return {
			data: z.array(this.schema).parse(data),
			pagination: { ...pagination },
		};
	}
}
