import { and, desc, eq, sql, type AnyTable, type ColumnBaseConfig } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { AnyPgTable, PgColumn, PgTable, PgTableWithColumns } from 'drizzle-orm/pg-core';
import z from 'zod';
import { AppError } from '@utils/index.js';
import type { PaginatedResult } from '../types/general.js';

export interface IBaseRepository<T, TCreate, TUpdate> {
	findAll(userId: string): Promise<T[]>;
	findById(userId: string, id: string): Promise<T | null>;
	create(userId: string, data: TCreate): Promise<T | null>;
	update(userId: string, id: string, data: TUpdate): Promise<T>;
	delete(userId: string, id: string): Promise<void>;
	search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
	paginate(userId: string, page?: number, limit?: number): Promise<PaginatedResult<T>>;
}

type AnyUserIdColumn = PgColumn<ColumnBaseConfig<'string', string>>;
type AnyIdColumn = PgColumn<ColumnBaseConfig<'string', string>>;
type AnyCreatedAtColumn = PgColumn<ColumnBaseConfig<'date', string>>;
type TableWithUserId = PgTable<any> & { userId: AnyUserIdColumn; id: AnyIdColumn; createdAt: AnyCreatedAtColumn };

export abstract class BaseRepository<T, TCreate, TUpdate, TTable extends TableWithUserId> implements IBaseRepository<
	T,
	TCreate,
	TUpdate
> {
	protected table: TTable;
	protected schema: z.ZodSchema<T>;
	protected createSchema: z.ZodSchema<TCreate>;
	protected updateSchema: z.ZodSchema<TUpdate | Partial<T>>;
	protected db: NodePgDatabase;

	constructor(
		table: TTable,
		schema: z.ZodSchema<T>,
		createSchema: z.ZodSchema<TCreate>,
		updateSchema: z.ZodSchema<TUpdate | Partial<T>>,
		db: NodePgDatabase,
	) {
		this.table = table;
		this.schema = schema;
		this.createSchema = createSchema;
		this.updateSchema = updateSchema;
		this.db = db;
	}

	protected abstract format(record: any): T;
	public abstract search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<T>>;

	async findAll(userId: string): Promise<T[]> {
		const records = (await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId))) as T[];

		const formattedRecords = records.map((rec) => this.format(rec));
		return z.array(this.schema).parse(formattedRecords);
	}

	async findById(userId: string, id: string): Promise<T | null> {
		const record = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(and(eq(this.table.id, id), eq(this.table.userId, userId)))
			.limit(1);

		if (record.length === 0) return null;

		const formattedRecord = this.format(record[0]);
		return this.schema.parse(formattedRecord);
	}

	async create(userId: string, data: TCreate): Promise<T | null> {
		const values = { ...data, userId };
		const [record] = await this.db
			.insert(this.table as AnyPgTable)
			.values({ values })
			.returning();

		if (!record) throw new AppError(400, 'Item was not created');
		return this.schema.parse(record);
	}

	async update(userId: string, id: string, data: TUpdate): Promise<T> {
		const [record] = await this.db
			.update(this.table as AnyPgTable)
			.set(data as any)
			.where(and(eq(this.table.userId, userId), eq(this.table.id, id)))
			.returning();

		if (!record) throw new AppError(400, 'Item was not updated');
		return this.schema.parse(record);
	}

	async delete(userId: string, id: string): Promise<void> {
		const result = await this.db
			.delete(this.table as AnyPgTable)
			.where(and(eq(this.table.userId, userId), eq(this.table.id, id)))
			.returning();

		if (result.length === 0) {
			throw new AppError(400, 'Item was not found');
		}
	}

	async paginate(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<T>> {
		const offset = (page - 1) * limit;

		const results = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId))
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId));

		const total = countResult[0]?.count ?? 0;
		const parsedResults = results.map((result) => this.schema.parse(result));

		return {
			data: parsedResults,
			pagination: {
				totalItems: total,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				itemsPerPage: limit,
			},
		};
	}
}
