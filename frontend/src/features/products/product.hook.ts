import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAppDispatch } from '@hooks';
import { productThunk } from './product.thunk';
import { productQuerySchema, type TProduct, type TProductQueryInput, type TProductQueryOutput } from './product.schema';
import { debounce } from '@utils';
import { EModalMode, EModalType, openModal } from '@common';
import { EOrderStatus, EOrderType, type TOrderForm } from '../orders';
import { ECRUDMode } from '@enums';

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
					...filters,
					search: term,
					page: FIRST_PAGE,
				};
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

	// Fetch the product stats
	useEffect(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

	return { filters, setParam, resetFilters, fetchProducts, debouncedSearch, handleTerm, term, setLimit, setPage };
};

export const useProductHandlers = ({
	setLimit,
	setPage,
}: {
	setLimit: (limit: number) => void;
	setPage: (page: number) => void;
}) => {
	const dispatch = useAppDispatch();

	const handleDelete = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.DELETE }));
	};

	const handleEdit = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.EDIT }));
	};
	const handleReorder = async (product: TProduct) => {
		const data: TOrderForm = {
			...product,
			productId: product.id,
			quantity: 1,
			mode: ECRUDMode.CREATE,
			status: EOrderStatus.PENDING,
			type: EOrderType.REORDER,
		};

		dispatch(openModal({ data, type: EModalType.ORDER, mode: EModalMode.CREATE }));
	};

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	const handleLimitChange = (limit: number) => {
		setLimit(limit);
	};

	const handleAddProduct = () => {
		dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.PRODUCT }));
	};

	return {
		handleDelete,
		handleEdit,
		handlePageChange,
		handleLimitChange,
		handleReorder,
		handleAddProduct,
	};
};
