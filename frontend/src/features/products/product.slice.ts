import { baseSlice } from '@base';
import { productThunk } from './product.thunk';
import type { TProduct, TProductStats } from './product.schema';
import { createIinitialBaseState } from '@constants';
import { castDraft } from 'immer';

interface StatsState {
	data: TProductStats;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}
const initialStateStats: StatsState = {
	data: {
		stockLevel: {
			lowStock: 0,
			outOfStock: 0,
			totalProducts: 0,
		},
	},
	status: 'idle',
	error: null,
};
export const productSlice = baseSlice(
	'product',
	productThunk,
	{ ...createIinitialBaseState<TProduct, TProductStats>(), stats: initialStateStats },
	{},

	(builder) => {
		builder

			// update poduct quantity
			.addCase(productThunk.updateQuantity.pending, (state) => {
				state.list.status = 'loading';
				state.list.error = null;
			})
			.addCase(productThunk.updateQuantity.fulfilled, (state, action) => {
				state.list.status = 'succeeded';
				state.list.error = null;
				const item = castDraft(action.payload);
				const itemIndex = state.list.data.findIndex((i) => i.id === item.id);

				if (itemIndex !== -1) {
					state.list.data[itemIndex] = item;
				}
			})
			.addCase(productThunk.updateQuantity.rejected, (state, action) => {
				state.list.status = 'failed';
				state.list.error = (action.payload as string) || 'An error occurred';
			});
	},
);
export const { setCurrentPage, setItemsPerPage } = productSlice.actions;
