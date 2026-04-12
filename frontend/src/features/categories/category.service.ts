import { BaseService } from '@/shared/base';
import {
	categoryCreateSchema,
	categorySchema,
	categoryUpdateSchema,
	type TCategory,
	type TCategoryCreate,
	type TCategoryUpdate,
} from './cateogry.schema';

export class CategoryService extends BaseService<TCategory, TCategoryCreate, TCategoryUpdate> {
	constructor(resource: string) {
		super(resource, categorySchema, categoryCreateSchema, categoryUpdateSchema);
	}
}

export const cateogryService = new CategoryService('category');
