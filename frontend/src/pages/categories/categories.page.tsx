import { useEffect, useMemo, useState } from 'react';
import {
	selectCategories,
	selectCategoryPagination,
	categoryThunk,
	CategoryTable,
	setCategoriesPerPage,
	setCurrentCategoryPage,
	type TCategory,
	categoryQuerySchema,
} from '@categories';
import { useAppDispatch, useAppSelector } from '@hooks';
import { DynamicPieChart, EModalMode, EModalType, openModal, Pagination, SearchBar } from '@common';
import { productThunk, selectProductStats } from '@products';
import { debounce } from '@utils';
import { Button } from '@ui';
import { useSearchParams } from 'react-router';

export const CategoriesPage = () => {
	const FIRST_PAGE = 1;

	const [term, setTerm] = useState<string>('');
	const [searchParams, setSearchParams] = useSearchParams();

	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);

	const { totalItems, totalPages } = useAppSelector(selectCategoryPagination);

	const productStats = useAppSelector(selectProductStats);

	const page = Number(searchParams.get('page')) || 1;
	const limit = Number(searchParams.get('limit')) || 10;
	const search = searchParams.get('search') || term;
	const categoryId = searchParams.get('categoryId') || '';

	useEffect(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

	useEffect(() => {
		const fetchTableData = async () => {
			setTerm(search);

			const payload = {
				search,
				page,
				limit,
			};

			const result = categoryQuerySchema.safeParse(payload);

			if (!result.success) {
				console.error(result.error);
				return;
			}

			await dispatch(categoryThunk.getCollection(result.data));
		};

		fetchTableData();
	}, [dispatch, page, limit]);

	const handleDelete = (category: TCategory) => {
		dispatch(openModal({ data: category, mode: EModalMode.DELETE, type: EModalType.CATEGORY }));
	};

	const handlePageChange = (pageNum: number) => {
		searchParams.set('page', String(pageNum));
		setSearchParams(searchParams);
	};

	const handlePerPageChange = (perPage: number) => {
		searchParams.set('limit', String(perPage));
		setSearchParams(searchParams);
	};

	//debounce
	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				const payload = {
					search: term,
					page: FIRST_PAGE,
					limit,
				};

				const result = categoryQuerySchema.safeParse(payload);

				if (!result.success) {
					console.error(result.error);
					return;
				}

				dispatch(categoryThunk.getCollection(result.data));

				searchParams.set('page', String(FIRST_PAGE));
				searchParams.set('search', term);

				setSearchParams(searchParams);
			}, 500),
		[dispatch, limit, searchParams, setSearchParams, page],
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
						currentPage={page}
						totalPages={totalPages}
						itemsPerPage={limit}
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
