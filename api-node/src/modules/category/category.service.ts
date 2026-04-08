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

interface ICategoryService extends IBaseService<TCategory, TCategoryCreate, TCategoryUpdate> {}

export class CategoryService
	extends BaseService<TCategory, TCategoryCreate, TCategoryUpdate>
	implements ICategoryService
{
	constructor(repository: IBaseRepository<TCategory, TCategoryCreate, TCategoryUpdate>) {
		super(repository, categorySchema, categoryCreateSchema, categoryUpdateSchema);
	}
}
