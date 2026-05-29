import { useAppDispatch } from '@/shared/hooks';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { productThunk } from './product.thunk';
import { productUrlParamsSchema, type TProductUrlParams } from './product.schema';

export const useProductTable = () => {
	const [searchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	const fetchProducts = useCallback(async () => {
		const rawParams: Record<string, string> = {};

		searchParams.forEach((value, key) => {
			rawParams[key] = value;
		});

		const result = productUrlParamsSchema.safeParse(rawParams);

		if (!result.success) {
			console.warn('Invalid products URL params:', result.error);

			throw Error('Invalid product URL param');
		}

		const params: TProductUrlParams = result.data;

		await dispatch(
			productThunk.getCollection({
				pagination: {
					page: params.page,
					limit: params.limit,
					disabled: false,
				},
				search: params.search,
				filter: {
					categoryId: params.categoryId,
					status: params.status,
				},
			}),
		);
	}, [searchParams, dispatch]);

	return { fetchProducts };
};
