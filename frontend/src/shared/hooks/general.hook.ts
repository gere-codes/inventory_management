import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, type SetURLSearchParams } from 'react-router';
import z from 'zod';
import type { TBaseQuery } from '../schema';
import { debounce } from '../utils';
import { useAppDispatch, useAppSelector } from './redux.hook';
import type { AsyncThunk } from '@reduxjs/toolkit';

const FIRST_PAGE = 1;

export const useQueryParams = <TQuery extends TBaseQuery = TBaseQuery>({ schema }: { schema: z.ZodSchema<TQuery> }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(() => {
		try {
			const queryParams = Object.fromEntries(searchParams.entries());
			return schema.parse(queryParams);
		} catch (error) {
			console.error(error);
			return schema.parse({});
		}
	}, [searchParams, schema]);

	// Updates the params
	const updateParams = <TQuery extends TBaseQuery = TBaseQuery>(params: Partial<TQuery>) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);

			Object.entries(params).forEach(([key, value]) => {
				if (value === undefined || value === null || value === '') {
					newParams.delete(key);
				} else {
					newParams.set(key, String(value));
				}
			});
			return newParams;
		});
	};

	// Rests the URL params
	const resetFilters = () => {
		setSearchParams(new URLSearchParams());
	};

	return { filters, searchParams, setSearchParams, resetFilters, updateParams };
};

export const useFetchData = <TEntity, TQuery extends TBaseQuery = TBaseQuery>({
	schema,
	thunkAction,
	selectData,
	selectStatus,
	selectPagination,
	onPageNormalized,
}: {
	schema: z.ZodSchema<TQuery>;
	thunkAction: AsyncThunk<any, TQuery, any>;
	selectData: (state: any) => TEntity[];
	selectStatus: (state: any) => string;
	selectPagination: (state: any) => any;
	onPageNormalized?: (backendPage: number) => void;
}) => {
	const dispatch = useAppDispatch();
	const { filters } = useQueryParams({ schema });

	const data = useAppSelector(selectData);
	const status = useAppSelector(selectStatus);
	const pagination = useAppSelector(selectPagination);

	const fetchData = useCallback(async () => {
		await dispatch(thunkAction(filters as unknown as TQuery & undefined));
	}, [dispatch, filters, thunkAction]);

	useEffect(() => {
		if (status !== 'succeeded') return;
		if (!pagination) return;

		if (onPageNormalized) {
			onPageNormalized(pagination.page);
		}
	}, [status, pagination.page]);

	return {
		fetchData,
		data,
		status,
		pagination,
	};
};

export const usePaginationParams = <TQuery extends TBaseQuery = TBaseQuery>({
	schema,
}: {
	schema: z.ZodSchema<TQuery>;
}) => {
	const { updateParams } = useQueryParams({ schema });

	// Sets a limit to the number of items per page
	// And resets the page to 1
	const setLimit = (limit: number) => {
		updateParams({ limit, page: 1 });
	};

	// Sets the current page as paginating
	const setPage = (page: number) => {
		updateParams({ page });
	};

	return {
		setPage,
		setLimit,
	};
};

export const useDebouncedCallback = <T extends (...args: any[]) => any>(callback: T, delay: number) => {
	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const engineRef = useRef<{
		run: (...args: Parameters<T>) => void;
		cancel: () => void;
	} | null>(null);

	useEffect(() => {
		const inst = debounce((...args: Parameters<T>) => {
			callbackRef.current(...args);
		}, delay);

		engineRef.current = {
			run: inst,
			cancel: inst.cancel,
		};

		return () => {
			inst.cancel();
		};
	}, [delay]);

	return useCallback((...args: Parameters<T>) => {
		engineRef.current?.run(...args);
	}, []);
};

// Search with debounce
export const useSearch = ({
	searchParams,
	setSearchParams,
	delay = 500,
}: {
	searchParams: URLSearchParams;
	setSearchParams: SetURLSearchParams;
	delay?: number;
}) => {
	const [searchTerm, setSearchTerm] = useState<string>('');

	// Persists the searchTerm state
	const searchParam = searchParams.get('search') || '';
	useEffect(() => {
		setSearchTerm(searchParam);
	}, [searchParam]);

	const debouncedSearchUpdate = useDebouncedCallback((nextTerm: string) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);

			if (!nextTerm) {
				newParams.delete('search');
			} else {
				newParams.set('search', nextTerm);
			}

			newParams.set('page', '1');
			return newParams;
		});
	}, delay);

	// Handle Search change
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		debouncedSearchUpdate(value);
	};

	return {
		handleSearchChange,
		searchTerm,
	};
};

interface IUseCollectionFilter<TEntity, TQuery extends TBaseQuery = TBaseQuery> {
	schema: z.ZodSchema<TQuery>;
	thunkAction: AsyncThunk<any, TQuery, any>;
	selectData: (state: any) => TEntity[];
	selectStatus: (state: any) => string;
	selectPagination: (state: any) => any;
}

export const useCollectionFilter = <TEntity, TQuery extends TBaseQuery = TBaseQuery>({
	schema,
	thunkAction,
	selectData,
	selectStatus,
	selectPagination,
}: IUseCollectionFilter<TEntity, TQuery>) => {
	// Params
	const {
		filters,
		searchParams,
		setSearchParams,
		updateParams,
		resetFilters: clearUrlFilters,
	} = useQueryParams<TQuery>({ schema });

	// Pagination
	const { setPage, setLimit } = usePaginationParams<TQuery>({ schema });

	// Fetch Data
	const { fetchData, data, pagination, status } = useFetchData({
		schema,
		selectData,
		selectStatus,
		selectPagination,
		thunkAction,
		onPageNormalized: (backendPage) => {
			const frontendPage = Number(searchParams.get('page') ?? 1);
			if (backendPage !== frontendPage) {
				setPage(backendPage);
			}
		},
	});
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Seach
	const { handleSearchChange, searchTerm } = useSearch({ searchParams, setSearchParams });

	return {
		// Search
		searchTerm,
		handleSearchChange,

		// filters and pagination
		updateParams,
		setPage,
		setLimit,
		filters,

		// data
		data,
		status,
		pagination,

		// Actions
		fetchData,
		resetFilters: () => {
			clearUrlFilters();
		},
	};
};
