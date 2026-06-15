import {
	Select,
	SelectContent,
	SelectItem,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectTrigger,
	SelectViewport,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta = {
	title: 'Primitive Components/Select/SelectScrollButtons',
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const manyItems = Array.from({ length: 50 }, (_, i) => ({
	value: `item-${i + 1}`,
	label: `Item ${i + 1}`,
}));

function ScrollUpButtonOnlyExample() {
	const [value, setValue] = useState('item-50');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				SelectScrollUpButton appears when scrolled down and there is content above.
			</p>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select an item..." />
				<SelectContent withViewport={false}>
					<SelectScrollUpButton />
					<SelectViewport style={{ maxHeight: '200px' }}>
						{manyItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectViewport>
				</SelectContent>
			</Select>
		</div>
	);
}

function ScrollDownButtonOnlyExample() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				SelectScrollDownButton appears when there is more content below.
			</p>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select an item..." />
				<SelectContent withViewport={false}>
					<SelectViewport style={{ maxHeight: '200px' }}>
						{manyItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectViewport>
					<SelectScrollDownButton />
				</SelectContent>
			</Select>
		</div>
	);
}

function CustomScrollButtonContentExample() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				You can provide custom content to the scroll buttons.
			</p>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select an item..." />
				<SelectContent withViewport={false}>
					<SelectScrollUpButton>
						<span style={{ fontSize: '0.75rem' }}>Scroll Up</span>
					</SelectScrollUpButton>
					<SelectViewport style={{ maxHeight: '200px' }}>
						{manyItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectViewport>
					<SelectScrollDownButton>
						<span style={{ fontSize: '0.75rem' }}>Scroll Down</span>
					</SelectScrollDownButton>
				</SelectContent>
			</Select>
		</div>
	);
}

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					ScrollUpButton and ScrollDownButton provide visual affordances for scrolling when the
					content overflows. They appear at the top/bottom of the viewport when there is more
					content to scroll.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton />
						<SelectViewport style={{ maxHeight: '200px' }}>
							{manyItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectViewport>
						<SelectScrollDownButton />
					</SelectContent>
				</Select>
				<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					Selected: {value || 'none'}
				</p>
			</div>
		);
	},
};

export const Preview: Story = {
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
					Scroll Up Button Only
				</h3>
				<ScrollUpButtonOnlyExample />
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
					Scroll Down Button Only
				</h3>
				<ScrollDownButtonOnlyExample />
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
					Custom Scroll Button Content
				</h3>
				<CustomScrollButtonContentExample />
			</section>
		</div>
	),
};
