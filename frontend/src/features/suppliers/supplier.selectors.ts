import type { RootState } from '@store';

export const selectSuppliersList = (state: RootState) => state.supplier.list.data;
export const selectSuppliersPagination = (state: RootState) => state.supplier.pagination;
