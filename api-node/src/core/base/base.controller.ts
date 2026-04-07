import type { Request, Response } from 'express';
import type { BaseService } from './base.service.js';

export interface IBaseController<T, TCreate, TUpdate> {
	getAll(req: Request, res: Response): Promise<void>;
	// getById(req: Request, res: Response): Promise<void>;
	// create(req: Request, res: Response): Promise<void>;
	// update(req: Request, res: Response): Promise<void>;
	// delete(req: Request, res: Response): Promise<void>;
	// paginate(req: Request, res: Response): Promise<void>;
	// search(req: Request, res: Response): Promise<void>;
}

export abstract class BaseController<T, TCreate, TUpdate> implements IBaseController<T, TCreate, TUpdate> {
	constructor(protected service: BaseService<T, TCreate, TUpdate>) {}

	async getAll(req: Request, res: Response): Promise<void> {
		const userId = req.user.id;
		const result = await this.service.getAll(userId);

		res.status(200).json(result);
	}
}
