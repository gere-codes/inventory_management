import { useEffect, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { closeModal, EModalMode } from '@common';
import { Button, InputField, TextareaField } from '@ui';
import { productFormSchema, type TProduct, type TProductCreate, type TProductFormValues } from '../product.schema';
import { useAppDispatch, useAppSelector } from '@hooks';
import { CategorySelect, categoryThunk, selectCategories, useCategories } from '@categories';
import { productThunk } from '../product.thunk';
import { selectProductsPagination } from '../product.selectors';
import { BASE_URL } from '@api';
import { TiDelete } from 'react-icons/ti';

interface Props {
	mode: EModalMode.CREATE | EModalMode.EDIT;
	productData: TProduct;
}

export const ProductForm = ({ mode, productData }: Props) => {
	const { categories, isLoading } = useCategories();
	const [previewUrl, setPreviewUrl] = useState<string[] | null>(null);

	const { limit, page, totalItems, totalPages } = useAppSelector(selectProductsPagination);

	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
		control,
	} = useForm<TProductFormValues>({
		resolver: zodResolver(productFormSchema),
		mode: 'onBlur',
		defaultValues: {
			mode,
			...productData,
		},
	});

	const onSubmit = async (data: TProductFormValues) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value === null || value === undefined) return;

			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item instanceof File) {
						formData.append(key, item);
					} else if (typeof item === 'string') {
						formData.append(key, item);
					}
				});
			} else {
				formData.append(key, value.toString());
			}
		});
		if (data.mode === EModalMode.EDIT) {
			await dispatch(productThunk.update({ id: data.id, body: formData }));
		} else {
			await dispatch(productThunk.create(formData));
			await dispatch(productThunk.getCollection({ pagination: { limit, page, disabled: false } }));
		}
		dispatch(closeModal());
	};

	const imageFile = watch('images');

	// revoke url when component unmounts
	useEffect(() => {
		if (!imageFile || !Array.isArray(imageFile) || imageFile.length === 0) {
			setPreviewUrl([]); // Clear previews if no files exist
			return;
		}

		const objectUrls = imageFile
			.filter((image) => image instanceof File)
			.map((image) => URL.createObjectURL(image));

		setPreviewUrl(objectUrls);

		return () => {
			// revoke object urls when component unmounts
			objectUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [imageFile]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6" data-testid="product-form">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
				{/* image */}
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value, ...field } }) => {
						return (
							<div className="flex flex-wrap gap-2">
								{/* Render existing image previews */}
								{imageFile &&
									imageFile.map((image, index) => (
										<div className="border border-gray-200 rounded h-24 w-24 relative" key={index}>
											<button
												type="button"
												onClick={() => {
													// Filter out the deleted image by its index
													const updatedImages = imageFile.filter((_, i) => i !== index);
													setValue('images', updatedImages);
												}}
												className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800 z-10 bg-white rounded-full"
											>
												<TiDelete size={25} />
											</button>
											<img
												src={
													image instanceof File
														? URL.createObjectURL(image)
														: `${BASE_URL}${image}`
												}
												alt={`Preview ${index + 1}`}
												className="object-cover h-full w-full rounded"
											/>
										</div>
									))}

								{/* Render upload slot ONLY if total images are less than 4 */}
								{(!imageFile || imageFile.length < 4) && (
									<div className="border border-gray-200 border-dashed rounded h-24 w-24 relative flex items-center justify-center hover:bg-gray-50 transition-colors">
										<input
											{...field}
											type="file"
											id="image"
											name="image"
											className="h-full w-full opacity-0 absolute cursor-pointer z-10"
											accept="image/jpeg, image/png"
											multiple={false}
											onChange={(e) => {
												const file = e.target.files && e.target.files[0];
												if (file) {
													const currentImages = imageFile || [];
													setValue('images', [...currentImages, file]);
												}
											}}
										/>
										<label
											htmlFor="image"
											className="h-full w-full flex flex-col items-center justify-center cursor-pointer text-center p-1"
										>
											<span className="text-gray-400 text-lg font-light">+</span>
											<span className="text-gray-500 text-[10px] leading-tight">
												Upload Image
											</span>
											<span className="text-gray-400 text-[9px]">
												({imageFile?.length || 0}/4)
											</span>
										</label>
									</div>
								)}
							</div>
						);
					}}
				/>
				{/* Product Name */}
				<div className="md:col-span-2">
					<InputField
						{...register('name')}
						error={errors?.name?.message}
						label="Product Name*"
						type="text"
						id="name"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter product name"
					/>
				</div>

				{/* Price */}
				<div>
					<InputField
						{...register('price', { valueAsNumber: true })}
						error={errors?.price?.message}
						label="Price*"
						type="number"
						id="price"
						required
						min="0"
						step="0.01"
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="0.00"
					/>
				</div>

				{/* SKU */}
				<div>
					<InputField
						{...register('sku')}
						error={errors?.sku?.message}
						label={'SKU*'}
						type="text"
						id="sku"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter SKU"
						disabled={mode === EModalMode.EDIT}
					/>
				</div>

				{/* Quantity */}
				<div>
					<InputField
						{...register('quantity', { valueAsNumber: true })}
						error={errors?.quantity?.message}
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="0"
						label="Quantity*"
						type="number"
						id="quantity"
						required
						min={mode === EModalMode.EDIT ? 0 : 1}
						step={1}
					/>
				</div>

				{/* Category */}
				<div>
					<CategorySelect categories={categories} isLoading={isLoading} register={register} />
				</div>

				{/* Description */}
				<div className="md:col-span-2">
					<TextareaField
						{...register('description')}
						error={errors?.description?.message}
						label="Description"
						id="description"
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter product description"
					/>
				</div>
			</div>

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
		</form>
	);
};
