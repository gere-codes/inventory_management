import type { UseFormRegister } from 'react-hook-form';
import type { TCategory } from '../category.schema';
import type { TProductFormValues } from '@products';

interface Props {
	categories: TCategory[];
	isLoading: boolean;
	register: UseFormRegister<TProductFormValues>;
}

export const CategorySelect = ({ categories, isLoading, register }: Props) => {
	if (isLoading) return <div className="animate-pulse w-full h-[42px] bg-gray-200 rounded" />;

	return (
		<>
			<label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 ">
				Category*
			</label>
			<select
				required
				{...register('categoryId')}
				className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px]"
			>
				<option value="">Select a category</option>
				{categories?.map((cat) => (
					<option key={cat.id} value={cat.id}>
						{cat.name}
					</option>
				))}
			</select>
		</>
	);
};
