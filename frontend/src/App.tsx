import { useState } from 'react';
import { Route, Routes } from 'react-router';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1 className="font-bold uppercase">home</h1>
		</>
	);
}

export default App;
