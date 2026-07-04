import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { upload } from '@middlewares';

const categoryRoutes = Router();

categoryRoutes.get('/stats', categoryController.getStats);
categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.post('/', upload.single('image'), categoryController.create);
categoryRoutes.put('/:id', upload.single('image'), categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);

categoryRoutes.get('/:id', categoryController.getById);

export const publicCategoryRoutes = Router();

publicCategoryRoutes.get('/', categoryController.getCollection);

export default categoryRoutes;
