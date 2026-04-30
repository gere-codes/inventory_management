import { useEffect, useState } from 'react';
import { selectCategories, selectCategoryPagination, categoryThunk, CategoryTable } from '@categories';
import { useAppDispatch, useAppSelector } from '@hooks';
import { DynamicPieChart, Pagination, SearchBar } from '@common';
import { productThunk, selectProductStats } from '@products';

export const CategoriesPage = () => {
	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);

	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectCategoryPagination);

	const productStats = useAppSelector(selectProductStats);

	useEffect(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

	useEffect(() => {
		dispatch(categoryThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const noop = () => {};

	return (
		<section className="flex flex-col lg:flex-row">
			<section className=" w-full lg:max-w-2/3">
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

			<DynamicPieChart data={productStats.categories} />
		</section>
	);
};
