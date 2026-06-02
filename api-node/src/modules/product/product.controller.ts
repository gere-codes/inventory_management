import type { Request, Response, NextFunction } from 'express';
import { BaseController, type IBaseController } from '@core/base/base.controller.js';
import { ProductService, type IProductService } from './product.service.js';
import { productQuerySchema, type TProduct, type TProductCreate, type TProductUpdate } from './product.shema.js';
import { ProductRepository } from './product.repository.js';
import { db } from '@src/db/index.js';
import { LocalFileService } from '@services';
import { catchAsync } from '@src/core/utils/catch-async.util.js';
export interface IProductController extends IBaseController<TProduct, TProductCreate, TProductUpdate> {
	getStats(req: Request, res: Response, next: NextFunction): void;
	updateQuantity(req: Request, res: Response, next: NextFunction): void;
}
class ProductController extends BaseController<TProduct, TProductCreate, TProductUpdate, IProductService> {
	constructor() {
		const productRepository = new ProductRepository(db);
		const productService = new ProductService(productRepository);

		const fileService = new LocalFileService();
		super(productService, productQuerySchema, fileService);
	}

	getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user.id;
		const result = await this.service.getStats(userId);
		res.status(200).json({
			success: true,
			data: result,
		});
	});

	updateQuantity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user.id;
		const quantity = Number(req.body?.quantity);
		const productId = req.params?.id as string;

		const result = await this.service.updateQuantity({ userId, productId, quantity });

		res.status(200).json({
			success: true,
			data: result,
		});
	});
}

export const productController = new ProductController();
