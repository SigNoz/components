import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider, useTheme } from '@signozhq/theme';

function ThemedApp() {
	const { theme } = useTheme();

	return (
		<div className={`app ${theme}`}>
			<App />
		</div>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<ThemedApp />
		</ThemeProvider>
	</StrictMode>,
);
