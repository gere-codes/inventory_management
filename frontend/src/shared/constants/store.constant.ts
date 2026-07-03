import type { TBaseState } from '../base';

export const createIinitialBaseState = <T, TStats>(): TBaseState<T, TStats> => ({
	list: {
		data: [],
		status: 'idle',
		error: null,
	},
	item: {
		data: null,
		status: 'idle',
		error: null,
	},
	stats: {
		data: null,
		status: 'idle',
		error: null,
	},
	pagination: {
		page: 1,
		limit: 10,
		totalItems: 0,
		totalPages: 1,
	},
});
