import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, categorySchema, type TCategory, type TCategoryForm } from '../category.schema';
import { Button, InputField, TextareaField } from '@ui';
import { closeModal, EModalMode } from '@common';
import { useAppDispatch, useAppSelector } from '@hooks';
import { categoryThunk } from '../category.thunk';
import { selectCategoryPagination } from '../category.selectors';
import { BASE_URL } from '@api';
import { TiDelete } from 'react-icons/ti';

interface Props {
	mode: EModalMode.CREATE | EModalMode.EDIT;
	categoryData: TCategory;
}

export const CategoryForm = ({ mode, categoryData }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
		watch,
	} = useForm<TCategoryForm>({
		resolver: zodResolver(categoryFormSchema),
		mode: 'onBlur',
		values: {
			mode: mode,
			...categoryData,
		},
	});

	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectCategoryPagination);

	const dispatch = useAppDispatch();

	const imageFile = watch('image');

	const onSubmit = async (data: TCategoryForm) => {
		const result = categoryFormSchema.safeParse(data);

		if (!result.success) {
			return;
		}

		const { mode, ...payload } = result.data;

		const formData = new FormData();

		Object.entries(payload).forEach(([key, value]) => {
			if (value === null || value === undefined) return;

			if (value instanceof File) {
				formData.append(key, value, value.name);
			} else {
				formData.append(key, value.toString());
			}
		});

		if (data.mode === EModalMode.EDIT) {
			dispatch(categoryThunk.update({ id: data.id, body: formData }));
		} else {
			await dispatch(categoryThunk.create(formData));
			await dispatch(categoryThunk.paginate({ page: currentPage, limit: itemsPerPage }));
		}
		dispatch(closeModal());
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-2 w-78">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<section>
				{/* image */}
				<Controller
					name="image"
					control={control}
					render={({ field: { onChange, value, ...field } }) => {
						return (
							<div className="border border-gray-200 rounded h-24 w-24 relative">
								{imageFile ? (
									<div className="relative">
										<button
											onClick={() => setValue('image', '')}
											className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800"
										>
											<TiDelete size={25} />
										</button>
										<img
											src={
												imageFile instanceof File
													? URL.createObjectURL(imageFile)
													: `${BASE_URL}${imageFile}`
											}
											alt="Preview"
											className="object-center aspect-square h-full w-full"
										/>
									</div>
								) : (
									<>
										<input
											{...field}
											type="file"
											id="image"
											name="image"
											className="h-full w-full opacity-0 absolute"
											accept="image/jpeg, image/png"
											multiple={false}
											onChange={(e) => {
												const file = e.target.files && e.target.files[0];

												if (file) {
													setValue('image', file);
												}
											}}
										/>
										<label
											htmlFor="image"
											className="h-full w-full flex items-center justify-center cursor-pointer"
										>
											<span className="text-gray-500 text-xs">Upload Image</span>
										</label>
									</>
								)}
							</div>
						);
					}}
				/>
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
