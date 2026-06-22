import type { IBaseRepository } from './base.repository.js';
import type { ICollectionResult } from '../types/general.js';
import type { TBaseQuery, TContext } from '../schema/general.schema.js';
import { AppError } from '../utils/app-error.util.js';

export interface IBaseService<T, TCreate, TUpdate, TQuery extends TBaseQuery = TBaseQuery> {
	getAll(userId: string): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(userId: string, data: TCreate): Promise<T>;
	update(id: string, data: TUpdate): Promise<T>;
	delete(id: string): Promise<T>;
	getCollection(context: TContext, options?: TQuery): Promise<ICollectionResult<T>>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TRepository extends IBaseRepository<T, TCreate, TUpdate> = IBaseRepository<T, TCreate, TUpdate>,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseService<T, TCreate, TUpdate, TQuery> {
	protected repository: TRepository;

	constructor(repository: TRepository) {
		this.repository = repository;
	}

	async getAll(userId: string): Promise<T[]> {
		return await this.repository.getAll(userId);
	}

	async getById(id: string): Promise<T> {
		return await this.repository.findOne(id);
	}

	async create(userId: string, data: TCreate): Promise<T> {
		const fullPayload = { ...data, userId };

		const id = await this.repository.create(fullPayload);

		return await this.repository.findOne(id);
	}

	async update(id: string, data: TUpdate): Promise<T> {
		const item = await this.repository.findByIdRaw(id);
		await this.repository.update(id, data);
		return await this.repository.findOne(id);
	}

	async delete(id: string): Promise<T> {
		const item = await this.repository.findByIdRaw(id);
		if (!item) throw new AppError(404, 'Item not found');

		const deletedItem = await this.repository.findOne(id);
		await this.repository.delete(id);

		return deletedItem;
	}

	async getCollection(context: TContext, options: TQuery): Promise<ICollectionResult<T>> {
		if (Boolean(options.isPaginated) === false) {
			return {
				items: await this.repository.findAll(context, options),
			};
		}

		return await this.repository.findManyAndCount(context, options);
	}
}
