import type { IBaseRepository } from './base.repository.js';
import z from 'zod';
import type { ICollectionResult, IQueryOptions, PaginatedResult, QueryOptions } from '../types/general.js';
import { baseQuerySchema, type TBaseQuery, type TContext } from '../schema/general.schema.js';

export interface IBaseService<T, TCreate, TUpdate, TQuery extends TBaseQuery = TBaseQuery> {
	getAll(userId: string): Promise<T[]>;
	getById(userId: string, id: string): Promise<T>;
	create(userId: string, data: TCreate): Promise<T>;
	update(userId: string, id: string, data: TUpdate): Promise<T>;
	delete(userId: string, id: string): Promise<T>;
	paginate(userId: string, page: number, limit: number): Promise<PaginatedResult<T>>;
	search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
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

	async getById(id: string, userId: string): Promise<T> {
		const result = await this.repository.getById(id, userId);

		return this.schema.parse(result);
	}

	async create(userId: string, data: TCreate): Promise<T> {
		const parsedData = await this.createSchema.parseAsync(data);

		const result = await this.repository.create(userId, parsedData);

		return this.schema.parse(result);
	}

	async update(id: string, userId: string, data: TUpdate): Promise<T> {
		const parsedData = await this.updateSchema.parseAsync(data);

		const result = await this.repository.update(id, userId, parsedData);

		return this.schema.parse(result);
	}

	async delete(userId: string, id: string): Promise<T> {
		const deletedItem = await this.repository.delete(userId, id);

		return this.schema.parse(deletedItem);
	}

	async paginate(userId: string, page: number, limit: number): Promise<PaginatedResult<T>> {
		const { data, pagination } = await this.repository.paginate(userId, page, limit);
		const responseData = z.array(this.schema).parse(data);

		return {
			data: responseData,
			pagination,
		};
	}

	async search(userId: string, term: string, page: number, limit: number) {
		const { data, pagination } = await this.repository.search(userId, term, page, limit);

		const responseData = z.array(this.schema).parse(data);

		return {
			data: responseData,
			pagination,
		};
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
