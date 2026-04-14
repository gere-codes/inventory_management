import { useEffect } from 'react';
import { selectSuppliers, selectSuppliersPagination, supplierThunk } from '@suppliers';
import { useAppDispatch, useAppSelector } from '@hooks';

export const SuppliersPage = () => {
	const suppliers = useAppSelector(selectSuppliers);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectSuppliersPagination);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(supplierThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [currentPage, itemsPerPage, dispatch]);
	return (
		<section>
			<h2>section page</h2>
		</section>
	);
};
