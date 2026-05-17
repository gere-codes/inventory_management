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
import { debounce } from '@utils';
import { Button } from '@ui';

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

	const handleDelete = (category: TCategory) => {
		dispatch(openModal({ data: category, mode: EModalMode.DELETE, type: EModalType.CATEGORY }));
	};

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
		<section className=" pt-4 h-full">
			<section className="flex flex-col-reverse lg:flex-row lg:h-full">
				<section className="flex flex-col justify-between">
					<section className="">
						{/* Search */}
						<section className="flex flex-col gap-2 ">
							<h2 className="font-bold text-xl">Categories List</h2>
							<section className="flex justify-between">
								<SearchBar
									value={term}
									onSearch={(newValue) => {
										setTerm(newValue);
										debouncedSearch(newValue);
									}}
									placeholder="Search..."
								/>

								<Button
									onClick={() =>
										dispatch(
											openModal({
												data: null,
												mode: EModalMode.CREATE,
												type: EModalType.CATEGORY,
											}),
										)
									}
									style={{ width: 150, height: 40 }}
								>
									+ Add Category
								</Button>
							</section>
						</section>
						{/* Table */}
						<CategoryTable categories={categories} onDelete={handleDelete} onEdit={handleEdit} />
					</section>
					{/* Pagination */}
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						itemsPerPage={itemsPerPage}
						onPageChange={handlePageChange}
						onPerPageChange={handlePerPageChange}
					/>
				</section>

				<section className="lg:mt-10">
					<h2 className="text-center font-bold text-gray-600">Products by Categories</h2>
					<DynamicPieChart data={productStats.categories} />
				</section>
			</section>
		</section>
	);
};
