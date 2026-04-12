import { memo } from 'react';
import type { TProduct } from '../product.schema';
import { ProductItem } from './product.row';

interface Props {
	products: TProduct[];
	onDelete: (product: TProduct) => void;
	onEdit: (product: TProduct) => void;
	onOrder: (product: TProduct) => void;
}
export const ProductTable = memo(({ products, onDelete, onEdit, onOrder }: Props) => {
	const tableHeaders = ['sku', 'name', 'price', 'category', 'quantity', 'status', 'action'];

	return (
		<section className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
			<section className="overflow-y-auto h-[calc(100vh-12.5rem)] relative">
				<table className="w-full table-fixed divide-y divide-gray-200">
					<TableHeaders headers={tableHeaders} />

					<tbody className="bg-white divide-y divide-gray-200">
						{products?.length > 0 ? (
							products?.map((product) => (
								<ProductItem
									key={product.id}
									product={product}
									onDelete={onDelete}
									onEdit={onEdit}
									onOrder={onOrder}
								/>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
									No products found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</section>
		</section>
	);
});

const TableHeaders = ({ headers }: { headers: string[] }) => {
	return (
		<thead>
			<tr className="bg-gray-100 sticky top-0 z-10">
				{headers.map((title, index) => (
					<th
						key={title + index}
						className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						{title}
					</th>
				))}
			</tr>
		</thead>
	);
};
