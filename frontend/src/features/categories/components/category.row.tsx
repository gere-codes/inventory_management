import { memo } from 'react';
import type { TCategory } from '../category.schema';
import type { IconType } from 'react-icons';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { BASE_URL } from '@/shared/api';

interface Props {
	category: TCategory;
	onEdit: (category: TCategory) => void;
	onDelete: (category: TCategory) => void;
}
export const CategoryItem = memo(({ category, onEdit, onDelete }: Props) => {
	return (
		<tr key={category.id} className="hover:bg-gray-50  border-b border-gray-200">
			<TableItemData item={category.name} image={category.image} />
			<TableItemData item={category.description || ''} />

			<td className="px-4 py-4  w-1/4 text-ellipsis overflow-hidden">
				<span className="flex gap-3 truncate ">
					<TableActionButton handleClick={() => onEdit(category)} Icon={AiFillEdit} />
					<TableActionButton handleClick={() => onDelete(category)} Icon={MdDelete} />
				</span>
			</td>
		</tr>
	);
});

const TableItemData = ({ item, image }: { item: string | number; image?: string | File | null | undefined }) => {
	return (
		<td className="px-4 py-4  w-1/4 text-ellipsis  overflow-hidden">
			<div className="flex gap-1 items-center ">
				{image && (
					<span className="block h-10 w-10 border border-gray-100 rounded ">
						<img
							src={`${BASE_URL}${image}`}
							alt={item.toString().substring(0, 1)}
							className="object-cover aspect-square"
						/>
					</span>
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
