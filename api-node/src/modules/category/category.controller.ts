import { BaseController } from '@src/core/base/base.controller.js';
import type { TCategory, TCategoryCreate, TCategoryUpdate } from './category.schema.js';
import { CategoryRepository } from './category.repository.js';
import { db } from '@src/db/index.js';
import { CategoryService, type ICategoryService } from './category.service.js';
import { LocalFileService } from '@src/services/storage.service.js';

class CategoryController extends BaseController<TCategory, TCategoryCreate, TCategoryUpdate, ICategoryService> {
	constructor() {
		const repo = new CategoryRepository(db);
		const service = new CategoryService(repo);

		const fileService = new LocalFileService();
		super(service, fileService);
	}
}

export const categoryController = new CategoryController();
