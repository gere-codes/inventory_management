import { CategoryTable, useCategoryFilter, useCategoryHandlers } from '@categories';
import { useAppSelector } from '@hooks';
import { DynamicPieChart, Pagination, SearchBar } from '@common';
import { selectProductStats } from '@products';
import { Button } from '@ui';

export const CategoriesPage = () => {
	const { filters, searchTerm, handleSearchChange, pagination, data, handleLimitChange, handlePageChange } =
		useCategoryFilter();

	const { handleDelete, handleEdit, handleAdd } = useCategoryHandlers();

	const productStats = useAppSelector(selectProductStats);

	return (
		<section className=" pt-4 h-full">
			<section className="flex flex-col-reverse lg:flex-row lg:h-full">
				<section className="flex flex-col justify-between">
					<section className="">
						{/* Search */}
						<section className="flex flex-col gap-2 ">
							<h2 className="font-bold text-xl">Categories List</h2>
							<section className="flex justify-between">
								<SearchBar
									value={searchTerm}
									onSearch={(newValue) => {
										handleSearchChange(newValue);
									}}
									placeholder="Search..."
								/>

								<Button onClick={handleAdd} style={{ width: 150, height: 40 }}>
									+ Add Category
								</Button>
							</section>
						</section>
						{/* Table */}
						<CategoryTable categories={data} onDelete={handleDelete} onEdit={handleEdit} />
					</section>
					{/* Pagination */}
					<Pagination
						currentPage={filters.page}
						totalPages={pagination?.totalPages}
						itemsPerPage={filters.limit}
						totalItems={pagination.totalItems}
						onPageChange={handlePageChange}
						onPerPageChange={handleLimitChange}
					/>
				</section>

				<section className="lg:mt-10">
					<h2 className="text-center font-bold text-gray-600">Products by Categories</h2>
					<DynamicPieChart data={productStats.categories} />
				</section>
			</section>
		</section>
	);
};
