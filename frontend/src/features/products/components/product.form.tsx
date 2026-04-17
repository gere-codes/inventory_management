import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { closeModal, EModalMode } from '@common';
import { Button, InputField, TextareaField } from '@ui';
import { productSchema, type TProduct } from '../product.schema';
import { useAppDispatch, useAppSelector } from '@hooks';
import { categoryThunk, selectCategories } from '@categories';
import { productThunk } from '../product.thunk';

interface Props {
	mode: EModalMode;
	productData?: Partial<TProduct> | null;
}

export const ProductForm = ({ mode, productData }: Props) => {
	const categories = useAppSelector(selectCategories);

	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<TProduct>({
		resolver: zodResolver(productSchema),
		mode: 'all',
		defaultValues: productData || {},
	});

	useEffect(() => {
		dispatch(categoryThunk.getAll());
	}, [dispatch]);

	const onSubmit = (data: TProduct) => {
		if (data.id) {
			dispatch(productThunk.update({ id: data.id, body: data }));
		} else {
			dispatch(productThunk.create(data));
		}
		dispatch(closeModal());
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6" data-testid="product-form">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
					<label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 ">
						Category*
					</label>
					<select
						{...register('categoryId')} // Directly register the ID
						id="categoryId"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px]"
					>
						<option value="">Select a category</option>
						{categories?.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{' '}
								{/* Value is the UUID */}
								{cat.name} {/* Label is the Name */}
							</option>
						))}
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
