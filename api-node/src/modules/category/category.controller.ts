import { BaseController } from '@src/core/base/base.controller.js';
import type { TCategory, TCategoryCreate, TCategoryUpdate } from './category.schema.js';
import { CategoryRepository } from './category.repository.js';
import { db } from '@src/db/index.js';
import { CategoryService } from './category.service.js';

class CategoryController extends BaseController<TCategory, TCategoryCreate, TCategoryUpdate> {
	constructor() {
		const repo = new CategoryRepository(db);
		const service = new CategoryService(repo);
		super(service);
	}
}

export const categoryController = new CategoryController();
