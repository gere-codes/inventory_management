import { Route, Routes } from 'react-router';
import { LoginPage, RegisterPage } from '@pages/index';
import { ProtectedRoute } from './shared/routes/protected.route';
import { PublicRoute } from './shared/routes/public.route';

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
					<Route path="/" element={<h1>home</h1>} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
