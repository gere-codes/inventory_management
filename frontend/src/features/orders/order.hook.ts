import { useAppDispatch, useCollectionFilter, useFetchData } from '@/shared/hooks';
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
		handleSearchChange,
		pagination,
		resetFilters,
		status,
		data,
	};
};

export const useOrderHanlders = ({ fetchData }: { fetchData: () => void }) => {
	const dispatch = useAppDispatch();

	const handleEdit = async (order: TOrder) => {
		dispatch(openModal({ data: order, type: EModalType.ORDER, mode: EModalMode.EDIT }));
		fetchData();
	};
	const handleAdd = async () => {
		dispatch(openModal({ data: null, type: EModalType.ORDER, mode: EModalMode.CREATE }));
		fetchData();
	};

	return {
		handleEdit,
		handleAdd,
	};
};

export const useOrderData = () => {
	const products = useFetchData({
		schema: orderQuerySchema,
		thunkAction: orderThunk.getCollection,
		selectData: selectOrderList,
		selectPagination: selectOrderPagination,
		selectStatus: selectOrderListStatus,
	});
	return products;
};
