import { BaseThunks } from '@/shared/base';
import type { TCreateOrder, TOrder, TOrderStats, TUpdateOrder } from './order.schema';
import { orderService } from './order.service';

class OrderThunk extends BaseThunks<TOrder, TCreateOrder, TUpdateOrder, TOrderStats, FormData, FormData> {
	constructor() {
		super('order', orderService);
	}
}

export const orderThunk = new OrderThunk();
