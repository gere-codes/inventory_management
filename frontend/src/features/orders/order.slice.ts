import { baseSlice } from '@/shared/base';
import { createIinitialBaseState } from '@/shared/constants';
import type { TOrder } from './order.schema';
import { orderThunk } from './order.thunk';

export const orderSlice = baseSlice('order', orderThunk, { ...createIinitialBaseState<TOrder>() });
