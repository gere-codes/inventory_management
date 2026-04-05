import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { LoginPage } from '@pages/index';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Routes>
				<Route path="/" element={<h1>home</h1>} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</>
	);
}

export default App;
