import { Router } from 'express';
import { authRoutes } from '@modules/auth/index.js';
import productRoutes from '@modules/product/product.route.js';
import categoryRoutes from '@modules/category/category.route.js';
import supplierRoutes from '@modules/supplier/supplier.route.js';
import orderRoutes from '@src/modules/order/order.route.js';
import { protect } from '@modules/auth/auth.middleware.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

const protectedRouter = Router();
protectedRouter.use(protect);
protectedRouter.use('/product', productRoutes);
protectedRouter.use('/category', categoryRoutes);
protectedRouter.use('/supplier', supplierRoutes);
protectedRouter.use('/order', orderRoutes);

apiRoutes.use(protectedRouter);

export default apiRoutes;
