import { AppError, NotFoundError } from '@src/core/utils/error.util.js';
import { unlinkSync, unlink } from 'fs';
import { join } from 'path';

export interface IFileService {
	upload(file: Express.Multer.File): Promise<string>;
	delete(filename: string): Promise<void>;
}

export class LocalFileService implements IFileService {
	async upload(file: Express.Multer.File): Promise<string> {
		return `/uploads/${file.filename}`;
	}

	async delete(filename: string): Promise<void> {
		if (!filename) return;

		try {
			const imagePath = join(process.cwd(), 'uploads', filename);
			await unlinkSync(imagePath);
		} catch (error) {
			throw new NotFoundError('File Not found');
		}
	}
}
