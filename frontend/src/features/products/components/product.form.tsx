import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { closeModal, EModalMode } from '@common';
import { Button, InputField, TextareaField } from '@ui';
import { productFormSchema, type TProduct, type TProductFormValues } from '../product.schema';
import { useAppDispatch } from '@hooks';
import { CategorySelect, useCategories } from '@categories';
import { productThunk } from '../product.thunk';
import { BASE_URL } from '@api';
import { TiDelete } from 'react-icons/ti';
import { useProductData, useProductsStats } from '../product.hook';

interface Props {
	mode: EModalMode.CREATE | EModalMode.EDIT;
	initialData: TProduct;
}

export const ProductForm = ({ mode, initialData }: Props) => {
	const { fetchData } = useProductData();
	const dispatch = useAppDispatch();

	const { categories, isLoading } = useCategories();
	const { fetchStats: fetchProductsStats } = useProductsStats();

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
			...initialData,
		},
	});

	const onSubmit = async (data: TProductFormValues) => {
		const { mode, ...payload } = productFormSchema.parse(data);

		const formData = new FormData();

		Object.entries(payload).forEach(([key, value]) => {
			if (value === null || value === undefined) return;

			if (Array.isArray(value)) {
				value.forEach((item) => {
					formData.append(`${key}[]`, item);
				});
			} else {
				formData.append(key, String(value));
			}
		});
		try {
			if (data.mode === EModalMode.EDIT) {
				await dispatch(productThunk.update({ id: data.id, body: formData }));
			} else {
				await dispatch(productThunk.create(formData));
				await fetchData();
			}

			dispatch(closeModal());
		} catch (error) {
			console.error(error);
		} finally {
			fetchProductsStats();
		}
	};

	// Handling images
	const imageFile = watch('images');

	const previewUrls = useMemo(() => {
		return (
			imageFile?.map((image) => (image instanceof File ? URL.createObjectURL(image) : `${BASE_URL}${image}`)) ??
			[]
		);
	}, [imageFile]);

	useEffect(() => {
		return () => {
			previewUrls.forEach((url, index) => {
				if (imageFile?.[index] instanceof File) {
					URL.revokeObjectURL(url);
				}
			});
		};
	}, [imageFile, previewUrls]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 max-w-[500px]" data-testid="product-form">
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
							<div className="flex flex-wrap gap-4 w-full col-span-2 mt-2">
								{/* Render images */}
								{previewUrls &&
									previewUrls.map((image, index) => {
										return (
											<div
												className="rounded w-20 h-30 relative grid place-items-center border border-gray-100"
												key={index}
											>
												<button
													type="button"
													onClick={() => {
														const updatedImages = imageFile?.filter((_, i) => i !== index);
														setValue('images', updatedImages);
													}}
													className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800 z-10 bg-white rounded-full"
												>
													<TiDelete size={25} />
												</button>
												<img
													src={image}
													alt={`Preview ${index + 1}`}
													className="object-cover h-30 max-w-full rounded"
												/>
											</div>
										);
									})}

								{/* Render upload slot ONLY if total images are less than 4 */}
								{(!imageFile || imageFile.length < 4) && (
									<div className="border border-gray-200 border-dashed rounded  w-20 h-30 relative flex items-center justify-center hover:bg-gray-50 transition-colors">
										<input
											{...field}
											type="file"
											id="images"
											name="images"
											className="h-full w-full opacity-0 absolute cursor-pointer z-10"
											accept="image/jpeg, image/png"
											multiple={true}
											onChange={(e) => {
												const files = e.target.files;
												if (files) {
													const currentImages = imageFile || [];
													const imagesToAdd = Array.from(files).slice(
														0,
														4 - currentImages.length,
													);

													setValue('images', [...currentImages, ...imagesToAdd]);
												}
											}}
										/>
										<label
											htmlFor="images"
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
