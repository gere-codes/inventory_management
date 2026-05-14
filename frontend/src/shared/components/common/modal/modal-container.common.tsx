import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { EModalType } from './modal.enum';
import { selectModal } from './moda.selector';
import { Modal } from './modal.common';
import { closeModal } from './modal.slice';
import { ProductModalManager } from '@products';
import { CategoryModalManager } from '@/features/categories/components/category-modal.manager';
import { SupplierModalManager } from '@suppliers';
import { OrderModalManager } from '@orders';

export const ModalContainer = () => {
	const { type, mode, data } = useAppSelector(selectModal);
	const dispathc = useAppDispatch();

	if (!type) return null;

	const renderModal = (type: EModalType) => {
		switch (type) {
			case EModalType.PRODUCT:
				return <ProductModalManager mode={mode} productData={data} />;
			case EModalType.CATEGORY:
				return <CategoryModalManager mode={mode} categoryData={data} />;
			case EModalType.SUPPLIER:
				return <SupplierModalManager mode={mode} supplierData={data} />;
			case EModalType.ORDER:
				return <OrderModalManager mode={mode} orderData={data} />;

			default:
				return null;
		}
	};

	return <Modal onClose={() => dispathc(closeModal())}>{renderModal(type)}</Modal>;
};
