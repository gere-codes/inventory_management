import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, type SetURLSearchParams } from 'react-router';
import z from 'zod';
import type { TBaseQuery } from '../schema';
import { debounce } from '../utils';
import { useAppDispatch, useAppSelector } from './redux.hook';
import type { AsyncThunk } from '@reduxjs/toolkit';

const FIRST_PAGE = 1;

export const useQueryParams = <TQuery extends TBaseQuery = TBaseQuery>({
	schema,
	searchParams,
}: {
	schema: z.ZodSchema<TQuery>;
	searchParams: URLSearchParams;
}) => {
	const filters = useMemo(() => {
		try {
			const queryParams = Object.fromEntries(searchParams.entries());
			return schema.parse(queryParams);
		} catch (error) {
			console.error(error);
			return schema.parse({});
		}
	}, [searchParams, schema]);

	return { filters, searchParams };
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
	const dispatch = useAppDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState<string>('');

	const data = useAppSelector(selectData);
	const status = useAppSelector(selectStatus);
	const pagination = useAppSelector(selectPagination);

	const { filters } = useQueryParams<TQuery>({ schema, searchParams });
	const {
		setParam,
		setPage,
		setLimit,
		resetFilters: clearUrlFilters,
	} = usePaginationParams<TQuery>({ setSearchParams });

	// Persists the search term state
	const searchParam = searchParams.get('search') || '';
	useEffect(() => {
		setSearchTerm(searchParam);
	}, [searchParam]);

	const fetchData = useCallback(() => {
		dispatch(thunkAction(filters as unknown as TQuery & undefined));
	}, [filters, dispatch, thunkAction]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
	}, 500);

	// Handle Search change
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		debouncedSearchUpdate(value);
	};

	// handle pagination
	const handlePageChange = (page: number) => {
		setPage(page);
	};

	// handle limit
	const handleLimitChange = (page: number) => {
		setLimit(page);
	};

	return {
		searchTerm,
		filters,
		data,
		status,
		pagination,

		fetchData,
		handleSearchChange,
		setPage,
		setLimit,
		setParam,
		handlePageChange,
		handleLimitChange,
		resetFilters: () => {
			setSearchTerm('');
			clearUrlFilters();
		},
	};
};
