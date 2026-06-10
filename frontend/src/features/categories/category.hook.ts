import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectCategories, selectCategoryStatus } from './category.selectors';
import { categoryThunk } from './category.thunk';

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
