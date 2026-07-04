import type { RootState } from '@store';

export const selectCategories = (state: RootState) => state.category.list.data;
export const selectCategoryPagination = (state: RootState) => state.category.pagination;
export const selectCategoryStatus = (state: RootState) => state.category.list.status;
export const selectCategoryStats = (state: RootState) => state.category.stats;
