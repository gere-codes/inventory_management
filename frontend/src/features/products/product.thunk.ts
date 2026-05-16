import { BaseThunks } from '@base';
import type { TProduct, TProductCreate, TProductUpdate } from './product.schema';
import { productService, type IProductService } from './product.service';
import { createAsyncThunk, type AsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

class ProductThunk extends BaseThunks<TProduct, TProductCreate, TProductUpdate, FormData, FormData, IProductService> {
	public getStats: AsyncThunk<any, void, {}>;
	public updateQuantity: AsyncThunk<TProduct, { productId: string; quantity: number }, {}>;

	constructor() {
		super('product', productService);

		this.getStats = createAsyncThunk<any, void>(`product/getStats`, async (_, { rejectWithValue }) => {
			try {
				return await this.service.getStats();
			} catch (error) {
				return rejectWithValue(this.handleError(error, `Error occurred while fetching products stats`));
			}
		});
		this.updateQuantity = createAsyncThunk<TProduct, { productId: string; quantity: number }>(
			`product/updaateQuantity`,
			async ({ productId, quantity }, { rejectWithValue }) => {
				try {
					return await this.service.updateQuantity({ productId, quantity });
				} catch (error) {
					return rejectWithValue(this.handleError(error, `Error occurred while updating quantity`));
				}
			},
		);
	}

	handleError = (error: any, defaultMessage: string) => {
		if (isAxiosError(error) && error.response) {
			return error.response.data;
		}
		return defaultMessage;
	};
}

export const productThunk = new ProductThunk();
