import { memo } from 'react';
import type { TCategory } from '../category.schema';
import type { IconType } from 'react-icons';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

interface Props {
	category: TCategory;
	onEdit: (category: TCategory) => void;
	onDelete: (category: TCategory) => void;
}
export const CategoryItem = memo(({ category, onEdit, onDelete }: Props) => {
	return (
		<tr key={category.id} className="hover:bg-gray-50  border-b border-gray-200">
			<TableItemData item={category.name} />
			<TableItemData item={category.description || ''} />
			<TableItemData item={new Date(category.updatedAt).toLocaleDateString()} />
			<TableItemData item={new Date(category.createdAt).toLocaleDateString()} />

			<td className="px-4 py-4  w-1/4 text-ellipsis overflow-hidden">
				<span className="flex gap-3 truncate ">
					<TableActionButton handleClick={() => onEdit(category)} Icon={AiFillEdit} />
					<TableActionButton handleClick={() => onDelete(category)} Icon={MdDelete} />
				</span>
			</td>
		</tr>
	);
});

const TableItemData = ({ item }: { item: string | number }) => {
	return (
		<td className="px-4 py-4  w-1/4 text-ellipsis  overflow-hidden">
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
