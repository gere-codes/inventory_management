import { baseSlice } from '@/shared/base';
import { productThunk } from './product.thunk';

export const productSlice = baseSlice('product', productThunk, {});
