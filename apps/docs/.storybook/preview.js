import './preview.css';
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
};

export const decorators = [ModeDecorator];

export const tags = ['autodocs'];
