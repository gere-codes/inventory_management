import { BaseService } from '@base';
import {
	categoryCreateSchema,
	categoryQuerySchema,
	categorySchema,
	categoryUpdateSchema,
	type TCategory,
	type TCategoryCreate,
	type TCategoryQuery,
	type TCategoryUpdate,
} from './category.schema';

export class CategoryService extends BaseService<
	TCategory,
	TCategoryCreate,
	TCategoryUpdate,
	FormData,
	FormData,
	TCategoryQuery
> {
	constructor(resource: string) {
		super(resource, categorySchema, categoryCreateSchema, categoryUpdateSchema, categoryQuerySchema);
	}
}

export const cateogryService = new CategoryService('category');
