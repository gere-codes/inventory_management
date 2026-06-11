import { EModalMode, EntityModalManager } from '@common';
import type { TCategory } from '../category.schema';
import { CategoryForm } from './category.form';
import { categoryThunk } from '../category.thunk';
import { useCategoryData } from '../category.hook';

interface Props {
	mode: EModalMode;
	categoryData: TCategory;
}

export const CategoryModalManager = ({ mode, categoryData }: Props) => {
	const { fetchData } = useCategoryData();

	return (
		<EntityModalManager
			mode={mode}
			initialData={categoryData}
			entityName="Category"
			deleteThunk={categoryThunk.delete}
			fetchData={fetchData}
			FormComponent={CategoryForm}
		/>
	);
};
