import React from 'react';

import { Button } from '@signozhq/button';
import './App.css';
import { ThemeSwitcher } from '@signozhq/theme';
import { Home, Code, Settings } from 'lucide-react';
import Tabs from '@signozhq/tabs';

function App() {
	return (
		<div>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />
			<Button variant="primary">hey</Button>
			<Tabs
				{...{
					defaultValue: 'overview',
					items: [
						{
							key: 'overview',
							label: <span>Overview</span>,
							prefixIcon: <Home size={16} />,
							children: (
								<div className="text-vanilla-400">
									<div className="text-xl font-semibold">Overview</div>
									<p>Overview content goes here.</p>
								</div>
							),
						},
						{
							key: 'issues',
							label: <span>Issues</span>,
							prefixIcon: <Code size={16} />,
							children: (
								<div className="text-vanilla-400">
									<div className="text-xl font-semibold">Issues</div>
									<p>Issues content goes here.</p>
								</div>
							),
						},
						{
							key: 'settings',
							label: <span>Settings</span>,
							prefixIcon: <Settings size={16} />,
							children: (
								<div className="text-vanilla-400">
									<div className="text-xl font-semibold">Settings</div>
									<p>Settings content goes here.</p>
								</div>
							),
						},
					],
				}}
			/>
		</div>
	);
}

export default App;
