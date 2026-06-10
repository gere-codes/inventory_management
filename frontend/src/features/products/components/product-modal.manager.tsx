import { closeModal, Confirmation, EModalMode, EntityModalManager } from '@common';
import type { TProduct, TProductFormValues } from '../product.schema';
import { useAppDispatch } from '@hooks';
import { productThunk } from '../product.thunk';
import { ProductForm } from './product.form';
import { useProductData } from '../product.hook';

interface Props {
	mode: EModalMode;
	productData: TProduct;
}

export const ProductModalManager = ({ productData, mode }: Props) => {
	const { fetchData, data, pagination, status } = useProductData();

	return (
		<EntityModalManager
			mode={mode}
			initialData={productData}
			entityName="Product"
			deleteThunk={productThunk.delete}
			fetchData={fetchData}
			FormComponent={ProductForm}
		/>
	);
};
