import { selectProducts, selectProductsPagination } from '@products/product.selectors';
import { privateInstance } from '@/shared/api/instance.api';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { useEffect, useState } from 'react';
import { productThunk } from '@products/product.thunk';
import { SearchBar } from '@common/search-bar.common';
import { InputField } from '@/shared/components/ui';
import type { TProduct } from '@/features/products/product.schema';
import { ProductTable } from '@/features/products/components/product.table';

export const ProductsPage = () => {
	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage } = useAppSelector(selectProductsPagination);

	useEffect(() => {
		dispatch(productThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const handleDelete = async (product: TProduct) => {};
	const handleOrder = async (product: TProduct) => {};
	const handleEdit = async (product: TProduct) => {};

	return (
		<section>
			<SearchBar value={term} onSearch={(newValue) => setTerm(newValue)} placeholder="Search Product..." />
			<ProductTable products={products} onDelete={handleDelete} onEdit={handleEdit} onOrder={handleOrder} />
		</section>
	);
};
