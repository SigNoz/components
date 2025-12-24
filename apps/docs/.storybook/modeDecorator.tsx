import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModeDecorator = (Story: any) => {
	const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode
	const [mounted, setMounted] = useState(false);

	const toggleMode = useCallback(() => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark', !isDarkMode);
	}, [isDarkMode]);

	// Initialize dark mode on mount
	useEffect(() => {
		document.documentElement.classList.add('dark');
		setMounted(true);
	}, []);

	// Render button using portal to body to avoid transform container issues
	const button = (
		<button
			onClick={toggleMode}
			className="fixed top-4 right-4 z-50 p-2 rounded-2xl
                                 bg-gray-800 border border-gray-600 shadow-lg
                                 hover:scale-105 transition-transform cursor-pointer"
			aria-label="Toggle dark mode"
			title="Toggle Dark Mode"
			style={{
				backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
				borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
				color: isDarkMode ? '#ffffff' : '#000000',
				padding: '0.375rem',
			}}
		>
			{isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
		</button>
	);

	return (
		<>
			{/* Render button via portal to body to escape transform containers */}
			{mounted && createPortal(button, document.body)}
			<Story />
		</>
	);
};
