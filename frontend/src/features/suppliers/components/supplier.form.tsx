import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@hooks';
import { closeModal, EModalMode } from '@common';
import { supplierFormSchema, type TSupplier, type TSupplierForm } from '../supplier.schema';
import { Button, InputField, TextareaField } from '@ui';
import { supplierThunk } from '../supplier.thunk';
import { selectSuppliersPagination } from '../supplier.selectors';

interface Props {
	mode: EModalMode;
	supplierData: TSupplier;
}

export const SupplierForm = ({ mode, supplierData }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TSupplierForm>({
		resolver: zodResolver(supplierFormSchema),
		mode: 'onBlur',
		values: {
			mode: mode,
			id: supplierData?.id,
			name: supplierData?.name ?? '',
			phone: supplierData?.phone ?? '',
			address: supplierData?.address ?? '',
			description: supplierData?.description ?? '',
			createdAt: supplierData?.createdAt ?? '',
			updatedAt: supplierData?.updatedAt ?? '',
		} as TSupplierForm,
	});

	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectSuppliersPagination);

	const dispatch = useAppDispatch();

	console.log(errors);
	const onSubmit = async (data: TSupplierForm) => {
		const body = {
			name: data?.name,
			phone: data?.phone,
			address: data?.address,
			description: data?.description,
			createdAt: data?.createdAt,
			updatedAt: data?.updatedAt,
		};

		if (data.mode === EModalMode.EDIT) {
			await dispatch(supplierThunk.update({ id: data.id, body }));
		} else {
			await dispatch(supplierThunk.create(body));
			await dispatch(supplierThunk.paginate({ page: currentPage, limit: itemsPerPage }));
		}
		dispatch(closeModal());
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-96 p-2">
			<h2 className="capitalize font-bold text-xl text-center mb-1">
				{mode === EModalMode.EDIT ? 'update product' : 'add product'}
			</h2>

			<section>
				<section className="flex gap-4 flex-col">
					<InputField {...register('name')} label="Name" id="name" error={errors.name?.message} />
					<InputField {...register('phone')} label="Phone" id="phone" error={errors.phone?.message} />
					<InputField {...register('address')} label="Address" id="address" error={errors.address?.message} />
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
