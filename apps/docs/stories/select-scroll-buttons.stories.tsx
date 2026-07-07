import {
	Select,
	SelectContent,
	SelectItem,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectTrigger,
	SelectViewport,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from './select-scroll-buttons.stories.module.css';

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

export const WithScrollButtons: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="story-container">
				<Typography size="sm" color="muted" className={styles.descriptionText}>
					ScrollUpButton and ScrollDownButton provide visual affordances for scrolling when the
					content overflows. They appear at the top/bottom of the viewport when there is more
					content to scroll.
				</Typography>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton />
						<SelectViewport className={styles.viewport}>
							{manyItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectViewport>
						<SelectScrollDownButton />
					</SelectContent>
				</Select>
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {value || 'none'}
				</Typography>
			</div>
		);
	},
};

export const ScrollUpButtonOnly: Story = {
	render: () => {
		const [value, setValue] = useState('item-50');

		return (
			<div className="story-container">
				<Typography size="sm" color="muted" className={styles.descriptionText}>
					SelectScrollUpButton appears when scrolled down and there is content above.
				</Typography>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton />
						<SelectViewport className={styles.viewport}>
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
			<div className="story-container">
				<Typography size="sm" color="muted" className={styles.descriptionText}>
					SelectScrollDownButton appears when there is more content below.
				</Typography>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectViewport className={styles.viewport}>
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
			<div className="story-container">
				<Typography size="sm" color="muted" className={styles.descriptionText}>
					You can provide custom content to the scroll buttons.
				</Typography>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton>
							<Typography size="xs">Scroll Up</Typography>
						</SelectScrollUpButton>
						<SelectViewport className={styles.viewport}>
							{manyItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectViewport>
						<SelectScrollDownButton>
							<Typography size="xs">Scroll Down</Typography>
						</SelectScrollDownButton>
					</SelectContent>
				</Select>
			</div>
		);
	},
};
