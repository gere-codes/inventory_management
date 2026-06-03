import { Router } from 'express';
import { orderController } from './order.controller.js';
import { upload } from '@middlewares';

const orderRoutes = Router();

orderRoutes.get('/', orderController.getAll);
orderRoutes.post('/', upload.single('image'), orderController.create);
orderRoutes.put('/:id', upload.single('image'), orderController.update);

orderRoutes.get('/:id', orderController.getById);

export default orderRoutes;

// Public route

export const publicOrderRoutes = Router();
publicOrderRoutes.get('/', orderController.getCollection);
