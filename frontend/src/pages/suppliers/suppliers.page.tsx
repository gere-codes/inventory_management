import { useEffect } from 'react';
import { selectSuppliersList, selectSuppliersPagination, supplierThunk } from '@suppliers';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SupplierTable } from '@suppliers';

export const SuppliersPage = () => {
	const suppliers = useAppSelector(selectSuppliersList);

	const pagiination = useAppSelector(selectSuppliersPagination);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(supplierThunk.paginate({ page: pagiination.currentPage, limit: pagiination.itemsPerPage }));
	}, [pagiination?.currentPage, pagiination?.itemsPerPage, dispatch]);

	const noop = () => {};
	return (
		<section>
			<h2>section page</h2>

			{/* Table */}
			<SupplierTable suppliers={suppliers} onDelete={noop} onEdit={noop} />
		</section>
	);
};
