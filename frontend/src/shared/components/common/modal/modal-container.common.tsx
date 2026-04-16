import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { EModalType } from './modal.enum';
import { selectModal } from './moda.selector';
import { Modal } from './modal.common';
import { closeModal } from './modal.slice';
import { ProductForm } from '@products';

export const ModalContainer = () => {
	const { type, mode, data } = useAppSelector(selectModal);
	const dispathc = useAppDispatch();

	if (!type) return null;

	const renderModal = (type: EModalType) => {
		switch (type) {
			case EModalType.PRODUCT:
				return <ProductForm mode={mode} productData={data} />;

			default:
				return null;
		}
	};

	return <Modal onClose={() => dispathc(closeModal())}>{renderModal(type)}</Modal>;
};
