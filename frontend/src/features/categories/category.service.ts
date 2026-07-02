import { BaseService } from '@base';
import {
	categoryCreateSchema,
	categoryQuerySchema,
	categorySchema,
	categoryStatsSchema,
	categoryUpdateSchema,
	type TCategory,
	type TCategoryCreate,
	type TCategoryQuery,
	type TCategoryStats,
	type TCategoryUpdate,
} from './category.schema';

export class CategoryService extends BaseService<
	TCategory,
	TCategoryCreate,
	TCategoryUpdate,
	TCategoryStats,
	FormData,
	FormData,
	TCategoryQuery
> {
	constructor(resource: string) {
		super(
			resource,
			categorySchema,
			categoryCreateSchema,
			categoryUpdateSchema,
			categoryStatsSchema,
			categoryQuerySchema,
		);
	}
}

export const cateogryService = new CategoryService('category');
