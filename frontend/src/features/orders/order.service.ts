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
	orderStatsSchema,
	type TOrderStats,
} from './order.schema';

class OrderService extends BaseService<
	TOrder,
	TCreateOrder,
	TUpdateOrder,
	TOrderStats,
	FormData,
	FormData,
	TOrdertQuery
> {
	constructor(resource: string) {
		super(resource, orderSchema, createOrderSchema, updateOrderSchema, orderStatsSchema, orderQuerySchema);
	}
}

export const orderService = new OrderService('order');
