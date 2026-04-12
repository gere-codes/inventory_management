import { selectProducts, selectProductsPagination } from '@products/product.selectors';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { useEffect, useState } from 'react';
import { productThunk } from '@products/product.thunk';
import { SearchBar, Pagination } from '@common/index';
import type { TProduct } from '@products/product.schema';
import { ProductTable } from '@products/components/product.table';

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
		<section>
			<SearchBar value={term} onSearch={(newValue) => setTerm(newValue)} placeholder="Search Product..." />
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
