import { closeModal, Confirmation, EModalMode } from '@common';
import type { TCategory } from '../category.schema';
import { CategoryForm } from './category.form';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { categoryThunk } from '../category.thunk';
import { selectCategories, selectCategoryPagination } from '../category.selectors';

interface Props {
	mode: EModalMode;
	categoryData: TCategory;
}

export const CategoryModalManager = ({ mode, categoryData }: Props) => {
	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);

	const { currentPage, itemsPerPage } = useAppSelector(selectCategoryPagination);

	const close = () => {
		dispatch(closeModal());
	};

	const handleDelete = async () => {
		if (!categoryData?.id) return;
		await dispatch(categoryThunk.delete(categoryData.id)).unwrap();
		const nextPage = currentPage !== 1 && categories.length === 1 ? currentPage - 1 : currentPage;
		dispatch(
			categoryThunk.paginate({
				page: nextPage,
				limit: itemsPerPage,
			}),
		);

		close();
	};

	switch (mode) {
		case EModalMode.DELETE:
			return (
				<Confirmation
					title="Delete Category?"
					name={categoryData.name}
					onCancel={close}
					onConfirm={handleDelete}
				/>
			);
		case EModalMode.CREATE:
		case EModalMode.EDIT:
			return <CategoryForm categoryData={categoryData} mode={mode} />;
	}
};
