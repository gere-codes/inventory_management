import { useAppDispatch, useCollectionFilter } from '@hooks';
import { productThunk } from './product.thunk';
import { productQuerySchema, type TProduct } from './product.schema';
import { EModalMode, EModalType, openModal } from '@common';
import { EOrderStatus, EOrderType, type TOrderForm } from '../orders';
import { ECRUDMode } from '@enums';
import { selectProducts, selectProductsPagination, selectProductsStatus } from './product.selectors';

export const useProductFilter = () => {
	const {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handleSearchChange,
		pagination,
		resetFilters,
		setParam,
		status,
		data,
	} = useCollectionFilter({
		schema: productQuerySchema,
		thunkAction: productThunk.getCollection,
		selectData: selectProducts,
		selectPagination: selectProductsPagination,
		selectStatus: selectProductsStatus,
	});

	return {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handleSearchChange,
		pagination,
		resetFilters,
		setParam,
		status,
		data,
	};
};

export const useProductHandlers = ({
	setLimit,
	setPage,
	fetchData,
}: {
	setLimit: (limit: number) => void;
	setPage: (page: number) => void;
	fetchData: () => void;
}) => {
	const dispatch = useAppDispatch();

	const handleDelete = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.DELETE }));
		fetchData();
	};

	const handleEdit = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.EDIT }));
		fetchData();
	};
	const handleReorder = async (product: TProduct) => {
		const data: TOrderForm = {
			...product,
			productId: product.id,
			quantity: 1,
			mode: ECRUDMode.CREATE,
			status: EOrderStatus.PENDING,
			type: EOrderType.REORDER,
		};

		dispatch(openModal({ data, type: EModalType.ORDER, mode: EModalMode.CREATE }));
	};

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	const handleLimitChange = (limit: number) => {
		setLimit(limit);
	};

	const handleAddProduct = () => {
		dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.PRODUCT }));
	};

	return {
		handleDelete,
		handleEdit,
		handlePageChange,
		handleLimitChange,
		handleReorder,
		handleAddProduct,
	};
};
