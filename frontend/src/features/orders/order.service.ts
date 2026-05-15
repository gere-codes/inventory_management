import { BaseService } from '@/shared/base';
import {
	type TCreateOrder,
	type TUpdateOrder,
	type TOrder,
	orderSchema,
	updateOrderSchema,
	createOrderSchema,
} from './order.schema';

class OrderService extends BaseService<TOrder, TCreateOrder, TUpdateOrder, FormData, FormData> {
	constructor(resource: string) {
		super(resource, orderSchema, createOrderSchema, updateOrderSchema);
	}
}

export const orderService = new OrderService('order');
