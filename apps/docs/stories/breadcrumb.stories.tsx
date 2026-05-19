import { Folder, Home, Settings, User } from '@signozhq/icons';
import {
	Breadcrumb,
	BreadcrumbDropdown,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbSimple,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { breadcrumbSimpleArgTypes } from './shared/breadcrumb-arg-types.js';

const meta: Meta<typeof BreadcrumbSimple> = {
	title: 'Components/Breadcrumb',
	component: BreadcrumbSimple,
	argTypes: breadcrumbSimpleArgTypes,
	parameters: {
		layout: 'padded',
		backgrounds: {
			default: 'dark',
		},
		docs: {
			source: {
				type: 'code',
			},
		},
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4643-265&m=dev',
			},
		],
	},
};

export default meta;
type Story = StoryObj<typeof BreadcrumbSimple>;

export const Default: Story = {
	args: {
		items: [
			{ title: 'Home', href: '#' },
			{ title: 'Application Center', href: '#' },
			{ title: 'Application List', href: '#' },
			{ title: 'An Application' },
		],
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
		items: [
			{ title: 'Home', href: '#' },
			{ title: 'Application Center', href: '#' },
			{ title: 'Application List', href: '#' },
			{ title: 'An Application' },
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

export const PrimitiveExample: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#" icon={<Home size={16} />}>
						Home
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown
						items={[
							{ title: 'Documentation', href: '#' },
							{ title: 'Themes', href: '#' },
							{ title: 'GitHub', href: '#' },
						]}
					>
						Components
					</BreadcrumbDropdown>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current Page</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithEllipsis: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbEllipsis />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Components</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const AllFeatures: Story = {
	render: () => (
		<div className="space-y-8">
			<div>
				<Typography variant="title" level={5} className="mb-2">
					Basic
				</Typography>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', href: '#' },
						{ title: 'Application Center', href: '#' },
						{ title: 'Application List' },
					]}
				/>
			</div>

			<div>
				<Typography variant="title" level={5} className="mb-2">
					With Icons
				</Typography>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', href: '#', icon: <Home size={16} /> },
						{ title: 'Users', href: '#', icon: <User size={16} /> },
						{ title: 'Profile' },
					]}
				/>
			</div>

			<div>
				<Typography variant="title" level={5} className="mb-2">
					Chevron Separator
				</Typography>
				<BreadcrumbSimple
					separator="chevron"
					items={[
						{ title: 'Home', href: '#' },
						{ title: 'Application Center', href: '#' },
						{ title: 'An Application' },
					]}
				/>
			</div>

			<div>
				<Typography variant="title" level={5} className="mb-2">
					With Dropdown
				</Typography>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', href: '#' },
						{
							title: 'User',
							menu: [
								{ title: 'User 1', href: '#' },
								{ title: 'User 2', href: '#' },
								{ title: 'User 3', href: '#' },
							],
						},
						{ title: 'Profile' },
					]}
				/>
			</div>

			<div>
				<Typography variant="title" level={5} className="mb-2">
					Custom Separator
				</Typography>
				<BreadcrumbSimple
					separator=":"
					items={[
						{ title: 'Location', href: '#' },
						{ title: 'Application Center', href: '#' },
						{ title: 'Application List' },
					]}
				/>
			</div>

			<div>
				<Typography variant="title" level={5} className="mb-2">
					Composable (with ellipsis)
				</Typography>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbEllipsis />
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Components</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	),
};
