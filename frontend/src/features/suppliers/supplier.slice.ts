import { baseSlice } from '@base';
import { supplierThunk } from './supplier.thunk';
import { createIinitialBaseState } from '@constants';
import type { TSupplier } from './supplier.schema';

export const supplierSlice = baseSlice('supplier', supplierThunk, { ...createIinitialBaseState<TSupplier>() });
