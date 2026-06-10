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

	return { filters, searchParams, setSearchParams };
};

export const useFetchData = <TEntity, TQuery extends TBaseQuery = TBaseQuery>({
	schema,
	thunkAction,
	selectData,
	selectStatus,
	selectPagination,
}: {
	schema: z.ZodSchema<TQuery>;
	thunkAction: AsyncThunk<any, TQuery, any>;
	selectData: (state: any) => TEntity[];
	selectStatus: (state: any) => string;
	selectPagination: (state: any) => any;
}) => {
	const dispatch = useAppDispatch();
	const { filters } = useQueryParams({ schema });

	const data = useAppSelector(selectData);
	const status = useAppSelector(selectStatus);
	const pagination = useAppSelector(selectPagination);

	const fetchData = useCallback(async () => {
		await dispatch(thunkAction(filters as unknown as TQuery & undefined));
	}, [dispatch, filters, thunkAction]);

	return {
		fetchData,
		data,
		status,
		pagination,
	};
};

export const usePaginationParams = <TQuery extends TBaseQuery = TBaseQuery>({
	setSearchParams,
}: {
	setSearchParams: SetURLSearchParams;
}) => {
	// Dynamic setter
	const setParam = <K extends Extract<keyof TQuery, string>>(key: K, value: TQuery[K]) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);

			if (value === undefined || value === null || value === '') {
				newParams.delete(key);
			} else {
				newParams.set(key, String(value));
			}

			return newParams;
		});
	};

	// Sets a limit to the number of items per page
	const setLimit = (limit: number) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set('limit', String(limit));
			newParams.set('page', String(FIRST_PAGE));
			return newParams;
		});
	};

	// Sets the current page as paginating
	const setPage = (page: number) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set('page', String(page));
			return newParams;
		});
	};

	// Rests the URL params
	const resetFilters = () => {
		setSearchParams(new URLSearchParams());
	};

	return {
		setParam,
		setPage,
		setLimit,
		resetFilters,
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
	const { filters, searchParams, setSearchParams } = useQueryParams<TQuery>({ schema });

	// Pagination
	const {
		setParam,
		setPage,
		setLimit,
		resetFilters: clearUrlFilters,
	} = usePaginationParams<TQuery>({ setSearchParams });

	// Fetch Data
	const { fetchData, data, pagination, status } = useFetchData({
		schema,
		selectData,
		selectStatus,
		selectPagination,
		thunkAction,
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
		setParam,
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
