import type { EModalMode } from '@common';
import type { TCategory } from '../category.schema';
import { CategoryForm } from './category.form';

interface Props {
	mode: EModalMode;
	categoryData: TCategory;
}

export const CategoryModalManager = ({ mode, categoryData }: Props) => {
	return <CategoryForm categoryData={categoryData} mode={mode} />;
};
