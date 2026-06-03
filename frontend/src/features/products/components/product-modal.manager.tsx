import { closeModal, Confirmation, EModalMode } from '@common';
import type { TProduct, TProductFormValues } from '../product.schema';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectProducts, selectProductsPagination } from '../product.selectors';
import { productThunk } from '../product.thunk';
import { ProductForm } from './product.form';

interface Props {
	mode: EModalMode;
	productData: TProduct;
}

export const ProductModalManager = ({ productData, mode }: Props) => {
	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { page, limit } = useAppSelector(selectProductsPagination);

	const close = () => {
		dispatch(closeModal());
	};

	const handleDelete = async () => {
		if (!productData?.id) return;
		await dispatch(productThunk.delete(productData.id)).unwrap();
		const nextPage = page !== 1 && products.length === 1 ? page - 1 : page;
		dispatch(
			productThunk.paginate({
				page: nextPage,
				limit: limit,
			}),
		);

		close();
	};

	switch (mode) {
		case EModalMode.DELETE:
			return (
				<Confirmation
					title="Delete Product?"
					name={productData.name}
					onCancel={close}
					onConfirm={handleDelete}
				/>
			);
		case EModalMode.CREATE:
		case EModalMode.EDIT:
			return <ProductForm productData={productData} mode={mode} />;
	}
};
