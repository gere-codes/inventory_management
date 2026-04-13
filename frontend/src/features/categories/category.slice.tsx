import { baseSlice } from '@/shared/base';
import { categoryThunk } from './category.thunk';

export const categorySlice = baseSlice('category', categoryThunk, {});
