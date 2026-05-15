import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { debounce } from '@utils';
import { Button } from '@ui';
import { EModalMode, EModalType, openModal, Pagination, SearchBar } from '@common';
import { OrderTable, orderThunk, selectOrderList, selectOrderPagination } from '@orders';

export const OrdersPage = () => {
	const FIRST_PAGE = 1;
	const [term, setTerm] = useState<string>('');

	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectOrderPagination);
	const orders = useAppSelector(selectOrderList);
	const dispatch = useAppDispatch();

	const noop = () => {};

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(orderThunk.search({ term, page: FIRST_PAGE, limit: itemsPerPage }));
			}, 500),
		[dispatch, itemsPerPage],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	useEffect(() => {
		dispatch(orderThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	return (
		<section className="py-4 space-y-6">
			{/* Search + Add */}
			<section className="flex justify-between items-end">
				<div className="flex flex-col gap-2 flex-1">
					<h2 className="text-xl font-bold">Orders List</h2>
					<SearchBar
						value={term}
						onSearch={(newValue) => {
							setTerm(newValue);
							debouncedSearch(newValue);
						}}
						placeholder="Search..."
					/>
				</div>

				<Button
					className="w-fit flex items-center gap-1 text-white"
					style={{ width: 138, height: 40 }}
					onClick={() => dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.ORDER }))}
				>
					+ Add Order
				</Button>
			</section>
			<OrderTable orders={orders} onDelete={noop} onEdit={noop} onOrder={noop} />

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsPerPage={itemsPerPage}
				onPageChange={noop}
				onPerPageChange={noop}
			/>
		</section>
	);
};
