import { BaseThunks } from '@/shared/base';
import type { TCategory, TCategoryCreate, TCategoryUpdate } from './cateogry.schema';
import { cateogryService } from './category.service';

class CategoryThunk extends BaseThunks<TCategory, TCategoryCreate, TCategoryUpdate> {
	constructor() {
		super('category', cateogryService);
	}
}

export const categoryThunk = new CategoryThunk();
