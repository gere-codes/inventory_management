import type { Request, Response, NextFunction } from 'express';
import type { BaseService, IBaseService } from './base.service.js';
import { catchAsync } from '@utils/index.js';

export interface IBaseController<T, TCreate, TUpdate> {
	getAll(req: Request, res: Response, next: NextFunction): void;
	getById(req: Request, res: Response, next: NextFunction): void;
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
}
