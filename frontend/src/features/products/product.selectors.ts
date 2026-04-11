import type { RootState } from '@/store';

export const selectProducts = (state: RootState) => state.product.items;
export const selectProductsPagination = (state: RootState) => state.product.pagination;
