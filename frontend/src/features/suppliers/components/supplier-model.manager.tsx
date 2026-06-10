import type { TSupplier } from '../supplier.schema';
import { SupplierForm } from './supplier.form';
import { Confirmation, EModalMode, EntityModalManager } from '@common';
import { useSupplierData, useSupplierManager } from '../supplier.hook';
import { supplierThunk } from '../supplier.thunk';

interface Props {
	mode: EModalMode;
	supplierData: TSupplier;
}

export const SupplierModalManager = ({ mode, supplierData }: Props) => {
	const fetchSupplier = useSupplierData();

	return (
		<EntityModalManager
			mode={mode}
			initialData={supplierData}
			entityName="Supplier"
			deleteThunk={supplierThunk.delete}
			fetchData={fetchSupplier}
			FormComponent={SupplierForm}
		/>
	);
};
