import type { TSupplier } from './supplier.schema';
import { selectSuppliersList, selectSuppliersPagination } from './supplier.selectors';
import { closeModal } from '@common';
import { useAppDispatch, useAppSelector } from '@hooks';
import { supplierThunk } from './supplier.thunk';

export const useSupplierManager = (supplierData: TSupplier) => {
	const dispatch = useAppDispatch();
	const suppliers = useAppSelector(selectSuppliersList);
	const { page, limit } = useAppSelector(selectSuppliersPagination);

	const close = () => dispatch(closeModal());

	const handleDelete = async () => {
		if (!supplierData?.id) return;

		await dispatch(supplierThunk.delete(supplierData.id)).unwrap();

		const isLastItemOnPage = suppliers.length === 1 && page > 1;
		const nextPage = isLastItemOnPage ? page - 1 : page;

		dispatch(supplierThunk.paginate({ page: nextPage, limit: limit }));
		close();
	};

	return { handleDelete, close };
};
