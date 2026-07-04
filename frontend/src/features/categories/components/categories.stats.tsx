import { DynamicPieChart } from '@common';
import { useCategoryStats } from '../category.hook';

export const CategoriesStats = () => {
	const categoryStats = useCategoryStats();

	return (
		<section className="lg:pt-24">
			<h2 className="text-center font-bold text-gray-600 underline underline-offset-4">Products by Categories</h2>
			<DynamicPieChart data={categoryStats.data?.productsPerCategory || []} />
		</section>
	);
};
