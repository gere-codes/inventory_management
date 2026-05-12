import { memo } from 'react';
import type { TOrder } from '../order.schema';
import { OrderItem } from './order.row';

interface Props {
	orders: TOrder[];
	onDelete: (order: TOrder) => void;
	onEdit: (order: TOrder) => void;
	onOrder: (order: TOrder) => void;
}
export const OrderTable = memo(({ orders, onDelete, onEdit, onOrder }: Props) => {
	const tableHeaders = ['sku', 'name', 'price', 'category', 'quantity', 'status', 'actions'];

	return (
		<section className="bg-white rounded-lg border border-gray-200 overflow-hidden relative mt-4">
			<section className="overflow-y-auto h-[calc(100vh-24.5rem)] relative">
				<table className="w-full table-fixed divide-y divide-gray-200">
					<TableHeaders headers={tableHeaders} />

					<tbody className="bg-white divide-y divide-gray-200">
						{orders?.length > 0 ? (
							orders?.map((order) => (
								<OrderItem
									key={order.id}
									order={order}
									onDelete={onDelete}
									onEdit={onEdit}
									onOrder={onOrder}
								/>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
									No order found
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
