import type { TSupplier } from '../supplier.schema';
import { SupplierForm } from './supplier.form';
import { Confirmation, EModalMode } from '@common';
import { useSupplierManager } from '../supplier.hook';

interface Props {
	mode: EModalMode;
	supplierData: TSupplier;
}

export const SupplierModalManager = ({ mode, supplierData }: Props) => {
	const { close, handleDelete } = useSupplierManager(supplierData);

	switch (mode) {
		case EModalMode.DELETE:
			return (
				<Confirmation
					title="Delete Supplier?"
					name={supplierData.name}
					onCancel={close}
					onConfirm={handleDelete}
				/>
			);
		case EModalMode.CREATE:
		case EModalMode.EDIT:
			return <SupplierForm supplierData={supplierData} mode={mode} />;
		default:
			return null;
	}
};
