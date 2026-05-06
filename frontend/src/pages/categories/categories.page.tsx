import { useEffect, useMemo, useState } from 'react';
import {
	selectCategories,
	selectCategoryPagination,
	categoryThunk,
	CategoryTable,
	setCategoriesPerPage,
	setCurrentCategoryPage,
	type TCategory,
} from '@categories';
import { useAppDispatch, useAppSelector } from '@hooks';
import { DynamicPieChart, EModalMode, EModalType, openModal, Pagination, SearchBar } from '@common';
import { productThunk, selectProductStats } from '@products';
import { debounce } from '@/shared/utils';

export const CategoriesPage = () => {
	const [term, setTerm] = useState<string>('');
	const FIRST_PAGE = 1;

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

	const handlePageChange = (pageNum: number) => {
		dispatch(setCurrentCategoryPage(pageNum));
	};

	const handlePerPageChange = (perPage: number) => {
		dispatch(setCategoriesPerPage(perPage));
	};

	//debounce
	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(categoryThunk.search({ term, page: FIRST_PAGE, limit: itemsPerPage }));
			}, 500),
		[dispatch, itemsPerPage],
	);
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleEdit = (category: TCategory) => {
		dispatch(
			openModal({
				data: category,
				type: EModalType.CATEGORY,
				mode: EModalMode.EDIT,
			}),
		);
	};

	return (
		<section className="flex flex-col lg:flex-row">
			<section className=" w-full lg:max-w-2/3">
				<SearchBar
					value={term}
					onSearch={(newValue) => {
						setTerm(newValue);
						debouncedSearch(newValue);
					}}
					placeholder="Search Product..."
				/>
				<CategoryTable categories={categories} onDelete={noop} onEdit={handleEdit} />
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					itemsPerPage={itemsPerPage}
					onPageChange={handlePageChange}
					onPerPageChange={handlePerPageChange}
				/>
			</section>

			<DynamicPieChart data={productStats.categories} />
		</section>
	);
};
