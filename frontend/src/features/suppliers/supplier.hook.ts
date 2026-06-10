import { suppplierQuerySchema, type TSupplier } from './supplier.schema';
import { selectSuppliersList, selectSuppliersPagination, selectSuppliersStatus } from './supplier.selectors';
import { closeModal, EModalMode, EModalType, openModal } from '@common';
import { useAppDispatch, useAppSelector, useCollectionFilter, useFetchData } from '@hooks';
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

export const useSupplierFilter = () => {
	const {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handleSearchChange,
		pagination,
		resetFilters,
		handlePageChange,
		handleLimitChange,
		setParam,
		status,
		data,
	} = useCollectionFilter({
		schema: suppplierQuerySchema,
		thunkAction: supplierThunk.getCollection,
		selectData: selectSuppliersList,
		selectPagination: selectSuppliersPagination,
		selectStatus: selectSuppliersStatus,
	});

	return {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		pagination,
		resetFilters,
		setParam,
		status,
		data,
	};
};

export const useSupplierHanlders = () => {
	const dispatch = useAppDispatch();

	const handleEdit = async (order: TSupplier) => {
		dispatch(openModal({ data: order, type: EModalType.SUPPLIER, mode: EModalMode.EDIT }));
	};
	const handleDelete = async (order: TSupplier) => {
		dispatch(openModal({ data: order, type: EModalType.SUPPLIER, mode: EModalMode.DELETE }));
	};
	const handleAdd = async () => {
		dispatch(openModal({ data: null, type: EModalType.SUPPLIER, mode: EModalMode.CREATE }));
	};

	return {
		handleEdit,
		handleAdd,
		handleDelete,
	};
};

export const useSupplierData = () => {
	const { fetchData } = useFetchData({ schema: suppplierQuerySchema, thunkAction: supplierThunk.getCollection });
	return fetchData;
};
