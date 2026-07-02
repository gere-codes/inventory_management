import {} from 'react';
import { SearchBar, Pagination } from '@common';
import { ProductTable, useProductHandlers, useProductFilter, useProductStats, ProductsStats } from '@products';
import { Button } from '@ui';

export const ProductsPage = () => {
	const { filters, searchTerm, handleSearchChange, pagination, status, data, setPage, setLimit } = useProductFilter();
	const { handleDelete, handleEdit, handleReorder, handleAddProduct } = useProductHandlers();

	return (
		<section className="pt-4 flex flex-col h-full">
			{/* Stats */}
			<ProductsStats />
			<section className="flex flex-col justify-between">
				<section className="">
					{/* Search + Add */}
					<section className="flex justify-between items-end">
						<div className="flex flex-col gap-2 flex-1">
							<h2 className="text-xl font-bold">Products List</h2>
							<SearchBar
								value={searchTerm}
								onSearch={(newValue) => {
									// handleTerm(newValue);
									handleSearchChange(newValue);
								}}
								placeholder="Search..."
							/>
						</div>

						<Button
							className="w-fit flex items-center gap-1 text-white"
							style={{ width: 138, height: 40 }}
							onClick={handleAddProduct}
						>
							+ Add Product
						</Button>
					</section>

					{/* Table */}
					<ProductTable products={data} onDelete={handleDelete} onEdit={handleEdit} onOrder={handleReorder} />
				</section>
				{/* Pagination */}
				<Pagination
					currentPage={filters.page}
					itemsPerPage={filters.limit}
					totalPages={pagination?.totalPages}
					totalItems={pagination?.totalItems}
					onPageChange={setPage}
					onPerPageChange={setLimit}
				/>
			</section>
		</section>
	);
};
