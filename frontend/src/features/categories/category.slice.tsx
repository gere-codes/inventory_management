import { baseSlice } from '@base';
import { categoryThunk } from './category.thunk';
import { createIinitialBaseState } from '@constants';
import type { TCategory } from './category.schema';

export const categorySlice = baseSlice('category', categoryThunk, { ...createIinitialBaseState<TCategory>() });

export const { setCurrentPage: setCurrentCategoryPage, setItemsPerPage: setCategoriesPerPage } = categorySlice.actions;
