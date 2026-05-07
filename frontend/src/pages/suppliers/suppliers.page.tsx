import { useEffect } from 'react';
import { selectSuppliers, selectSuppliersPagination, supplierThunk } from '@suppliers';
import { useAppDispatch, useAppSelector } from '@hooks';

export const SuppliersPage = () => {
	const suppliers = useAppSelector(selectSuppliers);

	const pagiination = useAppSelector(selectSuppliersPagination);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(supplierThunk.paginate({ page: pagiination.currentPage, limit: pagiination.itemsPerPage }));
	}, [pagiination?.currentPage, pagiination?.itemsPerPage, dispatch]);
	return (
		<section>
			<h2>section page</h2>
		</section>
	);
};
