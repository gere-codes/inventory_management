import { BaseController } from '@src/core/base/base.controller.js';
import { orderQuerySchema, type TCreateOrder, type TOrder, type TUpdateOrder } from './order.schema.js';
import { OrderRespository } from './order.repository.js';
import { db } from '@src/db/index.js';
import { OrderService } from './order.service.js';
import { LocalFileService } from '@src/services/storage.service.js';

class OrderController extends BaseController<TOrder, TCreateOrder, TUpdateOrder> {
	constructor() {
		const repo = new OrderRespository(db);
		const service = new OrderService(repo);
		const fileService = new LocalFileService();
		super(service, orderQuerySchema, fileService);
	}
}

export const orderController = new OrderController();
