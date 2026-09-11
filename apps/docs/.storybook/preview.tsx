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
import { settleForCapture } from './settleForCapture.js';

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
				'Design System',
				'Primitive Components',
				'Composed Components',
				'Old Components',
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

export const globalTypes: Preview['globalTypes'] = {
	motion: {
		description:
			'Park every animation on its last frame once the story has settled. Still is what Chromatic shoots; Live is for watching a transition.',
		toolbar: {
			title: 'Motion',
			icon: 'play',
			items: [
				{ value: 'still', title: 'Still' },
				{ value: 'live', title: 'Live' },
			],
			dynamicTitle: true,
		},
	},
};

export const initialGlobals: Preview['initialGlobals'] = { motion: 'still' };

export const afterEach: Preview['afterEach'] = settleForCapture;
