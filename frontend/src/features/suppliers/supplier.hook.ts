import type { TSupplier } from './supplier.schema';
import { selectSuppliersList, selectSuppliersPagination } from './supplier.selectors';
import { closeModal } from '@common';
import { useAppDispatch, useAppSelector } from '@hooks';
import { supplierThunk } from './supplier.thunk';

export const useSupplierManager = (supplierData: TSupplier) => {
	const dispatch = useAppDispatch();
	const suppliers = useAppSelector(selectSuppliersList);
	const { currentPage, itemsPerPage } = useAppSelector(selectSuppliersPagination);

	const close = () => dispatch(closeModal());

	const handleDelete = async () => {
		if (!supplierData?.id) return;

		await dispatch(supplierThunk.delete(supplierData.id)).unwrap();

		const isLastItemOnPage = suppliers.length === 1 && currentPage > 1;
		const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;

		dispatch(supplierThunk.paginate({ page: nextPage, limit: itemsPerPage }));
		close();
	};

	return { handleDelete, close };
};
