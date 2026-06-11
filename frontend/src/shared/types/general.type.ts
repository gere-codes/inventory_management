export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
}

export interface IPagination {
	page: number;
	limit: number;
	totalPages: number;
	totalItems: number;
}
export interface ICollectionResult<T> {
	data: T[];
	pagination?: IPagination;
}

export interface IParams {
	pagination?: {
		limit: number;
		page: number;
		isPaginated: boolean;
	};

	search?: string;
	filter?: Record<string, any>;
}
