import { Button } from '@ui';
import { Pagination, SearchBar } from '@common';
import { OrderTable, useOrderFilter, useOrderHanlders } from '@orders';

export const OrdersPage = () => {
	const { filters, fetchData, searchTerm, handleSearchChange, pagination, status, data, setLimit, setPage } =
		useOrderFilter();

	const { handleEdit, handleAdd } = useOrderHanlders({
		fetchData,
	});

	return (
		<section className="pt-4 flex flex-col h-full  justify-between">
			<section className="">
				{/* Search + Add */}
				<section className="flex justify-between items-end ">
					<div className="flex flex-col gap-2 flex-1">
						<h2 className="text-xl font-bold">Orders List</h2>
						<SearchBar
							value={searchTerm}
							onSearch={(newValue) => {
								handleSearchChange(newValue);
							}}
							placeholder="Search..."
						/>
					</div>

					<Button
						className="w-fit flex items-center gap-1 text-white"
						style={{ width: 138, height: 40 }}
						onClick={handleAdd}
					>
						+ Add Order
					</Button>
				</section>
				<OrderTable orders={data} onDelete={() => {}} onEdit={handleEdit} onOrder={() => {}} />
			</section>

			{/* Pagination */}
			<Pagination
				currentPage={filters.page}
				totalPages={pagination?.totalPages}
				itemsPerPage={filters.limit}
				totalItems={pagination.totalItems}
				onPageChange={setPage}
				onPerPageChange={setLimit}
			/>
		</section>
	);
};
