import React from 'react';
import Spacing from '../components/Spacing';

export default {
	title: 'Design System/Spacing',
	component: Spacing,
	parameters: {
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#000' }],
		},
	},
};

export const SpacingScale = () => <Spacing />;
