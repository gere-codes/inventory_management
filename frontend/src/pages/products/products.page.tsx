import { selectProducts, selectProductsPagination } from '@products/product.selectors';
import { privateInstance } from '@/shared/api/instance.api';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { useEffect } from 'react';
import { productThunk } from '@products/product.thunk';

export const ProductsPage = () => {
	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, totalItems, itemsPerPage } = useAppSelector(selectProductsPagination);

	console.log(products);

	useEffect(() => {
		dispatch(productThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage, totalItems]);

	return (
		<section>
			<h1>Home page</h1>
		</section>
	);
};
