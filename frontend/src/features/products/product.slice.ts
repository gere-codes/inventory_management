import { baseSlice } from '@base';
import { productThunk } from './product.thunk';
import type { TProduct } from './product.schema';
import { createIinitialBaseState } from '@constants';

export const productSlice = baseSlice(
	'product',
	productThunk,
	{ ...createIinitialBaseState<TProduct>(), stats: null },
	{},

	(builder) => {
		builder
			.addCase(productThunk.getStats.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.getStats.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.stats = action.payload;
			})
			.addCase(productThunk.getStats.rejected, (state, action) => {
				state.status = 'failed';
				state.error = (action.payload as string) || 'An error occurred';
			});
	},
);
export const { setCurrentPage, setItemsPerPage } = productSlice.actions;
