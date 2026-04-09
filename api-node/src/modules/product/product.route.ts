import { Router } from 'express';
import { productController } from './product.controller.js';

const productRoutes = Router();

productRoutes.get('/paginate', productController.paginate);
productRoutes.post('/', productController.create);
productRoutes.put('/:id', productController.update);
productRoutes.delete('/:id', productController.delete);

productRoutes.get('/search', productController.search);
productRoutes.get('/:id', productController.getById);

export default productRoutes;
