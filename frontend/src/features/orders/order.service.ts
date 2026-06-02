import { BaseService } from '@/shared/base';
import {
	type TCreateOrder,
	type TUpdateOrder,
	type TOrder,
	orderSchema,
	updateOrderSchema,
	createOrderSchema,
	type TOrdertQuery,
	orderQuerySchema,
} from './order.schema';

class OrderService extends BaseService<TOrder, TCreateOrder, TUpdateOrder, FormData, FormData, TOrdertQuery> {
	constructor(resource: string) {
		super(resource, orderSchema, createOrderSchema, updateOrderSchema, orderQuerySchema);
	}
}

export const orderService = new OrderService('order');
