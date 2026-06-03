import { Router } from 'express';
import { productController } from './product.controller.js';
import { upload } from '@middlewares';

const productRoutes = Router();

// productRoutes.get('/', productController.getAll);
productRoutes.post('/', upload.array('images', 4), productController.create);
productRoutes.put('/:id', upload.array('images', 4), productController.update);
productRoutes.delete('/:id', productController.delete);

productRoutes.get('/stats', productController.getStats);
productRoutes.put('/:id/quantity', productController.updateQuantity);
productRoutes.get('/:id', productController.getById);

export default productRoutes;

// Public Product Routes

export const publicProductRoutes = Router();

publicProductRoutes.get('/', productController.getCollection);
