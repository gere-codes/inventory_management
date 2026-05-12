import { BaseController } from '@src/core/base/base.controller.js';
import type { TCreateOrder, TOrder, TUpdateOrder } from './order.schema.js';
import { OrderRespository } from './order.repository.js';
import { db } from '@src/db/index.js';
import { OrderService } from './order.service.js';

class OrderController extends BaseController<TOrder, TCreateOrder, TUpdateOrder> {
	constructor() {
		const repo = new OrderRespository(db);
		const service = new OrderService(repo);
		super(service);
	}
}

export const orderController = new OrderController();
