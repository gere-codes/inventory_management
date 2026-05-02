import { baseSlice } from '@base';
import { productThunk } from './product.thunk';
import type { TProduct, TProductStats } from './product.schema';
import { createIinitialBaseState } from '@constants';

interface StatsState {
	data: TProductStats;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: any;
}
const initialStatsState: StatsState = {
	data: {
		categories: [],
		lowStock: 0,
		outOfStock: 0,
		totalProducts: 0,
	},
	status: 'idle',
	error: null,
};
export const productSlice = baseSlice(
	'product',
	productThunk,
	{ ...createIinitialBaseState<TProduct>(), stats: initialStatsState },
	{},

	(builder) => {
		builder
			.addCase(productThunk.getStats.pending, (state) => {
				state.stats.status = 'loading';
			})
			.addCase(productThunk.getStats.fulfilled, (state, action) => {
				state.stats.status = 'succeeded';
				state.stats.data = action.payload;
			})
			.addCase(productThunk.getStats.rejected, (state, action) => {
				state.stats.status = 'failed';
				state.stats.error = (action.payload as string) || 'An error occurred';
			});
	},
);
export const { setCurrentPage, setItemsPerPage } = productSlice.actions;
