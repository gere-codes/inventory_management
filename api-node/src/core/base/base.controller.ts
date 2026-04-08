import type { Request, Response, NextFunction } from 'express';
import type { BaseService, IBaseService } from './base.service.js';
import { catchAsync } from '@utils/index.js';

export interface IBaseController<T, TCreate, TUpdate> {
	getAll(req: Request, res: Response, next: NextFunction): void;
	getById(req: Request, res: Response, next: NextFunction): void;
	create(req: Request, res: Response, next: NextFunction): void;
	update(req: Request, res: Response, next: NextFunction): void;
	delete(req: Request, res: Response, next: NextFunction): void;
	paginate(req: Request, res: Response, next: NextFunction): void;
	search(req: Request, res: Response, next: NextFunction): void;
}

export abstract class BaseController<T, TCreate, TUpdate> implements IBaseController<T, TCreate, TUpdate> {
	constructor(protected service: BaseService<T, TCreate, TUpdate>) {}

	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const result = await this.service.getAll(userId);

		res.status(200).json({
			success: true,
			data: result,
		});
	});

	getById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const { id } = req.params;
		const result = await this.service.getById(id as string, userId);

		res.status(200).json({
			success: true,
			data: result,
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const { body } = req;

		const result = await this.service.create(userId, body);

		res.status(201).json({
			success: true,
			data: result,
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const id = req.params?.id as string;
		const { body } = req;

		const result = await this.service.update(userId, id, body);

		res.status(201).json({
			success: true,
			data: result,
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const id = req.params?.id as string;
		const deletedProduct = await this.service.delete(userId, id);

		res.status(200).json({
			success: true,
			data: deletedProduct,
		});
	});

	paginate = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user?.id;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;

		const result = await this.service.paginate(userId, page as number, limit as number);

		res.status(200).json({
			success: true,
			data: result,
		});
	});

	search = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user?.id;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const term = (req.query.term as string) || '';

		const result = await this.service.search(userId, term, limit, page);

		res.status(200).json({
			success: true,
			data: result,
		});
	});
}
