export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
}

export interface ICollectionResult<T> {
	items: T[];
	pagination?: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
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
		isPaginated?: boolean;
	};

	filter?: Record<string, any>;
	search?: string;

	context?: {
		userId?: string;
	};
}
