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
