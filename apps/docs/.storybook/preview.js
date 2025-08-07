import './preview.css';
import { themes } from '@storybook/theming';
import { ModeDecorator } from './modeDecorator';

// Configure Storybook parameters
export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	// Set dark mode as default
	themes: {
		default: 'dark',
		list: [
			{ name: 'light', class: 'light', color: '#ffffff' },
			{ name: 'dark', class: 'dark', color: '#000000' },
		],
	},
	// Improve docs appearance and layout
	docs: {
		theme: themes.dark,
		// Ensure docs pages use full width
		layout: 'fullscreen',
	},
	// Set layout to fullscreen for all pages
	layout: 'fullscreen',
};

export const decorators = [ModeDecorator];

export const tags = ['autodocs'];
