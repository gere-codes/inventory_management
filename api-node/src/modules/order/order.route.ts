import { Router } from 'express';
import { orderController } from './order.controller.js';
import { upload } from '@middlewares';

const orderRoutes = Router();

orderRoutes.get('/collection', orderController.getCollection);
orderRoutes.post('/', upload.array('images[]', 4), orderController.create);
orderRoutes.put('/:id', upload.array('images[]', 4), orderController.update);

orderRoutes.get('/:id', orderController.getById);

export default orderRoutes;

// Public route

export const publicOrderRoutes = Router();
