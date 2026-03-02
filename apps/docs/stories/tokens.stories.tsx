import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	GROUP_DESCRIPTIONS,
	GROUP_LABELS,
	TokenReference,
} from '../components/TokenReference/index.js';

const meta: Meta<typeof TokenReference> = {
	title: 'Design System/Tokens',
	component: TokenReference,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'dark',
			values: [
				{ name: 'dark', value: '#0b0c0e' },
				{ name: 'light', value: '#ffffff' },
			],
		},
	},
};

export default meta;
type Story = StoryObj<typeof TokenReference>;

export const AllTokens: Story = {
	name: 'All Tokens',
	args: {},
	render: (args) => <TokenReference {...args} />,
};

export const SurfaceLevels: Story = {
	name: 'Surface Levels',
	render: () => (
		<TokenReference
			groups={['surface-levels']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['surface-levels']}
			description={GROUP_DESCRIPTIONS['surface-levels']}
		/>
	),
};

export const Actions: Story = {
	name: 'Actions',
	render: () => (
		<TokenReference
			groups={['actions']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['actions']}
			description={GROUP_DESCRIPTIONS['actions']}
		/>
	),
};

export const Callouts: Story = {
	name: 'Callouts',
	render: () => (
		<TokenReference
			groups={['callouts']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['callouts']}
			description={GROUP_DESCRIPTIONS['callouts']}
		/>
	),
};

export const Accents: Story = {
	name: 'Accents',
	render: () => (
		<TokenReference
			groups={['accents']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['accents']}
			description={GROUP_DESCRIPTIONS['accents']}
		/>
	),
};

export const Sidebar: Story = {
	name: 'Sidebar',
	render: () => (
		<TokenReference
			groups={['sidebar']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['sidebar']}
			description={GROUP_DESCRIPTIONS['sidebar']}
		/>
	),
};

export const Charts: Story = {
	name: 'Charts',
	render: () => (
		<TokenReference
			groups={['charts']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['charts']}
			description={GROUP_DESCRIPTIONS['charts']}
		/>
	),
};

export const Typography: Story = {
	name: 'Typography',
	render: () => (
		<TokenReference
			groups={['fonts']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['fonts']}
			description={GROUP_DESCRIPTIONS['fonts']}
		/>
	),
};

export const Base: Story = {
	name: 'Base',
	render: () => (
		<TokenReference
			groups={['base']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['base']}
			description={GROUP_DESCRIPTIONS['base']}
		/>
	),
};

export const Alerts: Story = {
	name: 'Alerts',
	render: () => (
		<TokenReference
			groups={['alerts']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['alerts']}
			description={GROUP_DESCRIPTIONS['alerts']}
		/>
	),
};

export const Legacy: Story = {
	name: 'Legacy',
	render: () => (
		<TokenReference
			groups={['legacy']}
			mode="semantic"
			showModeTabs={false}
			showCategoryFilter={false}
			title={GROUP_LABELS['legacy']}
			description={GROUP_DESCRIPTIONS['legacy']}
		/>
	),
};

export const PrimitiveColors: Story = {
	name: 'Primitive Colors',
	render: () => (
		<TokenReference
			mode="primitive"
			showModeTabs={false}
			showCategoryFilter={false}
			showThemeToggle={false}
			title="Primitive Colors"
			description="Raw color palette used as building blocks for semantic tokens"
		/>
	),
};
