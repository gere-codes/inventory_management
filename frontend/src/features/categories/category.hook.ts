import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useCollectionFilter } from '@hooks';
import { selectCategories, selectCategoryPagination, selectCategoryStatus } from './category.selectors';
import { categoryThunk } from './category.thunk';
import { categoryQuerySchema, type TCategory } from './category.schema';
import { EModalMode, EModalType, openModal } from '@/shared/components/common';

export const useCategories = () => {
	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);
	const status = useAppSelector(selectCategoryStatus);

	useEffect(() => {
		if (status === 'idle') {
			dispatch(categoryThunk.getAll());
		}
	}, [dispatch, status]);

	return {
		categories,
		isLoading: status === 'loading',
		isError: status === 'failed',
		isSuccess: status === 'succeeded',
	};
};

export const useCategoryFilter = () => {
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
		schema: categoryQuerySchema,
		thunkAction: categoryThunk.getCollection,
		selectData: selectCategories,
		selectPagination: selectCategoryPagination,
		selectStatus: selectCategoryStatus,
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

export const useCategoryHanlders = () => {
	const dispatch = useAppDispatch();

	const handleEdit = async (order: TCategory) => {
		dispatch(openModal({ data: order, type: EModalType.CATEGORY, mode: EModalMode.EDIT }));
	};
	const handleDelete = async (order: TCategory) => {
		dispatch(openModal({ data: order, type: EModalType.CATEGORY, mode: EModalMode.DELETE }));
	};
	const handleAdd = async () => {
		dispatch(openModal({ data: null, type: EModalType.CATEGORY, mode: EModalMode.CREATE }));
	};

	return {
		handleEdit,
		handleAdd,
		handleDelete,
	};
};
