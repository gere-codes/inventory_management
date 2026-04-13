import { useEffect, useState } from 'react';
import { selectCategories, selectCategoryPagination, categoryThunk, CategoryTable } from '@categories';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { Pagination, SearchBar } from '@common/index';

export const CategoriesPage = () => {
	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);

	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectCategoryPagination);

	useEffect(() => {
		dispatch(categoryThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const noop = () => {};

	return (
		<section>
			<SearchBar value={term} onSearch={(newValue) => setTerm(newValue)} placeholder="Search Product..." />
			<CategoryTable categories={categories} onDelete={noop} onEdit={noop} />
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsPerPage={itemsPerPage}
				onPageChange={noop}
				onPerPageChange={noop}
			/>
		</section>
	);
};
