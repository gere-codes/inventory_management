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
			<TableItemData item={`${product.quantity} pcs`} />
			<td className="px-4 py-4  w-1/7 text-ellipsis overflow-hidden">
				<span className={`px-3 py-1.5 text-xs truncate font-medium rounded ${statusStyles[product.status]}`}>
					{product.status}
				</span>
			</td>
			<td className="px-4 py-4  w-1/7 text-ellipsis overflow-hidden">
				<span className="flex gap-3 truncate ">
					<TableActionButton handleClick={() => onEdit(product)} Icon={AiFillEdit} />
					<TableActionButton handleClick={() => onDelete(product)} Icon={MdDelete} />
					<TableActionButton handleClick={() => onOrder(product)} Icon={IoBagHandleSharp} />
				</span>
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
			className="text-gray-500 "
		>
			<Icon size={20} />
		</button>
	);
};
