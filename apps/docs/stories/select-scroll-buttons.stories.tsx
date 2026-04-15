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
	title: 'Components/Select/SelectScrollButtons',
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

export const WithScrollButtons: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
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
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const ScrollUpButtonOnly: Story = {
	render: () => {
		const [value, setValue] = useState('item-50');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
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
	},
};

export const ScrollDownButtonOnly: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
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
	},
};

export const CustomScrollButtonContent: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					You can provide custom content to the scroll buttons.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton>
							<span className="text-xs">Scroll Up</span>
						</SelectScrollUpButton>
						<SelectViewport style={{ maxHeight: '200px' }}>
							{manyItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectViewport>
						<SelectScrollDownButton>
							<span className="text-xs">Scroll Down</span>
						</SelectScrollDownButton>
					</SelectContent>
				</Select>
			</div>
		);
	},
};
