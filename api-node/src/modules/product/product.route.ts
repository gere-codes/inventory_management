import { Router } from 'express';
import { productController } from './product.controller.js';
import { upload } from '@middlewares';

const productRoutes = Router();

productRoutes.get('/', productController.getAll);
productRoutes.get('/paginate', productController.paginate);
productRoutes.post('/', upload.single('image'), productController.create);
productRoutes.put('/:id', upload.single('image'), productController.update);
productRoutes.delete('/:id', productController.delete);

productRoutes.get('/search', productController.search);
productRoutes.get('/stats', productController.getStats);
productRoutes.put('/:id/quantity', productController.updateQuantity);
productRoutes.get('/:id', productController.getById);

export default productRoutes;
