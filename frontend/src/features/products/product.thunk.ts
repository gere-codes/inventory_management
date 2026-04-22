import { BaseThunks } from '@base';
import type { TProduct, TProductCreate, TProductUpdate } from './product.schema';
import { productService } from './product.service';

class ProductThunk extends BaseThunks<TProduct, TProductCreate, TProductUpdate, FormData, FormData> {
	constructor() {
		super('product', productService);
	}
}

export const productThunk = new ProductThunk();
