import { Router } from 'express';
import { orderController } from './order.controller.js';
import { upload } from '@middlewares';

const orderRoutes = Router();

orderRoutes.get('/', orderController.getAll);
orderRoutes.get('/paginate', orderController.paginate);
orderRoutes.post('/', upload.single('image'), orderController.create);
orderRoutes.put('/:id', upload.single('image'), orderController.update);

orderRoutes.get('/search', orderController.search);
orderRoutes.get('/:id', orderController.getById);

export default orderRoutes;
