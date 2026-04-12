import { baseSlice } from '@/shared/base';
import { productThunk } from '../products/product.thunk';

export const categorySlice = baseSlice('category', productThunk, {});
