export * from './product.thunk';
export * from './product.schema';
export * from './product.selectors';
export * from './product.service';
export * from './product.enum';

export { productSlice, setCurrentPage, setItemsPerPage } from './product.slice';
export { productThunk } from './product.thunk';
export { ProductTable } from './components/product.table';
export { ProductForm } from './components/product.form';
export { ProductModalManager } from './components/product-modal.manager';
export { useProductHandlers, useProductQuery } from './product.hook';
