import { baseSlice } from '@base';
import { categoryThunk } from './category.thunk';

export const categorySlice = baseSlice('category', categoryThunk, {});
