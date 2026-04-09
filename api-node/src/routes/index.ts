import { Router } from 'express';
import { authRoutes } from '@modules/auth/index.js';
import productRoutes from '@modules/product/product.route.js';
import categoryRoutes from '@modules/category/category.route.js';
import supplierRoutes from '@modules/supplier/supplier.route.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

apiRoutes.use('/product', productRoutes);
apiRoutes.use('/category', categoryRoutes);
apiRoutes.use('/supplier', supplierRoutes);

export default apiRoutes;
