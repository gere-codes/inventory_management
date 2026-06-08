import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { debounce } from '@utils';
import { Button } from '@ui';
import { EModalMode, EModalType, openModal, Pagination, SearchBar } from '@common';
import { orderQuerySchema, OrderTable, orderThunk, selectOrderList, selectOrderPagination, type TOrder } from '@orders';
import { setCurrentOrderPage, setOrdersPerPage } from '@/features/orders/order.slice';
import { useSearchParams } from 'react-router';

export const OrdersPage = () => {
	const FIRST_PAGE = 1;

	const [term, setTerm] = useState<string>('');
	const [searchParams, setSearchParams] = useSearchParams();

	const { totalPages, totalItems } = useAppSelector(selectOrderPagination);
	const orders = useAppSelector(selectOrderList);
	const dispatch = useAppDispatch();

	const page = Number(searchParams.get('page')) || 1;
	const limit = Number(searchParams.get('limit')) || 10;
	const search = searchParams.get('search') || term;
	const categoryId = searchParams.get('categoryId') || undefined;

	useEffect(() => {
		const fetchTableData = async () => {
			setTerm(search);

			const payload = {
				search,
				page,
				limit,
				categoryId,
				sort: 'createdAt',
				order: 'desc',
			};

			const result = orderQuerySchema.safeParse(payload);
			if (!result.success) {
				console.error(result.error);
				return;
			}
			await dispatch(orderThunk.getCollection(result.data));
		};

		fetchTableData();
	}, [dispatch, page, limit, categoryId]);

	const noop = () => {};

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				const payload = {
					search: term,
					page: FIRST_PAGE,
					limit,
					categoryId,
					sort: 'createdAt',
					order: 'desc',
				};

				const result = orderQuerySchema.safeParse(payload);
				if (!result.success) {
					console.error(result.error);
					return;
				}
				dispatch(orderThunk.getCollection(result.data));

				searchParams.set('page', String(FIRST_PAGE));
				searchParams.set('search', term);

				setSearchParams(searchParams);
			}, 500),
		[dispatch, limit, categoryId, searchParams, setSearchParams],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleEdit = async (data: TOrder) => {
		dispatch(openModal({ data, type: EModalType.ORDER, mode: EModalMode.EDIT }));
	};

	const handlePageChange = async (perPage: number) => {
		dispatch(setCurrentOrderPage(perPage));

		searchParams.set('page', String(perPage));
		setSearchParams(searchParams);
	};

	const handlePerPageChange = async (perPage: number) => {
		dispatch(setOrdersPerPage(perPage));

		searchParams.set('limit', String(perPage));
		setSearchParams(searchParams);
	};

	return (
		<section className="pt-4 flex flex-col h-full  justify-between">
			<section className="">
				{/* Search + Add */}
				<section className="flex justify-between items-end ">
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
						onClick={() =>
							dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.ORDER }))
						}
					>
						+ Add Order
					</Button>
				</section>
				<OrderTable orders={orders} onDelete={noop} onEdit={handleEdit} onOrder={noop} />
			</section>

			{/* Pagination */}
			<Pagination
				totalItems={totalItems}
				currentPage={page}
				totalPages={totalPages}
				itemsPerPage={limit}
				onPageChange={handlePageChange}
				onPerPageChange={handlePerPageChange}
			/>
		</section>
	);
};
