import { closeModal, EModalMode } from '@common';
import { categorySchema, type TCategory } from '../category.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputField, TextareaField } from '@/shared/components/ui';
import { useAppDispatch } from '@/shared/hooks';

interface Props {
	mode: EModalMode;
	categoryData: TCategory;
}

export const CategoryForm = ({ mode, categoryData }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(categorySchema),
		defaultValues: categoryData,
	});

	const dispatch = useAppDispatch();

	return (
		<form className="p-2 w-78">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<div>
				<InputField {...register('name')} label="Name" id="name" />
				<TextareaField {...register('description')} label="Description" id="description" />
				<div className="mt-6 flex justify-end space-x-3">
					<Button
						variant="secondary"
						type="button"
						className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 "
						onClick={() => {
							dispatch(closeModal());
						}}
					>
						Cancel
					</Button>
					<Button type="submit">{mode === EModalMode.EDIT ? 'Update ' : 'Save '}</Button>
				</div>
			</div>
		</form>
	);
};
