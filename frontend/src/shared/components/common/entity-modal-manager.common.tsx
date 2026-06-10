import type { AsyncThunk } from '@reduxjs/toolkit';
import { EModalMode } from './modal/modal.enum';
import { useAppDispatch } from '@/shared/hooks';
import { closeModal } from './modal/modal.slice';
import { Confirmation } from './modal/modal.conformation';

interface Props<T extends { id: string; name: string }> {
	mode: EModalMode;
	initialData: T;
	entityName: string;
	deleteThunk: AsyncThunk<any, string, any>;
	fetchData: () => Promise<void>;
	FormComponent: React.ComponentType<{ initialData: T; mode: EModalMode.CREATE | EModalMode.EDIT }>;
}

export const EntityModalManager = <T extends { id: string; name: string }>({
	mode,
	initialData,
	entityName,
	deleteThunk,
	fetchData,
	FormComponent,
}: Props<T>) => {
	const dispatch = useAppDispatch();

	const close = () => {
		dispatch(closeModal());
	};

	const handleDelete = async () => {
		if (!initialData?.id) return;
		try {
			await dispatch(deleteThunk(initialData.id)).unwrap();
			await fetchData();
			close();
		} catch (error) {
			console.error(`Failed to delete ${entityName}:`, error);
		}
	};

	switch (mode) {
		case EModalMode.DELETE:
			return (
				<Confirmation
					title={`Delete ${entityName}`}
					name={initialData.name}
					onCancel={close}
					onConfirm={handleDelete}
				/>
			);
		case EModalMode.CREATE:
		case EModalMode.EDIT:
			return <FormComponent initialData={initialData} mode={mode} />;
		default:
			return null;
	}
};
