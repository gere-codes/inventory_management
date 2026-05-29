import { Router } from 'express';
import { authRoutes } from '@modules/auth/index.js';
import productRoutes, { publicProductRoutes } from '@modules/product/product.route.js';
import categoryRoutes, { publicCategoryRoutes } from '@modules/category/category.route.js';
import supplierRoutes, { publicSupplieryRoutes } from '@modules/supplier/supplier.route.js';
import orderRoutes, { publicOrderRoutes } from '@src/modules/order/order.route.js';
import { protect } from '@modules/auth/auth.middleware.js';

const apiRoutes = Router();

// Auth Routes
apiRoutes.use('/auth', authRoutes);

// Public Routes
apiRoutes.use('/public/product', publicProductRoutes);
apiRoutes.use('/public/category', publicCategoryRoutes);
apiRoutes.use('/public/supplier', publicSupplieryRoutes);
apiRoutes.use('/public/supplier', publicOrderRoutes);

// Protect Routes
const protectedRouter = Router();
protectedRouter.use(protect);
protectedRouter.use('/product', productRoutes);
protectedRouter.use('/category', categoryRoutes);
protectedRouter.use('/supplier', supplierRoutes);
protectedRouter.use('/order', orderRoutes);

apiRoutes.use(protectedRouter);

export default apiRoutes;
