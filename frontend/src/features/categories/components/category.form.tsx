import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type TCategory } from '../category.schema';
import { categoryThunk } from '../category.thunk';
import { Button, InputField, TextareaField } from '@ui';
import { closeModal, EModalMode } from '@common';
import { useAppDispatch } from '@hooks';

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
	} = useForm<TCategory>({
		resolver: zodResolver(categorySchema),
		mode: 'onBlur',
		values: {
			id: categoryData?.id ?? '',
			name: categoryData?.name ?? '',
			description: categoryData?.description ?? '',
			createdAt: categoryData?.createdAt ?? '',
			updatedAt: categoryData?.updatedAt ?? '',
		},
	});

	const dispatch = useAppDispatch();

	const onSubmit = async (data: TCategory) => {
		const body = {
			name: data.name,
			description: data.description,
		};

		if (mode === EModalMode.CREATE) {
			dispatch(categoryThunk.create(body));
		} else {
			dispatch(categoryThunk.update({ body, id: data.id }));
		}
		dispatch(closeModal());
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-2 w-78">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<section>
				<section className="flex gap-4 flex-col">
					<InputField {...register('name')} label="Name" id="name" error={errors.name?.message} />
					<TextareaField
						{...register('description')}
						label="Description"
						id="description"
						error={errors.description?.message}
					/>
				</section>
				<section className="mt-6 flex justify-end space-x-3">
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
				</section>
			</section>
		</form>
	);
};
