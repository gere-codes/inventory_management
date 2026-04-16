import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SearchBar, Pagination } from '@common';
import {
	selectProducts,
	selectProductsPagination,
	ProductTable,
	productThunk,
	type TProduct,
	setItemsPerPage,
} from '@products';
import { Button } from '@ui';
import { debounce } from '@utils';
import { setCurrentPage } from '@products';
export const ProductsPage = () => {
	const FIRST_PAGE = 1;

	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectProductsPagination);

	console.log(currentPage);
	useEffect(() => {
		dispatch(productThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(productThunk.search({ term, page: FIRST_PAGE, limit: itemsPerPage }));
			}, 500),
		[dispatch, itemsPerPage],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleDelete = async (product: TProduct) => {};
	const handleOrder = async (product: TProduct) => {};
	const handleEdit = async (product: TProduct) => {};

	const handlePageChange = (pageNum: number) => {
		dispatch(setCurrentPage(pageNum));
	};

	const handlePerPageChange = (perPage: number) => {
		dispatch(setItemsPerPage(perPage));
		dispatch(setCurrentPage(currentPage));
	};

	return (
		<section className="py-2">
			<section className="flex justify-between items-end">
				<section className="flex flex-col gap-4 flex-1">
					<h2 className="text-xl font-bold">Products List</h2>
					<section>
						<SearchBar
							value={term}
							onSearch={(newValue) => {
								setTerm(newValue);
								debouncedSearch(newValue);
							}}
							placeholder="Search..."
						/>
					</section>
				</section>
				<Button
					className="w-fit flex justify-center items-center gap-1 text-white"
					style={{
						width: 138,
						height: 40,
					}}
				>
					+ Add Product
				</Button>
			</section>
			<ProductTable products={products} onDelete={handleDelete} onEdit={handleEdit} onOrder={handleOrder} />
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onPerPageChange={handlePerPageChange}
			/>
		</section>
	);
};
