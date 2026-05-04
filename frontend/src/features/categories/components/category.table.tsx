import { memo } from 'react';
import type { TCategory } from '../category.schema';
import { CategoryItem } from './category.row';

interface Props {
	categories: TCategory[];
	onDelete: (category: TCategory) => void;
	onEdit: (category: TCategory) => void;
}
export const CategoryTable = memo(({ categories, onDelete, onEdit }: Props) => {
	const tableHeaders = ['name', 'description', 'actions'];

	return (
		<section className="bg-white rounded-lg border border-gray-200 overflow-hidden relative mt-4">
			<section className="overflow-y-auto h-[calc(100vh-12.5rem)] relative">
				<table className="w-full table-fixed divide-y divide-gray-200">
					<TableHeaders headers={tableHeaders} />

					<tbody className="bg-white divide-y divide-gray-200">
						{categories?.length > 0 ? (
							categories?.map((category) => (
								<CategoryItem
									key={category.id}
									category={category}
									onDelete={onDelete}
									onEdit={onEdit}
								/>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
									No categories found
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
