import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '@core/base/base.controller.js';
import { ProductService } from './product.service.js';
import type { TProduct, TProductCreate, TProductUpdate } from './product.shema.js';
import { ProductRepository } from './product.repository.js';
import { db } from '@src/db/index.js';

class ProductController extends BaseController<TProduct, TProductCreate, TProductUpdate> {
	constructor() {
		const productRepository = new ProductRepository(db);
		const productService = new ProductService(productRepository);
		super(productService);
	}
}
