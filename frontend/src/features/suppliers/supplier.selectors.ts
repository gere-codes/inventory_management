import type { RootState } from '@store';

export const selectSuppliers = (state: RootState) => state.supplier.items;
export const selectSuppliersPagination = (state: RootState) => state.supplier.pagination;
