import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SearchBar, Pagination, openModal, EModalType, EModalMode, DynamicPieChart } from '@common';
import {
	selectProducts,
	selectProductsPagination,
	ProductTable,
	productThunk,
	type TProduct,
	setItemsPerPage,
	selectProductStats,
} from '@products';
import { Button } from '@ui';
import { debounce } from '@utils';
import { setCurrentPage } from '@products';
import { IoTrendingDownOutline } from 'react-icons/io5';

export const ProductsPage = () => {
	const FIRST_PAGE = 1;

	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectProductsPagination);

	const productStats = useAppSelector(selectProductStats);

	useEffect(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

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

	const handleDelete = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.DELETE }));
	};
	const handleOrder = async (product: TProduct) => {};

	const handleEdit = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.EDIT }));
	};

	const handlePageChange = (pageNum: number) => {
		dispatch(setCurrentPage(pageNum));
	};

	const handlePerPageChange = (perPage: number) => {
		dispatch(setItemsPerPage(perPage));
		dispatch(setCurrentPage(currentPage));
	};

	return (
		<section className="py-2">
			<section className="my-2 flex gap-6">
				<section className=" bg-green-50 h-[145px] w-[350px] text-left text-green-900 p-2 rounded-lg shadow-sm flex gap-2 items-center">
					<span className="p-2 bg-green-200 rounded">
						<IoTrendingDownOutline size={30} />
					</span>

					<div>
						<span>{productStats?.lowStock}</span>
						<h2 className="text-sm ">Low in Stock</h2>
					</div>
				</section>
				<section className=" bg-red-50 h-[145px] w-[350px]  text-left text-red-600 p-2 rounded-lg shadow-sm flex gap-2 items-center">
					<span className="p-2 bg-red-200 rounded">
						<IoTrendingDownOutline size={30} />
					</span>

					<div>
						<span>{productStats?.outOfStock}</span>
						<h2 className="text-sm ">Out of Stock</h2>
					</div>
				</section>
				<DynamicPieChart data={productStats?.categories} />
			</section>
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
					onClick={() => {
						dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.PRODUCT }));
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
