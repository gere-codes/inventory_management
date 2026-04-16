import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SearchBar, Pagination } from '@common';
import { selectProducts, selectProductsPagination, ProductTable, productThunk, type TProduct } from '@products';
import { Button } from '@ui';
export const ProductsPage = () => {
	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectProductsPagination);

	useEffect(() => {
		dispatch(productThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const handleDelete = async (product: TProduct) => {};
	const handleOrder = async (product: TProduct) => {};
	const handleEdit = async (product: TProduct) => {};

	const handlePage = () => {};
	const handlePerpage = () => {};

	return (
		<section className="py-2">
			<section className="flex justify-between items-end">
				<section className="flex flex-col gap-4 flex-1">
					<h2 className="text-xl font-bold">Products List</h2>
					<section>
						<SearchBar value={term} onSearch={(newValue) => setTerm(newValue)} placeholder="Search..." />
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
				onPageChange={handlePage}
				onPerPageChange={handlePerpage}
			/>
		</section>
	);
};
