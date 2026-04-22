export interface IFileService {
	upload(file: Express.Multer.File): Promise<string>;
}

export class LocalFileService implements IFileService {
	async upload(file: Express.Multer.File): Promise<string> {
		return `/uploads/${file.filename}`;
	}
}
