import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModeDecorator = (Story: any) => {
	const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode

	const toggleMode = useCallback(() => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark', !isDarkMode);
	}, [isDarkMode]);

	// Initialize dark mode on mount
	useEffect(() => {
		document.documentElement.classList.add('dark');
	}, []);

	return (
		<div className={isDarkMode ? 'dark' : ''}>
			<button
				onClick={toggleMode}
				className="fixed top-4 right-4 z-50 p-2 rounded-2xl
                                 bg-gray-800 border border-gray-600 shadow-lg
                                 hover:scale-105 transition-transform cursor-pointer"
				aria-label="Toggle dark mode"
				style={{
					backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
					borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
					color: isDarkMode ? '#ffffff' : '#000000',
				}}
			>
				{isDarkMode ? (
					<Sun className="size-2" style={{ color: '#ffffff' }} />
				) : (
					<Moon className="size-2" style={{ color: '#000000' }} />
				)}
			</button>
			<div
				className="min-h-screen"
				style={{
					backgroundColor: isDarkMode ? '#0b0c0e' : '#ffffff',
					color: isDarkMode ? '#ffffff' : '#000000',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					lineHeight: '1.6',
					padding: '2rem',
				}}
			>
				<Story />
			</div>
		</div>
	);
};
