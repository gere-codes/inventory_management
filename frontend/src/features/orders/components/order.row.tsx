import { memo, type FC } from 'react';
import { BASE_URL } from '@api';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { IoBagHandleSharp } from 'react-icons/io5';
import type { IconType } from 'react-icons/lib';
import type { TOrder } from '../order.schema';
import { EOrderStatus } from '../order.enums';

interface Props {
	order: TOrder;
	onEdit: (order: TOrder) => void;
	onDelete: (order: TOrder) => void;
	onOrder: (order: TOrder) => void;
}
export const OrderItem = memo(({ order, onEdit, onDelete, onOrder }: Props) => {
	const statusStyles = {
		[EOrderStatus.RECEIVED]: 'bg-green-100 text-green-800',
		[EOrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
		[EOrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
	};

	return (
		<tr key={order.id} className="hover:bg-gray-50  border-b border-gray-200">
			<TableItemData item={order?.sku} />
			<TableItemData item={order?.name} image={order?.image ?? ''} />
			<TableItemData item={'$' + Number(order.price).toFixed(2)} />
			<TableItemData item={order?.category ?? ''} />
			<TableItemData item={`${order.quantity} pcs`} />
			<td className="px-4 py-4  w-1/7 text-ellipsis overflow-hidden">
				<span className={`px-3 py-1.5 text-xs truncate font-medium rounded ${statusStyles[order.status]}`}>
					{order.status}
				</span>
			</td>
			<td className="px-4 py-4  w-1/7 text-ellipsis overflow-hidden">
				<span className="flex gap-3 truncate ">
					<TableActionButton handleClick={() => onEdit(order)} Icon={AiFillEdit} />
				</span>
			</td>
		</tr>
	);
});

const TableItemData = ({ item, image }: { item: string | number; image?: string }) => {
	return (
		<td className="px-4 py-4  w-1/7 text-ellipsis  overflow-hidden">
			<div className="flex gap-1 items-center">
				{image && (
					<img
						src={`${BASE_URL}${image}`}
						alt={item.toString().substring(0, 1)}
						className="w-10 h-10 border border-gray-100 rounded"
					/>
				)}
				<p className="text-sm font-medium text-gray-900 truncate">{item}</p>
			</div>
		</td>
	);
};

const TableActionButton = ({ handleClick, Icon }: { handleClick: () => void; Icon: IconType }) => {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				handleClick();
			}}
			className="text-gray-500 "
		>
			<Icon size={20} />
		</button>
	);
};
