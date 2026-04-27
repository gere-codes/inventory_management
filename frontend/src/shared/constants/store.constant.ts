import type { BaseState } from '../base';

export const createIinitialBaseState = <T>(): BaseState<T> => ({
	items: [],
	item: null,
	status: 'idle',
	error: null,
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalItems: 0,
		totalPages: 1,
	},
});
