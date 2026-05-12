import { BaseService } from '@src/core/base/base.service.js';
import {
	createOrderSchema,
	responseOrderSchema,
	updateOrderSchema,
	type TCreateOrder,
	type TOrder,
	type TUpdateOrder,
} from './order.schema.js';
import type { IOrderRepository } from './order.repository.js';

export class OrderService extends BaseService<TOrder, TCreateOrder, TUpdateOrder> {
	constructor(repository: IOrderRepository) {
		super(repository, responseOrderSchema, createOrderSchema, updateOrderSchema);
	}
}
