import { useAppDispatch, useAppSelector, useCollectionFilter, useFetchData, useFetchStats } from '@hooks';
import { productThunk } from './product.thunk';
import { productQuerySchema, type TProduct, type TProductStats } from './product.schema';
import { EModalMode, EModalType, openModal } from '@common';
import { EOrderStatus, EOrderType, type TOrderForm } from '../orders';
import { ECRUDMode } from '@enums';
import {
	selectProducts,
	selectProductsPagination,
	selectProductsStatus,
	selectProductStats,
} from './product.selectors';
import { useCallback, useEffect } from 'react';

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
		status,
		data,
	};
};

export const useProductHandlers = () => {
	const dispatch = useAppDispatch();

	const handleDelete = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.DELETE }));
	};

	const handleEdit = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.EDIT }));
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

	const handleAddProduct = () => {
		dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.PRODUCT }));
	};

	return {
		handleDelete,
		handleEdit,
		handleReorder,
		handleAddProduct,
	};
};

export const useProductData = () => {
	const products = useFetchData({
		schema: productQuerySchema,
		thunkAction: productThunk.getCollection,
		selectData: selectProducts,
		selectPagination: selectProductsPagination,
		selectStatus: selectProductsStatus,
	});
	return products;
};

export const useProductStats = () => {
	const dispatch = useAppDispatch();
	const { data, status } = useAppSelector(selectProductStats);

	const fetchProductsStats = useCallback(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

	useEffect(() => {
		fetchProductsStats();
	}, [fetchProductsStats]);

	return {
		data,
		isLoading: status === 'loading',
		isSuccess: status === 'succeeded',
		isError: status === 'failed',
		fetchProductsStats,
	};
};

export const useProductsStats = () => {
	const { data, error, status, fetchStats } = useFetchStats<TProduct, TProductStats>({
		selectStatsState: selectProductStats,
		thunkAction: productThunk.getStats,
	});

	return {
		data,
		isLoading: status === 'loading',
		isSuccess: status === 'succeeded',
		isError: status === 'failed',
		fetchStats,
	};
};
