export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
}

export interface QueryOptions {
	page?: number;
	limit?: number;
	userId?: string;
	term?: string;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
}
export interface IQueryOptions {
	pagination?: {
		page?: number;
		limit?: number;
		disabled?: boolean;
	};

	filter?: {
		minPrice?: number;
		maxPrice?: number;
		categoryId?: string;
	};
	search?: string;

	context?: {
		userId?: string;
	};
}
