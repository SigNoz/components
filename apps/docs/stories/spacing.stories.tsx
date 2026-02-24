import Spacing from '../components/Spacing.jsx';

export default {
	title: 'Design System/Spacing',
	component: Spacing,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#000' }],
		},
	},
};

export const SpacingScale = () => <Spacing />;
