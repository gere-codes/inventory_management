import { baseSlice } from '@base';
import { productThunk } from './product.thunk';

export const productSlice = baseSlice('product', productThunk, {});
