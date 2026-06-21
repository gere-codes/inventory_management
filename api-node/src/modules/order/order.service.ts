import { BaseService } from '@src/core/base/base.service.js';
import type { TCreateOrder, TOrder, TUpdateOrder } from './order.schema.js';
import type { IOrderRepository } from './order.repository.js';

export class OrderService extends BaseService<TOrder, TCreateOrder, TUpdateOrder> {
	constructor(repository: IOrderRepository) {
		super(repository);
	}
}
