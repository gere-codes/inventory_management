import type { Request, Response, NextFunction } from 'express';
import type { BaseService, IBaseService } from './base.service.js';
import { catchAsync } from '@utils/index.js';
import type { IFileService } from '@services';
import type { TBaseQuery } from '../schema/general.schema.js';
import z from 'zod';

export interface IBaseController<T, TCreate, TUpdate> {
	getAll(req: Request, res: Response, next: NextFunction): void;
	getById(req: Request, res: Response, next: NextFunction): void;
	create(req: Request, res: Response, next: NextFunction): void;
	update(req: Request, res: Response, next: NextFunction): void;
	delete(req: Request, res: Response, next: NextFunction): void;

	getCollection(req: Request, res: Response, next: NextFunction): void;
}

export abstract class BaseController<
	T,
	TCreate,
	TUpdate,
	TService extends IBaseService<T, TCreate, TUpdate> = IBaseService<T, TCreate, TUpdate>,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseController<T, TCreate, TUpdate> {
	constructor(
		protected service: TService,
		protected querySchema: z.ZodSchema<TQuery>,
		protected fileService?: IFileService,
	) {}

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
		const result = await this.service.getById(id as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const { body } = req;
		let payload = { ...body };

		// Handling a single image
		if (req.file && this.fileService) {
			let image: string = '';
			image = await this.fileService.upload(req.file);
			payload.image = image;
		}

		// Handling an array of images
		if (req.files && Array.isArray(req.files) && req.files.length > 0 && this.fileService) {
			let images: string[] = [];
			images = await Promise.all(req.files.map((file) => this.fileService!.upload(file)));
			payload.images = images;
		}

		const result = await this.service.create(userId, payload);

		res.status(201).json({
			success: true,
			data: result,
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const id = req.params?.id as string;
		const { body } = req;

		let existingImages: string[] = [];

		// normalize existing images to array
		if (body?.images) {
			if (Array.isArray(body.images)) {
				existingImages = body.images;
			} else if (typeof body.images === 'string') {
				existingImages = [body.images];
			}
		}

		// handle new images upload if any
		let newImages: string[] = [];
		if (req.files && Array.isArray(req.files) && req.files.length > 0 && this.fileService) {
			newImages = await Promise.all(req.files.map((file) => this.fileService!.upload(file)));
		}

		const finalImages = [...existingImages, ...newImages];

		const payload = { ...body, images: finalImages };

		const result = await this.service.update(userId, id, payload);

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

	getCollection = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user?.id;
		const context = {
			userId,
		};

		const options = this.querySchema.parse(req.query);

		const response = await this.service.getCollection(context, options);

		res.status(200).json({
			success: true,
			data: response,
		});
	});
}
