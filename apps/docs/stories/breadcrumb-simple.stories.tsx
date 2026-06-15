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

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Icons
				</h3>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', href: '#', icon: <Home size={16} /> },
						{ title: 'Application Center', href: '#', icon: <Folder size={16} /> },
						{ title: 'Application List', href: '#', icon: <Settings size={16} /> },
						{ title: 'An Application' },
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Chevron Separator
				</h3>
				<BreadcrumbSimple separator="chevron" items={defaultItems} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Custom Separator
				</h3>
				<BreadcrumbSimple separator=">" items={defaultItems} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Colon Separator
				</h3>
				<BreadcrumbSimple
					separator=":"
					items={[
						{ title: 'Location', href: '#' },
						{ title: 'Building A', href: '#' },
						{ title: 'Room 101' },
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Dropdown Menu
				</h3>
				<BreadcrumbSimple
					items={[
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
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Click Handlers
				</h3>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', onClick: fn() },
						{ title: 'Products', onClick: fn() },
						{ title: 'Electronics', onClick: fn() },
						{ title: 'Phones' },
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Test Id
				</h3>
				<BreadcrumbSimple
					testId="nav-breadcrumb"
					items={[
						{ title: 'Home', href: '#' },
						{ title: 'Products', href: '#' },
						{ title: 'Details' },
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Single Item
				</h3>
				<BreadcrumbSimple items={[{ title: 'Dashboard' }]} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Two Items
				</h3>
				<BreadcrumbSimple items={[{ title: 'Home', href: '#' }, { title: 'Settings' }]} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Many Items
				</h3>
				<BreadcrumbSimple
					items={[
						{ title: 'Home', href: '#' },
						{ title: 'Category', href: '#' },
						{ title: 'Subcategory', href: '#' },
						{ title: 'Product Type', href: '#' },
						{ title: 'Brand', href: '#' },
						{ title: 'Product Details' },
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Icons And Dropdown
				</h3>
				<BreadcrumbSimple
					items={[
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
					]}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Class Name
				</h3>
				<BreadcrumbSimple
					style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.25rem' }}
					items={defaultItems}
				/>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Aria Label
				</h3>
				<BreadcrumbSimple aria-label="Page navigation breadcrumb" items={defaultItems} />
			</section>
		</div>
	),
};
