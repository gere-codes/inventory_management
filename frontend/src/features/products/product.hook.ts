import { useAppDispatch } from '@/shared/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { productThunk } from './product.thunk';
import {
	productQuerySchema,
	type TProductQuery,
	type TProductQueryInput,
	type TProductQueryOutput,
} from './product.schema';
import { debounce } from '@/shared/utils';

const FIRST_PAGE = 1;

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

export const useProductQuery = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [term, setTerm] = useState<string>('');
	const dispatch = useAppDispatch();

	// converts URLSearchParams to Zod schema
	const convertToFilters = (): TProductQueryOutput => {
		const rawParams: Record<string, any> = {};

		searchParams.forEach((value, key) => {
			rawParams[key] = value;
		});

		try {
			return productQuerySchema.parse(rawParams);
		} catch (error) {
			return productQuerySchema.parse({});
		}
	};

	const filters = convertToFilters();

	// Dynamic setter
	const setParam = <K extends keyof TProductQueryInput>(key: K, value: TProductQueryInput[K]) => {
		setSearchParams((prev) => {
			prev.set(key, String(value));
			return prev;
		});
	};

	const setLimit = (limit: number) => {
		setSearchParams((prev) => {
			prev.set('limit', String(limit));
			prev.set('page', String(FIRST_PAGE));
			return prev;
		});
	};

	const setPage = (page: number) => {
		setSearchParams((prev) => {
			prev.set('page', String(page));
			return prev;
		});
	};

	// Rests the URL params
	const resetFilters = () => {
		setSearchParams(new URLSearchParams());
	};

	const fetchProducts = useCallback(() => {
		dispatch(productThunk.getCollection(filters));
	}, [filters, dispatch]);

	useEffect(() => {
		fetchProducts();
	}, [JSON.stringify(filters)]);

	// Debounced search function
	const debouncedSearch = useMemo(
		() =>
			debounce((term: string) => {
				const payload = {
					search: term,
					page: FIRST_PAGE,
				};
				console.log(payload);
				const result = productQuerySchema.safeParse(payload);

				if (!result.success) {
					console.error(result);
					return;
				}

				dispatch(productThunk.getCollection(result.data));

				// Update URL parameters
				setSearchParams((prev) => {
					prev.set('page', String(FIRST_PAGE));
					prev.set('search', term);
					return prev;
				});
			}, 500),
		[dispatch, filters, setSearchParams],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleTerm = (seachTer: string) => {
		setTerm(seachTer);
	};

	// Persist search term when the page reloads
	const searchQuery = searchParams.get('search') || '';
	useEffect(() => {
		setTerm(searchQuery);
	}, [searchQuery]);

	return { filters, setParam, resetFilters, fetchProducts, debouncedSearch, handleTerm, term, setLimit, setPage };
};
