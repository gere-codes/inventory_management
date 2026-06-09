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
