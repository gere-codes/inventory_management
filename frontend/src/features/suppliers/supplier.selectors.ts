import type { RootState } from '@store';

export const selectSuppliers = (state: RootState) => state.supplier.list;
export const selectSuppliersPagination = (state: RootState) => state.supplier.pagination;
