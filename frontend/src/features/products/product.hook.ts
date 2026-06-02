import { useAppDispatch } from '@/shared/hooks';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { productThunk } from './product.thunk';
import { productQuerySchema, type TProductQuery } from './product.schema';

export const useProductTable = () => {
	const [searchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	const fetchProducts = useCallback(async () => {
		const rawParams: Record<string, string> = {};

		searchParams.forEach((value, key) => {
			rawParams[key] = value;
		});

		const result = productQuerySchema.safeParse(rawParams);

		if (!result.success) {
			console.warn('Invalid products URL params:', result.error);
			throw Error('Invalid product URL param', result.error);
		}

		await dispatch(productThunk.getCollection(result.data));
	}, [searchParams, dispatch]);

	return { fetchProducts };
};
