import type { RootState } from '@store';

export const selectOrderList = (state: RootState) => state.order.list.data;
export const selectOrderPagination = (state: RootState) => state.order.pagination;
