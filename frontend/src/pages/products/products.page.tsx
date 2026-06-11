import {} from 'react';
import type { IconType } from 'react-icons';
import { LuPackageMinus, LuPackageOpen } from 'react-icons/lu';
import { TbPackages } from 'react-icons/tb';

import { useAppSelector } from '@hooks';
import { SearchBar, Pagination } from '@common';
import { ProductTable, selectProductStats, useProductHandlers, useProductFilter } from '@products';
import { Button } from '@ui';

export const ProductsPage = () => {
	const { filters, searchTerm, handleSearchChange, pagination, status, data, setPage, setLimit } = useProductFilter();

	const { handleDelete, handleEdit, handleReorder, handleAddProduct } = useProductHandlers();

	const productStats = useAppSelector(selectProductStats);

	return (
		<section className="pt-4 flex flex-col h-full">
			{/* Stats */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
				<ProductLevel
					Icon={TbPackages}
					color="blue"
					count={productStats?.totalProducts ?? 0}
					name="Total Products"
				/>
				<ProductLevel Icon={LuPackageMinus} color="yellow" count={productStats?.lowStock} name="Low in Stock" />
				<ProductLevel Icon={LuPackageOpen} color="red" count={productStats?.outOfStock} name="Out of Stock" />
			</section>

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
type TColor = 'yellow' | 'red' | 'blue';
const colorMap: Record<TColor, Record<'bg' | 'text' | 'iconBg', string>> = {
	yellow: {
		bg: 'bg-yellow-50',
		text: 'text-yellow-600',
		iconBg: 'bg-yellow-200',
	},
	red: {
		bg: 'bg-red-50',
		text: 'text-red-600',
		iconBg: 'bg-red-200',
	},
	blue: {
		bg: 'bg-blue-50',
		text: 'text-blue-600',
		iconBg: 'bg-blue-200',
	},
};

interface IProductLevel {
	name: string;
	count: number;
	Icon: IconType;
	color: TColor;
}

const ProductLevel = ({ color, count, name, Icon }: IProductLevel) => {
	const styles = colorMap[color];
	return (
		<section className={`${styles.bg} ${styles.text} h-[160px] p-4 rounded-lg shadow-xs flex items-center gap-4`}>
			<span className={`p-3 ${styles.iconBg} rounded-lg`}>
				<Icon size={28} />
			</span>
			<div>
				<span className="text-3xl font-semibold">{count}</span>
				<h2 className="text-sm ">{name}</h2>
			</div>
		</section>
	);
};
