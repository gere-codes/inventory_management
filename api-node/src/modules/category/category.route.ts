import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { upload } from '@middlewares';

const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/paginate', categoryController.paginate);
categoryRoutes.get('/search', categoryController.search);
categoryRoutes.post('/', upload.single('image'), categoryController.create);
categoryRoutes.put('/:id', upload.single('image'), categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);

categoryRoutes.get('/:id', categoryController.getById);

export default categoryRoutes;
