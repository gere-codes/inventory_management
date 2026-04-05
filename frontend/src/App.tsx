import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { LoginPage, RegisterPage } from '@pages/index';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Routes>
				<Route path="/" element={<h1>home</h1>} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		</>
	);
}

export default App;
