import { memo, type FC } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { IoBagHandleSharp } from 'react-icons/io5';
import type { IconType } from 'react-icons/lib';
import type { TProduct } from '../product.schema';
import { EProductStatus } from '../product.enum';

interface Props {
	product: TProduct;
	onEdit: (product: TProduct) => void;
	onDelete: (product: TProduct) => void;
	onOrder: (product: TProduct) => void;
}
export const ProductItem = memo(({ product, onEdit, onDelete, onOrder }: Props) => {
	const statusStyles = {
		[EProductStatus.IN_STOCK]: 'bg-green-100 text-green-800',
		[EProductStatus.LOW_STOCK]: 'bg-yellow-100 text-yellow-800',
		[EProductStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
	};

	return (
		<tr key={product.id} className="hover:bg-gray-50  border-b border-gray-200">
			<TableItemData item={product.sku} />
			<TableItemData item={product.name} />
			<TableItemData item={'$' + Number(product.price).toFixed(2)} />
			<TableItemData item={product.category} />
			<TableItemData item={product.quantity} />
			<td className="p-4 whitespace-nowrap text-sm font-medium w-1/7">
				<span
					className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[product.status]}`}
				>
					{product.status}
				</span>
			</td>
			<td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex gap-3 w-1/7">
				<TableActionButton handleClick={() => onEdit(product)} Icon={AiFillEdit} />
				<TableActionButton handleClick={() => onDelete(product)} Icon={MdDelete} />
				<TableActionButton handleClick={() => onOrder(product)} Icon={IoBagHandleSharp} />
			</td>
		</tr>
	);
});

const TableItemData = ({ item }: { item: string | number }) => {
	return (
		<td className="px-4 py-4  w-1/7 text-ellipsis  overflow-hidden">
			<p className="text-sm font-medium text-gray-900 truncate">{item}</p>
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
			className="text-gray-500 shrink-0"
		>
			<Icon size={20} />
		</button>
	);
};
