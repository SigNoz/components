import React, { useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModeDecorator = (Story: any) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleMode = useCallback(() => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark', !isDarkMode);
	}, [isDarkMode]);

	return (
		<div className={isDarkMode ? 'dark' : ''}>
			<button
				onClick={toggleMode}
				className="fixed top-4 right-4 z-50 p-2 rounded-full 
                 bg-background border border-border shadow-lg
                 hover:scale-105 transition-transform"
				aria-label="Toggle dark mode"
			>
				{isDarkMode ? (
					<Sun className="size-5 text-foreground" />
				) : (
					<Moon className="size-5 text-foreground" />
				)}
			</button>
			<div className="bg-background text-foreground min-h-screen p-8">
				<Story />
			</div>
		</div>
	);
};
