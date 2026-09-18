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

/**
 * Globals rather than parameters, because a Chromatic mode is a named set of globals (see
 * `modes.ts`): anything a snapshot has to vary has to be one, and the toolbar control comes free.
 * `ModeDecorator` reads all three and applies them to the document.
 */
export const globalTypes: Preview['globalTypes'] = {
	theme: {
		description: 'SigNoz color scheme',
		toolbar: {
			title: 'Theme',
			icon: 'paintbrush',
			items: [
				{ value: 'dark', title: 'Dark' },
				{ value: 'light', title: 'Light' },
			],
			dynamicTitle: true,
		},
	},
	motion: {
		description:
			'Park every animation on its last frame once the story has settled. Still is what both capture stacks shoot; Live is for watching a transition.',
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
	// Enable once we finish the migration of the components (with new Semantic Tokens)
	// palette: {
	// 	description: 'Token sheet the components read',
	// 	toolbar: {
	// 		title: 'Palette',
	// 		icon: 'paintbrushalt',
	// 		items: [
	// 			{ value: 'default', title: 'Default' },
	// 			{ value: 'blue-demo', title: 'Blue demo' },
	// 		],
	// 		dynamicTitle: true,
	// 	},
	// },
};

export const initialGlobals: Preview['initialGlobals'] = {
	theme: 'dark',
	palette: 'default',
	motion: 'still',
};

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
