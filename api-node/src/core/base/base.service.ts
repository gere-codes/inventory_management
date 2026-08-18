import type { IBaseRepository } from './base.repository.js';
import type { ICollectionResult } from '../types/general.js';
import type { TBaseQuery, TContext } from '../schema/general.schema.js';
import { serviceError } from '../utils/error.util.js';

export interface IBaseService<T, TCreate, TUpdate, TStats, TQuery extends TBaseQuery = TBaseQuery> {
	getAll(userId: string): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(userId: string, data: TCreate): Promise<T>;
	update(id: string, data: TUpdate, context: TContext): Promise<T>;
	delete(id: string): Promise<T>;
	getCollection(context: TContext, options?: TQuery): Promise<ICollectionResult<T>>;
	getStats(userId: string): Promise<TStats>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TStats,
	TRepository extends IBaseRepository<T, TCreate, TUpdate, TStats> = IBaseRepository<T, TCreate, TUpdate, TStats>,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseService<T, TCreate, TUpdate, TStats, TQuery> {
	protected repository: TRepository;

	constructor(repository: TRepository) {
		this.repository = repository;
	}

	async getAll(userId: string): Promise<T[]> {
		try {
			return await this.repository.getAll(userId);
		} catch (error) {
			return serviceError(error, 'Service Layer: getAll failed', 'Failed to retrive items', { userId });
		}
	}

	async getById(id: string): Promise<T> {
		try {
			return await this.repository.findOne(id);
		} catch (error: any) {
			return serviceError(error, 'Service Layer: getById failed', 'Failed to retrive item', { id });
		}
	}

	async create(userId: string, data: TCreate): Promise<T> {
		try {
			const fullPayload = { ...data, userId };

			const id = await this.repository.create(fullPayload);

			return await this.repository.findOne(id);
		} catch (error) {
			return serviceError(error, 'Service Layer: create failed', 'Failed to create item', { userId, data });
		}
	}

	async update(id: string, data: TUpdate, context: TContext): Promise<T> {
		try {
			const item = await this.repository.findByIdRaw(id);
			await this.repository.update(id, data, context);
			return await this.repository.findOne(id);
		} catch (error) {
			return serviceError(error, 'Service Layer: update failed', 'Failed to update item', { id, data });
		}
	}

	async delete(id: string): Promise<T> {
		try {
			const item = await this.repository.findByIdRaw(id);

			const deletedItem = await this.repository.findOne(id);
			await this.repository.delete(id);

			return deletedItem;
		} catch (error) {
			return serviceError(error, 'Service Layer: delete failed', 'Failed to delete item', { id });
		}
	}

	async getCollection(context: TContext, options: TQuery): Promise<ICollectionResult<T>> {
		try {
			if (Boolean(options.isPaginated) === false) {
				return {
					items: await this.repository.findAll(context, options),
				};
			}

			return await this.repository.findManyAndCount(context, options);
		} catch (error) {
			return serviceError(error, 'Service Layer: getCollection failed', 'Failed to retrieve items', {
				context,
				options,
			});
		}
	}

	async getStats(userId: string) {
		try {
			return await this.repository.getStats(userId);
		} catch (error) {
			return serviceError(error, 'Service Layer: getStats failed', 'Failed to retrieve stats', {});
		}
	}
}
