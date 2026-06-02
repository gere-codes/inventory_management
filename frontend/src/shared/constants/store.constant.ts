import type { BaseState } from '../base';

export const createIinitialBaseState = <T>(): BaseState<T> => ({
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
	pagination: {
		page: 1,
		limit: 10,
		totalItems: 0,
		totalPages: 1,
	},
});
