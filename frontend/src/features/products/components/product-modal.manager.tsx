import { closeModal, Confirmation, EModalMode } from '@common';
import type { TProduct, TProductFormValues } from '../product.schema';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectProducts, selectProductsPagination } from '../product.selectors';
import { productThunk } from '../product.thunk';
import { ProductForm } from './product.form';

interface Props {
	mode: EModalMode;
	productData: TProductFormValues;
}

export const ProductModalManager = ({ productData, mode }: Props) => {
	const dispatch = useAppDispatch();
	const products = useAppSelector(selectProducts);
	const { currentPage, itemsPerPage } = useAppSelector(selectProductsPagination);

	const close = () => {
		dispatch(closeModal());
	};

	const handleDelete = async () => {
		if (!productData?.id) return;
		await dispatch(productThunk.delete(productData.id)).unwrap();
		const nextPage = currentPage !== 1 && products.length === 1 ? currentPage - 1 : currentPage;
		dispatch(
			productThunk.paginate({
				page: nextPage,
				limit: itemsPerPage,
			}),
		);

		close();
	};

	if (mode === EModalMode.DELETE) {
		return (
			<Confirmation
				title="Delete Product?"
				// message={`Are you sure you want to delete ${productData.name}?`}
				name={productData.name}
				onCancel={close}
				onConfirm={handleDelete}
			/>
		);
	}

	return <ProductForm productData={productData} mode={mode} />;
};
