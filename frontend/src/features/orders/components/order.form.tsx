import { useEffect, useState } from 'react';
import { selectOrderPagination } from '../order.selector';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderThunk } from '../order.thunk';
import { TiDelete } from 'react-icons/ti';
import { useAppDispatch, useAppSelector } from '@hooks';
import { BASE_URL } from '@api';
import { Button, InputField, TextareaField } from '@ui';
import { CategorySelect, useCategories } from '@categories';
import { closeModal, EModalMode } from '@common';
import { orderFormSchema, orderQuerySchema, type TOrder, type TOrderForm } from '../order.schema';
import { EOrderStatus, EOrderType } from '../order.enums';
import { productThunk } from '@products';
import { useSearchParams } from 'react-router';
import { useOrderData } from '../order.hook';

interface Props {
	mode: EModalMode.CREATE | EModalMode.EDIT;
	orderData: TOrder;
}

export const OrderForm = ({ mode, orderData }: Props) => {
	const { fetchData } = useOrderData();

	const { categories, isLoading } = useCategories();

	const [previewUrl, setPreviewUrl] = useState<string[] | null>(null);
	const isReadOnlyField = orderData?.type === EOrderType.REORDER;

	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
		control,
	} = useForm<TOrderForm>({
		resolver: zodResolver(orderFormSchema),
		mode: 'onBlur',
		defaultValues: {
			mode: mode,
			...orderData,
		},
	});

	const onSubmit = async (data: TOrderForm) => {
		if (orderData?.status === EOrderStatus.CANCELLED || orderData?.status === EOrderStatus.RECEIVED) {
			dispatch(closeModal());
			return;
		}

		const result = orderFormSchema.parse(data);
		const { mode, ...payload } = result;

		const formData = new FormData();

		Object.entries(payload).forEach(([key, value]) => {
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

		try {
			if (data.mode === EModalMode.EDIT) {
				if (payload.status === EOrderStatus.RECEIVED) {
					if (payload.type === EOrderType.NEW) {
						await dispatch(productThunk.create(formData));
					} else {
						await dispatch(
							productThunk.updateQuantity({
								productId: payload.productId as string,
								quantity: payload.quantity,
							}),
						);
					}
				}
				await dispatch(orderThunk.update({ id: data.id, body: formData }));
			} else {
				await dispatch(orderThunk.create(formData));
				await fetchData();
			}
			dispatch(closeModal());
		} catch (error) {
			console.error('Submission error:', error);
		}
	};

	const imageFile = watch('images');

	// revoke url when component unmounts
	useEffect(() => {
		if (!(imageFile instanceof File)) {
			setPreviewUrl(null);
			return;
		}

		const objectUrls = imageFile
			.filter((image) => image instanceof File)
			.map((image) => URL.createObjectURL(image));

		setPreviewUrl(objectUrls);

		return () => {
			objectUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [imageFile]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6" data-testid="order-form">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update order' : 'add order'}
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
												disabled={isReadOnlyField}
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
				{/* order Name */}
				<div className="md:col-span-2">
					<InputField
						{...register('name')}
						disabled={isReadOnlyField}
						error={errors?.name?.message}
						label="order Name*"
						type="text"
						id="name"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter order name"
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
						disabled={isReadOnlyField}
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
					<CategorySelect
						categories={categories}
						isLoading={isLoading}
						register={register}
						disabled={isReadOnlyField}
					/>
				</div>

				{/* Status */}
				<div>
					<label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 ">
						Status*
					</label>
					<select
						{...register('status')}
						className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px]"
					>
						{orderStatus?.map((status) => (
							<option className="capitalize" value={status}>
								{status}
							</option>
						))}
					</select>
				</div>

				{/* Type */}
				<div>
					<label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 ">
						Type*
					</label>
					<select
						required
						{...register('type')}
						className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px]"
						disabled={isReadOnlyField}
					>
						<option className="capitalize" value={'new'}>
							New
						</option>
						<option className="capitalize" value={'reorder'}>
							Reorder
						</option>
					</select>
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
						placeholder="Enter order description"
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

const orderStatus = ['pending', 'cancelled', 'received'];
