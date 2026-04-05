import { useState } from 'react';
import { Route, Routes } from 'react-router';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Routes>
				<Route path="/" element={<h1>Home</h1>} />
			</Routes>
		</>
	);
}

export default App;
