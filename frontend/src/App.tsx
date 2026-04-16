import { Route, Routes } from 'react-router';
import { ProductsPage, LoginPage, RegisterPage, SuppliersPage, CategoriesPage } from '@pages';
import { ProtectedRoute, PublicRoute } from '@routes';
import { ModalContainer } from '@common';

function App() {
	return (
		<>
			<Routes>
				{/* Public Routes */}
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>

				{/* Private Routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<ProductsPage />} />
					<Route path="/suppliers" element={<SuppliersPage />} />
					<Route path="/categories" element={<CategoriesPage />} />
				</Route>
			</Routes>

			{/* Modal */}
			<ModalContainer />
		</>
	);
}

export default App;
