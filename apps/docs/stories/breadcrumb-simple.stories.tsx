import { Folder, Home, Settings, User } from '@signozhq/icons';
import { BreadcrumbSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { breadcrumbSimpleArgTypes } from './shared/breadcrumb-arg-types.js';

const meta: Meta<typeof BreadcrumbSimple> = {
	title: 'Composed Components/BreadcrumbSimple',
	component: BreadcrumbSimple,
	argTypes: breadcrumbSimpleArgTypes,
	parameters: {
		layout: 'padded',
		backgrounds: { default: 'dark' },
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4643-265&m=dev',
			},
		],
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BreadcrumbSimple>;

const defaultItems = [
	{ title: 'Home', href: '#' },
	{ title: 'Application Center', href: '#' },
	{ title: 'Application List', href: '#' },
	{ title: 'An Application' },
];

export const Default: Story = {
	args: {
		items: defaultItems,
	},
};

export const WithIcons: Story = {
	args: {
		items: [
			{ title: 'Home', href: '#', icon: <Home size={16} /> },
			{ title: 'Application Center', href: '#', icon: <Folder size={16} /> },
			{ title: 'Application List', href: '#', icon: <Settings size={16} /> },
			{ title: 'An Application' },
		],
	},
};

export const ChevronSeparator: Story = {
	args: {
		separator: 'chevron',
		items: defaultItems,
	},
};

export const CustomSeparator: Story = {
	args: {
		separator: '>',
		items: defaultItems,
	},
};

export const ColonSeparator: Story = {
	args: {
		separator: ':',
		items: [
			{ title: 'Location', href: '#' },
			{ title: 'Building A', href: '#' },
			{ title: 'Room 101' },
		],
	},
};

export const WithDropdownMenu: Story = {
	args: {
		items: [
			{ title: 'Home', href: '#' },
			{
				title: 'Components',
				menu: [
					{ title: 'General', href: '#' },
					{ title: 'Layout', href: '#' },
					{ title: 'Navigation', href: '#' },
				],
			},
			{ title: 'General', href: '#' },
			{ title: 'Button' },
		],
	},
};

export const WithClickHandlers: Story = {
	args: {
		items: [
			{ title: 'Home', onClick: fn() },
			{ title: 'Products', onClick: fn() },
			{ title: 'Electronics', onClick: fn() },
			{ title: 'Phones' },
		],
	},
};

export const WithTestId: Story = {
	args: {
		testId: 'nav-breadcrumb',
		items: [{ title: 'Home', href: '#' }, { title: 'Products', href: '#' }, { title: 'Details' }],
	},
};

export const SingleItem: Story = {
	args: {
		items: [{ title: 'Dashboard' }],
	},
};

export const TwoItems: Story = {
	args: {
		items: [{ title: 'Home', href: '#' }, { title: 'Settings' }],
	},
};

export const ManyItems: Story = {
	args: {
		items: [
			{ title: 'Home', href: '#' },
			{ title: 'Category', href: '#' },
			{ title: 'Subcategory', href: '#' },
			{ title: 'Product Type', href: '#' },
			{ title: 'Brand', href: '#' },
			{ title: 'Product Details' },
		],
	},
};

export const WithIconsAndDropdown: Story = {
	args: {
		items: [
			{ title: 'Home', href: '#', icon: <Home size={16} /> },
			{
				title: 'Users',
				icon: <User size={16} />,
				menu: [
					{ title: 'User 1', href: '#' },
					{ title: 'User 2', href: '#' },
					{ title: 'User 3', href: '#' },
				],
			},
			{ title: 'Profile' },
		],
	},
};

export const WithClassName: Story = {
	args: {
		style: { backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.25rem' },
		items: defaultItems,
	},
};

export const WithAriaLabel: Story = {
	args: {
		'aria-label': 'Page navigation breadcrumb',
		items: defaultItems,
	},
};
