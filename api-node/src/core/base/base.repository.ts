import type { PaginatedResult } from '@core/types/index.js';
import { eq, type AnyTable, type ColumnBaseConfig } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { AnyPgTable, PgColumn, PgTable, PgTableWithColumns } from 'drizzle-orm/pg-core';
import z from 'zod';

export interface IBaseRepository<T, TCreate, TUpdate> {
	findAll(userId: string): Promise<T[]>;
}

type AnyUserIdColumn = PgColumn<ColumnBaseConfig<'string', string>>;
type TableWithUserId = PgTable<any> & { userId: AnyUserIdColumn };

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

	async findAll(userId: string): Promise<T[]> {
		return (await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId))) as T[];
	}
}
