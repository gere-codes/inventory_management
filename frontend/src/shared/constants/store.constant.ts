import type { BaseState } from '../base';

export const createIinitialBaseState = <T>(): BaseState<T> => ({
	list: {
		data: [],
		status: 'idle',
		error: null,
	},
	item: {
		data: {} as any,
		status: 'idle',
		error: null,
	},
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalItems: 0,
		totalPages: 1,
	},
});
