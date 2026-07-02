import { baseSlice } from '@base';
import { categoryThunk } from './category.thunk';
import { createIinitialBaseState } from '@constants';
import type { TCategory, TCategoryStats } from './category.schema';

const initialDataStats: TCategoryStats = {
	totalCategories: 0,
	productsPerCategory: [],
};

const initialCategoryStats = {
	data: initialDataStats,
	status: 'idle' as const,
	error: null,
};
export const categorySlice = baseSlice('category', categoryThunk, {
	...createIinitialBaseState<TCategory, TCategoryStats>(),
	stats: initialCategoryStats,
});

export const { setCurrentPage: setCurrentCategoryPage, setItemsPerPage: setCategoriesPerPage } = categorySlice.actions;
