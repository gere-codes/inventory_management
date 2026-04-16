import { closeModal, EModalMode } from '@common';
import { Button, InputField, TextareaField } from '@ui';
import type { TProduct } from '../product.schema';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { categoryThunk, selectCategories } from '@categories';

interface Props {
	mode: EModalMode;
	productData: TProduct;
}

export const ProductForm = ({ mode, productData }: Props) => {
	const [product, setProduct] = useState<TProduct>(productData);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const categories = useAppSelector(selectCategories);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(categoryThunk.getAll());
	}, [dispatch]);

	const noop = () => {};

	return (
		<form onSubmit={noop} className="bg-white p-6" data-testid="product-form">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Product Name */}
				<div className="md:col-span-2">
					<InputField
						label="Product Name*"
						type="text"
						id="name"
						name="name"
						value={product?.name}
						onChange={noop}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter product name"
						error={errors.name}
					/>
				</div>

				{/* Price */}
				<div>
					<InputField
						label="Price*"
						type="number"
						id="price"
						name="price"
						value={product?.price}
						onChange={noop}
						required
						min="0"
						step="0.01"
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="0.00"
						error={errors.price}
					/>
				</div>

				{/* SKU */}
				<div>
					<InputField
						label={'SKU*'}
						type="text"
						id="sku"
						name="sku"
						value={product?.sku}
						onChange={noop}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter SKU"
						error={errors.sku}
						disabled={mode === EModalMode.EDIT}
					/>
				</div>

				{/* Quantity */}
				<div>
					<InputField
						label="Quantity*"
						type="number"
						id="quantity"
						name="quantity"
						value={product?.quantity}
						onChange={noop}
						required
						min={mode === EModalMode.EDIT ? 0 : 1}
						step={1}
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="0"
						error={errors.quantity}
					/>
				</div>

				{/* Category */}
				<div>
					<label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 ">
						Category*
					</label>
					<select
						id="category"
						name="category"
						value={product?.category}
						onChange={noop}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px] "
					>
						<option value="">Select a category</option>
						{!categories ? (
							<option value="">Loading categories...</option>
						) : (
							categories?.map((category) => (
								<option className="h-50" key={category.id} value={category.name}>
									{category.name}
								</option>
							))
						)}
					</select>
				</div>

				{/* Description */}
				<div className="md:col-span-2">
					<TextareaField
						label="Description"
						id="description"
						name="description"
						value={product?.description || ''}
						onChange={noop}
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md "
						placeholder="Enter product description"
						error={errors.description}
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
