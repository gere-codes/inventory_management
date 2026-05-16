import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SearchBar, Pagination, openModal, EModalType, EModalMode, DynamicPieChart } from '@common';
import {
	selectProducts,
	selectProductsPagination,
	ProductTable,
	productThunk,
	type TProduct,
	setItemsPerPage,
	selectProductStats,
} from '@products';
import { Button } from '@ui';
import { debounce } from '@utils';
import { setCurrentPage } from '@products';
import { LuPackageMinus, LuPackageOpen } from 'react-icons/lu';
import { TbPackages } from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { EOrderStatus, EOrderType, type TOrderForm } from '@orders';
import { ECRUDMode } from '@enums';

export const ProductsPage = () => {
	const FIRST_PAGE = 1;

	const [term, setTerm] = useState<string>('');

	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectProductsPagination);

	const productStats = useAppSelector(selectProductStats);

	useEffect(() => {
		dispatch(productThunk.getStats());
	}, [dispatch]);

	useEffect(() => {
		dispatch(productThunk.paginate({ page: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(productThunk.search({ term, page: FIRST_PAGE, limit: itemsPerPage }));
			}, 500),
		[dispatch, itemsPerPage],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleDelete = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.DELETE }));
	};

	const handleEdit = async (product: TProduct) => {
		dispatch(openModal({ data: product, type: EModalType.PRODUCT, mode: EModalMode.EDIT }));
	};

	const handlePageChange = (pageNum: number) => {
		dispatch(setCurrentPage(pageNum));
	};

	const handlePerPageChange = (perPage: number) => {
		dispatch(setItemsPerPage(perPage));
		dispatch(setCurrentPage(currentPage));
	};

	const handleReorder = async (product: TProduct) => {
		const data: TOrderForm = {
			...product,
			productId: product.id,
			mode: ECRUDMode.CREATE,
			status: EOrderStatus.PENDING,
			type: EOrderType.REORDER,
		};

		dispatch(openModal({ data, type: EModalType.ORDER, mode: EModalMode.CREATE }));
	};

	return (
		<section className="py-4 space-y-6">
			{/* Stats */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<ProductLevel
					Icon={TbPackages}
					color="blue"
					count={productStats?.totalProducts ?? 0}
					name="Total Products"
				/>
				<ProductLevel Icon={LuPackageMinus} color="yellow" count={productStats?.lowStock} name="Low in Stock" />
				<ProductLevel Icon={LuPackageOpen} color="red" count={productStats?.outOfStock} name="Out of Stock" />
			</section>

			{/* Search + Add */}
			<section className="flex justify-between items-end">
				<div className="flex flex-col gap-2 flex-1">
					<h2 className="text-xl font-bold">Products List</h2>
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
						dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.PRODUCT }))
					}
				>
					+ Add Product
				</Button>
			</section>

			{/* Table */}
			<ProductTable products={products} onDelete={handleDelete} onEdit={handleEdit} onOrder={handleReorder} />

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onPerPageChange={handlePerPageChange}
			/>
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
