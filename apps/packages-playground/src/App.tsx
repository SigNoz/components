import React from 'react';

import { Button } from '@signozhq/button';
import './App.css';
import { ThemeSwitcher } from '@signozhq/theme';

function App() {
	return (
		<div>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />
			<Button variant="primary">hey</Button>
		</div>
	);
}

export default App;
