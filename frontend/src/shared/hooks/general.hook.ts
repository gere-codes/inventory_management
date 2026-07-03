import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, type SetURLSearchParams } from 'react-router';
import z from 'zod';
import type { TBaseQuery } from '../schema';
import { debounce } from '../utils';
import { useAppDispatch, useAppSelector } from './redux.hook';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { TBaseState } from '../base';

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

	// Update with debounce
	const updateParamsDebounce = useDebouncedCallback(updateParams, 300);

	// Rests the URL params
	const resetFilters = () => {
		setSearchParams(new URLSearchParams());
	};

	return { filters, searchParams, setSearchParams, resetFilters, updateParams, updateParamsDebounce };
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

export const useDebouncedCallback = <TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	delay: number = 300,
) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debouncedCallback = useCallback(
		(...args: TArgs) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
};

// Search with debounce
export const useUrlSearch = <TQuery extends TBaseQuery = TBaseQuery>({ schema }: { schema: z.ZodType<TQuery> }) => {
	const [searchTerm, setSearchTerm] = useState<string>('');

	const { updateParamsDebounce, searchParams } = useQueryParams({ schema });

	// Persists the searchTerm state
	const searchParam = searchParams.get('search') || '';
	useEffect(() => {
		setSearchTerm(searchParam);
	}, [searchParam]);

	// Handle Search change
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		updateParamsDebounce({ search: value, page: 1 });
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
	const { handleSearchChange, searchTerm } = useUrlSearch({ schema });

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

export const useFetchStats = <T, TStats>({
	thunkAction,
	selectStatsState,
}: {
	selectStatsState: (state: RootState) => TBaseState<T, TStats>['stats'];
	thunkAction: AsyncThunk<TStats, void, { rejectValue: string }>;
}) => {
	const dispatch = useAppDispatch();
	const statsState = useAppSelector(selectStatsState);

	const fetchStats = useCallback(() => {
		dispatch(thunkAction());
	}, [dispatch, thunkAction]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return { ...statsState, fetchStats };
};
