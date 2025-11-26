import './preview.css';
import { themes } from '@storybook/theming';
import { ModeDecorator } from './modeDecorator';
import {
	Title,
	Subtitle,
	Description,
	Primary,
	Controls,
	Stories,
} from '@storybook/blocks';
import React from 'react';

// Configure Storybook parameters
export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	selectedPanel: 'controls',

	backgrounds: { disable: true },

	docs: {
		theme: themes.dark,
		canvas: {
			withToolbar: false,
		},
		page: () => (
			<>
				<Title />
				<Subtitle />
				<Description />
				<Primary />
				<Controls />
				<Stories includePrimary={false} title="Examples" />
			</>
		),
		layout: 'centered',
	},
	// Set layout to centered for all pages
	layout: 'centered',
};

export const decorators = [ModeDecorator];

export const tags = ['autodocs'];
