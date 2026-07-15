import type { Request, Response, NextFunction } from 'express';
import type { BaseService, IBaseService } from './base.service.js';
import { catchAsync } from '@utils/index.js';
import type { IFileService } from '@services';
import { paginationSchema, type TBaseQuery } from '../schema/general.schema.js';
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
	T extends { image?: string | undefined | null; images?: string[] | null | undefined },
	TCreate,
	TUpdate,
	TStats,
	TService extends IBaseService<T, TCreate, TUpdate, TStats> = IBaseService<T, TCreate, TUpdate, TStats>,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseController<T, TCreate, TUpdate> {
	constructor(
		protected service: TService,
		protected schema: z.ZodSchema<T>,
		protected createSchema: z.ZodSchema<TCreate>,
		protected updateSchema: z.ZodSchema<TUpdate>,
		protected querySchema: z.ZodSchema<TQuery>,
		protected statsSchema: z.ZodSchema<TStats>,
		protected fileService?: IFileService,
	) {}

	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const result = await this.service.getAll(userId);

		res.status(200).json({
			success: true,
			payload: result,
		});
	});

	getById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { id } = req.params;
		const item = await this.service.getById(id as string);
		const responseDto = this.schema.parse(item);

		res.status(200).json({
			success: true,
			payload: responseDto,
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user.id;
		const { body } = req;
		let payload = { ...body };

		// handling a single image
		if (req.file && this.fileService) {
			let image: string = '';
			image = await this.fileService.upload(req.file);
			payload.image = image;
		}

		// handling an existing images for re-order case
		let existingImages: string[] = [];
		if (body?.images) {
			if (Array.isArray(body.images)) {
				existingImages = body.images;
			} else if (typeof body.images === 'string') {
				existingImages = [body.images];
			}
		}
		payload.images = existingImages;
		// handling an array of images
		let newImages: string[] = [];
		if (req.files && Array.isArray(req.files) && req.files.length > 0 && this.fileService) {
			newImages = await Promise.all(req.files.map((file) => this.fileService!.upload(file)));
			payload.images = newImages;
		}

		const validateInput = this.createSchema.parse(payload);

		const createdItem = await this.service.create(userId, validateInput);
		const responseDto = this.schema.parse(createdItem);

		res.status(201).json({
			success: true,
			payload: responseDto,
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const id = req.params?.id as string;
		const { body } = req;

		let payload = { ...body };

		const item = await this.service.getById(id);

		if (this.fileService) {
			// remove the image if it has been deleted
			if (!body?.image && item?.image) {
				await this.fileService.delete(item.image);
			}

			// update a single image
			if (req.file) {
				// delete the old image if it exists
				if (item?.image) {
					await this.fileService.delete(item.image);
				}

				// update the image
				let updateImage = await this.fileService.upload(req.file);
				payload.image = updateImage;
			}

			// normalize existing images to array
			let existingImages: string[] = typeof body?.images === 'string' ? [body?.images] : body?.images;

			// handle new images upload if any
			let newImages: string[] = [];
			if (req.files && Array.isArray(req.files) && req.files.length > 0) {
				newImages = await Promise.all(req.files.map((file) => this.fileService!.upload(file)));
			}

			const finalImages = [...existingImages, ...newImages];

			// Delete images that are no longer in the payload
			if (item?.images && item?.images.length > 0) {
				for (const oldImage of item.images) {
					if (!finalImages.includes(oldImage)) {
						await this.fileService.delete(oldImage);
					}
				}
			}

			payload.images = finalImages;
		}

		const validateInput = this.updateSchema.parse(payload);
		const updatedItem = await this.service.update(id, validateInput);
		const responseDto = this.schema.parse(updatedItem);

		res.status(201).json({
			success: true,
			payload: responseDto,
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const id = req.params?.id as string;
		const deletedProduct = await this.service.delete(id);
		const responseDto = this.schema.parse(deletedProduct);

		// remove image
		if (deletedProduct?.image) {
			await this.fileService?.delete(deletedProduct.image);
		}

		// delete array of images
		if (deletedProduct?.images && deletedProduct.images.length > 0) {
			for (const image of deletedProduct.images) {
				await this.fileService?.delete(image);
			}
		}

		res.status(200).json({
			success: true,
			payload: responseDto,
		});
	});

	getCollection = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user?.id;
		const context = {
			userId,
		};

		const options = this.querySchema.parse(req.query);

		const { items, pagination } = await this.service.getCollection(context, options);

		const responseDto = {
			items: z.array(this.schema).parse(items),
			pagination: paginationSchema.parse(pagination),
		};

		res.status(200).json({
			success: true,
			payload: responseDto,
		});
	});

	getStats = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.user?.id as string;
		const reponse = await this.service.getStats(userId);
		const responseDto = this.statsSchema.parse(reponse);

		res.status(200).json({
			success: true,
			payload: responseDto,
		});
	});
}
