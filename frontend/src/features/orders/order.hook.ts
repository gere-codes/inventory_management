import { useAppDispatch, useCollectionFilter } from '@/shared/hooks';
import { orderQuerySchema, type TOrder } from './order.schema';
import { selectOrderList, selectOrderPagination, selectOrderListStatus } from './order.selector';
import { orderThunk } from './order.thunk';
import { EModalMode, EModalType, openModal } from '@/shared/components/common';

export const useOrderFilter = () => {
	const {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handleSearchChange,
		pagination,
		resetFilters,
		handlePageChange,
		handleLimitChange,
		setParam,
		status,
		data,
	} = useCollectionFilter({
		schema: orderQuerySchema,
		thunkAction: orderThunk.getCollection,
		selectData: selectOrderList,
		selectPagination: selectOrderPagination,
		selectStatus: selectOrderListStatus,
	});

	return {
		filters,
		setLimit,
		setPage,
		fetchData,
		searchTerm,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		pagination,
		resetFilters,
		setParam,
		status,
		data,
	};
};
