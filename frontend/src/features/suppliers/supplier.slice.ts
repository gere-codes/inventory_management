import { baseSlice } from '@base';
import { supplierThunk } from './supplier.thunk';

export const supplierSlice = baseSlice('supplier', supplierThunk, {});
