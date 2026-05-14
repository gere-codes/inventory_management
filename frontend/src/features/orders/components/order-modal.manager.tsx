import type { TOrder } from '../order.schema';
import { useAppDispatch } from '@hooks';
import { Confirmation, EModalMode } from '@common';
import { OrderForm } from './order.form';

interface Props {
	mode: EModalMode;
	orderData: TOrder;
}

export const OrderModalManager = ({ mode, orderData }: Props) => {
	switch (mode) {
		case EModalMode.CREATE:
		case EModalMode.EDIT:
			return <OrderForm mode={mode} orderData={orderData} />;
		default:
			return null;
	}
};
