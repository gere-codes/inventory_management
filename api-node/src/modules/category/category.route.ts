import { Router } from 'express';
import { categoryController } from './category.controller.js';

const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/paginated', categoryController.paginate);
categoryRoutes.get('/search', categoryController.search);
categoryRoutes.post('/', categoryController.create);
categoryRoutes.put('/:id', categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);

categoryRoutes.get('/:id', categoryController.getById);

export default categoryRoutes;
