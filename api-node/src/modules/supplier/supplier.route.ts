import { Router } from 'express';
import { supplierController } from './supplier.controller.js';

const supplierRoutes = Router();

supplierRoutes.get('/', supplierController.getAll);
supplierRoutes.get('/paginate', supplierController.paginate);
supplierRoutes.post('/', supplierController.create);
supplierRoutes.put('/:id', supplierController.update);
supplierRoutes.delete('/:id', supplierController.delete);

supplierRoutes.get('/:id', supplierController.getById);
supplierRoutes.get('/search', supplierController.search);

export default supplierRoutes;
