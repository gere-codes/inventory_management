import { Router } from 'express';
import { supplierController } from './supplier.controller.js';

const supplierRoutes = Router();

supplierRoutes.get('/collection', supplierController.getCollection);
supplierRoutes.post('/', supplierController.create);
supplierRoutes.put('/:id', supplierController.update);
supplierRoutes.delete('/:id', supplierController.delete);

supplierRoutes.get('/:id', supplierController.getById);

export default supplierRoutes;

// public route
export const publicSupplieryRoutes = Router();
