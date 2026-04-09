import { privateInstance } from '@/shared/api/instance.api';
import { useAppDispatch } from '@/shared/hooks';
import { useEffect } from 'react';

export const ProductsPage = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await privateInstance.get('/product');
				console.log(data?.data, 'categories');
			} catch (error) {
				console.log(error);
			}
		};

		fetchCategories();
	}, []);
	return (
		<section>
			<h1>Home page</h1>
		</section>
	);
};
