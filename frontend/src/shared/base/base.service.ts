import { privateInstance } from '../api/instance.api';
import type { ICollectionResult, IParams, PaginatedResult } from '../types';
import z from 'zod';

export interface IBaseService<
	T,
	TCreate,
	TUpdate,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TParams extends IParams = IParams,
> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T>;
	create(data: TCreateBody): Promise<T>;
	update(id: string, data: TUpdateBody): Promise<T>;
	delete(id: string): Promise<T>;
	paginate(page: number, limit: number): Promise<PaginatedResult<T>>;
	search(term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
	getCollection(params?: TParams): Promise<ICollectionResult<T>>;
}
export abstract class BaseService<
	T,
	TCreate,
	TUpdate,
	TCreateBody = TCreate,
	TUpdateBody = TUpdate,
	TParams extends IParams = IParams,
> implements IBaseService<T, TCreate, TUpdate, TCreateBody, TUpdateBody, TParams> {
	protected readonly resource: string;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate>;
	protected paramSchema?: z.ZodSchema<TParams>;

	constructor(
		resource: string,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate>,
		paramSchema?: z.ZodSchema<TParams>,
	) {
		this.resource = resource;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
		this.paramSchema = paramSchema;
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

		const data = z.array(this.schema).safeParse(result.data.data.data);

		console.log(data.error);

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

	async getCollection(params?: TParams): Promise<ICollectionResult<T>> {
		const urlPrams = new URLSearchParams();

		if (params) {
			if (params?.pagination) {
				urlPrams.append('page', params.pagination.page.toString());
				urlPrams.append('limit', params.pagination.limit.toString());
				urlPrams.append('isPaginated', params.pagination.isPaginated.toString());
			}

			if (params?.search) {
				urlPrams.append('search', params.search);
			}

			if (params?.filter) {
				Object.entries(params.filter).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						if (typeof value === 'object') {
							urlPrams.append(key, JSON.stringify(value));
						} else {
							urlPrams.append(key, String(value));
						}
					}
				});
			}
		}

		const queryString = urlPrams.toString();
		const url = queryString ? `/public/${this.resource}?${queryString}` : `/public/${this.resource}`;

		const response = await privateInstance.get(url);

		return {
			data: z.array(this.schema).parse(response.data.data.data),
			pagination: response.data.data?.pagination,
		};
	}
}
