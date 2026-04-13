import type { RootState } from '@store';

export const selectCategories = (state: RootState) => state.category.items;
export const selectCategoryPagination = (state: RootState) => state.category.pagination;
