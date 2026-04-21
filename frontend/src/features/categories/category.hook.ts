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
