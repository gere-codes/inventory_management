import type { TSupplier } from './supplier.schema';
import { selectSuppliersList, selectSuppliersPagination } from './supplier.selectors';
import { closeModal } from '@common';
import { useAppDispatch, useAppSelector } from '@hooks';
import { supplierThunk } from './supplier.thunk';

export const useSupplierManager = (supplierData: TSupplier) => {
	const dispatch = useAppDispatch();
	const close = () => dispatch(closeModal());

	const handleDelete = async () => {
		if (!supplierData?.id) return;

		await dispatch(supplierThunk.delete(supplierData.id)).unwrap();
		close();
	};

	return { handleDelete, close };
};
