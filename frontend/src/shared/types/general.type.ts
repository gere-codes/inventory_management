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
	data: T[];
	pagination?: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
	};
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
