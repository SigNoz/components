import './preview.css';
import {
	Controls,
	Description,
	Primary,
	Stories,
	Subtitle,
	Title,
} from '@storybook/addon-docs/blocks';
import 'react-syntax-highlighter';
import type { Preview } from '@storybook/react-vite';
import { NuqsAdapter } from 'nuqs/adapters/react';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import { SyntaxHighlighter } from 'storybook/internal/components';
import { themes } from 'storybook/theming';
import { ModeDecorator } from './modeDecorator.jsx';

SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);

export const parameters: Preview['parameters'] = {
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	options: {
		storySort: {
			order: [
				'Intro',
				['Design System', 'Docs', '*'],
				['Components', 'Docs', '*'],
				['Old Components', 'Docs', '*'],
			],
		},
	},
	backgrounds: { disable: true },
	docs: {
		theme: themes.dark,
		canvas: {
			withToolbar: false,
		},
		page: () => (
			<>
				<h2 className="sbdocs sbdocs-h2" style={{ marginTop: 0 }}>
					Overview
				</h2>
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
	layout: 'centered',
};

export const decorators = [
	(Story) => (
		<NuqsAdapter>
			<Story />
		</NuqsAdapter>
	),
	ModeDecorator,
];

export const tags = ['autodocs'];
