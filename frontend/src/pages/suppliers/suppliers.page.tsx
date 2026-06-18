import { Pagination, SearchBar } from '@common';
import { Button } from '@ui';
import { useSupplierFilter, useSupplierHanlders } from '@/features/suppliers/supplier.hook';
import { SupplierTable } from '@suppliers';

export const SuppliersPage = () => {
	const { filters, searchTerm, handleSearchChange, pagination, status, data, setLimit, setPage } =
		useSupplierFilter();

	const { handleEdit, handleAdd, handleDelete } = useSupplierHanlders();

	return (
		<section className="pt-4 flex flex-col h-full  justify-between">
			<section>
				{/* Search + Add */}
				<section className="flex justify-between items-end">
					<div className="flex flex-col gap-2 flex-1">
						<h2 className="text-xl font-bold">Suppliers List</h2>
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
						style={{ width: 140, height: 40 }}
						onClick={handleAdd}
					>
						+ Add Supplier
					</Button>
				</section>

				{/* Table */}
				<SupplierTable suppliers={data} onDelete={handleDelete} onEdit={handleEdit} />
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
