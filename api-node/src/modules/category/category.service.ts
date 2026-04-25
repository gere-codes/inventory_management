import { BaseService, type IBaseService } from '@core/base/base.service.js';
import type { IBaseRepository } from '@src/core/base/base.repository.js';
import {
	categoryCreateSchema,
	categorySchema,
	categoryUpdateSchema,
	type TCategory,
	type TCategoryCreate,
	type TCategoryUpdate,
} from './category.schema.js';
import type { ICategoryRepository } from './category.repository.js';

export interface ICategoryService extends IBaseService<TCategory, TCategoryCreate, TCategoryUpdate> {}

export class CategoryService
	extends BaseService<TCategory, TCategoryCreate, TCategoryUpdate, ICategoryRepository>
	implements ICategoryService
{
	constructor(repository: ICategoryRepository) {
		super(repository, categorySchema, categoryCreateSchema, categoryUpdateSchema);
	}
}
