import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

// Configure the manager UI
addons.setConfig({
	theme: themes.dark, // Use dark theme for the manager UI
	sidebar: {
		showRoots: true,
		collapsedRoots: ['other'],
	},
	// Customize the manager UI
	selectedPanel: 'controls',
	initialActive: 'sidebar',
	// Improve the overall appearance
	panelPosition: 'bottom',
	showNav: true,
	showPanel: true,
	showToolbar: true,
});
