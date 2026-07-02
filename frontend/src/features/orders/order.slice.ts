import { baseSlice } from '@/shared/base';
import { createIinitialBaseState } from '@/shared/constants';
import type { TOrder, TOrderStats } from './order.schema';
import { orderThunk } from './order.thunk';
import { OrdersPage } from '@/pages';

export const orderSlice = baseSlice('order', orderThunk, { ...createIinitialBaseState<TOrder, TOrderStats>() });

export const { setCurrentPage: setCurrentOrderPage, setItemsPerPage: setOrdersPerPage } = orderSlice.actions;
