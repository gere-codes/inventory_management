import { memo } from 'react';
import type { TSupplier } from '../supplier.schema';
import { BASE_URL } from '@/shared/api';
import type { IconType } from 'react-icons';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

interface Props {
	supplier: TSupplier;
	onEdit: (supplier: TSupplier) => void;
	onDelete: (supplier: TSupplier) => void;
}
export const SupplierItem = memo(({ supplier, onEdit, onDelete }: Props) => {
	return (
		<tr key={supplier.id} className="hover:bg-gray-50  border-b border-gray-200">
			<TableItemData item={supplier.name} />
			<TableItemData item={supplier.description || ''} />

			<td className="px-4 py-4  w-1/4 text-ellipsis overflow-hidden">
				<span className="flex gap-3 truncate ">
					<TableActionButton handleClick={() => onEdit(supplier)} Icon={AiFillEdit} />
					<TableActionButton handleClick={() => onDelete(supplier)} Icon={MdDelete} />
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
