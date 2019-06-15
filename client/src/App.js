import React from 'react';
import Header from './components/Header';

function App({ children }) {
	return (
		<div className="">
			<Header />
			{children}
		</div>
	);
}

export default App;
