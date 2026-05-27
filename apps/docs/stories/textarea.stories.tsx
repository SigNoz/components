import { Textarea } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof Textarea> = {
	title: 'Components/Textarea',
	component: Textarea,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Multi-line text input. Mirrors `Input` styling via shared tokens and exposes an `autoSize` mode that grows the field with content between optional `minRows`/`maxRows` bounds. Also available as `Input.TextArea` for Ant Design drop-in compatibility.',
			},
		},
	},
	argTypes: {
		value: { control: 'text', table: { category: 'Form' } },
		defaultValue: { control: 'text', table: { category: 'Form' } },
		placeholder: { control: 'text', table: { category: 'Form' } },
		rows: { control: 'number', table: { category: 'Layout' } },
		cols: { control: 'number', table: { category: 'Layout' } },
		autoSize: { control: false, table: { category: 'Layout' } },
		size: {
			control: 'inline-radio',
			options: ['small', 'middle', 'large'],
			table: { category: 'Appearance' },
		},
		status: {
			control: 'inline-radio',
			options: [undefined, 'error', 'warning'],
			table: { category: 'Appearance' },
		},
		disabled: { control: 'boolean', table: { category: 'Behavior' } },
		readOnly: { control: 'boolean', table: { category: 'Behavior' } },
		required: { control: 'boolean', table: { category: 'Behavior' } },
		maxLength: { control: 'number', table: { category: 'Behavior' } },
		onChange: { control: false, table: { category: 'Events' } },
	},
};

export default meta;

type Story = StoryObj<typeof Textarea>;

/* -------------------------------------------------------------------------- */
/*  Shared layout helpers                                                     */
/* -------------------------------------------------------------------------- */

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-3">
			<header className="space-y-1">
				<h3 className="text-sm font-medium text-vanilla-800 dark:text-vanilla-200">{title}</h3>
				{description && (
					<p className="text-xs text-vanilla-600 dark:text-vanilla-400">{description}</p>
				)}
			</header>
			<div className="space-y-3">{children}</div>
		</section>
	);
}

function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block space-y-1.5">
			<span className="block text-xs font-medium text-vanilla-700 dark:text-vanilla-300">
				{label}
			</span>
			{children}
			{hint && (
				<span className="block text-[11px] text-vanilla-500 dark:text-vanilla-500">{hint}</span>
			)}
		</label>
	);
}

/* -------------------------------------------------------------------------- */
/*  Primary                                                                   */
/* -------------------------------------------------------------------------- */

/** Playground — explore every prop. */
export const Playground: Story = {
	args: {
		rows: 4,
		placeholder: 'Write your feedback here...',
	},
	render: (args) => (
		<div className="p-8 max-w-md bg-background">
			<Textarea {...args} />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/*  Core props                                                                */
/* -------------------------------------------------------------------------- */

/** Basic — fixed-row textarea, the most common usage. */
export const Basic: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Pass `rows` to set the visible row count. The user can drag the bottom-right corner to resize vertically.',
			},
		},
	},
	render: () => {
		const [value, setValue] = useState('');
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Basic">
					<Field label="Feedback" hint="rows={6}, controlled value.">
						<Textarea
							rows={6}
							placeholder="Write your feedback here..."
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</Field>
					<p className="text-[11px] text-vanilla-500 dark:text-vanilla-500">
						length: <code className="font-mono">{value.length}</code>
					</p>
				</Section>
			</div>
		);
	},
};

/** States — default, disabled, readOnly. */
export const States: Story = {
	render: () => (
		<div className="p-8 max-w-md bg-background">
			<Section title="States" description="Same textarea, three interactive states.">
				<Field label="Default">
					<Textarea rows={3} placeholder="Type something..." />
				</Field>
				<Field label="Disabled" hint="Cannot be focused or edited.">
					<Textarea rows={3} defaultValue="Locked content" disabled />
				</Field>
				<Field label="Read-only" hint="Can be selected but not edited.">
					<Textarea rows={3} defaultValue="Read-only content" readOnly />
				</Field>
			</Section>
		</div>
	),
};

/** Sizes — `small` / `middle` / `large`. */
export const Sizes: Story = {
	render: () => (
		<div className="p-8 max-w-md bg-background">
			<Section title="Sizes">
				<Field label="Small" hint='size="small"'>
					<Textarea size="small" rows={2} defaultValue="Compact" />
				</Field>
				<Field label="Middle (default)" hint='size="middle"'>
					<Textarea size="middle" rows={2} defaultValue="Default" />
				</Field>
				<Field label="Large" hint='size="large"'>
					<Textarea size="large" rows={2} defaultValue="Roomy" />
				</Field>
			</Section>
		</div>
	),
};

/** Validation status — `error` and `warning`. */
export const Status: Story = {
	render: () => (
		<div className="p-8 max-w-md bg-background">
			<Section title="Status" description="Paints a colored border and matching focus ring.">
				<Field label="Error" hint='status="error"'>
					<Textarea status="error" rows={3} defaultValue="This value is invalid." />
				</Field>
				<Field label="Warning" hint='status="warning"'>
					<Textarea status="warning" rows={3} defaultValue="Heads up — review this." />
				</Field>
			</Section>
		</div>
	),
};

/** Auto-size — grow with content between `minRows` and `maxRows`. */
export const AutoSize: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`autoSize` measures content height and resizes the textarea in place. Pass `true` for unbounded growth, or `{ minRows, maxRows }` to clamp. At `maxRows`, the textarea scrolls internally.',
			},
		},
	},
	render: () => {
		const [a, setA] = useState('');
		const [b, setB] = useState('Start typing more lines and watch this grow up to 6 rows...\n');
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Auto-size">
					<Field label="Unbounded" hint="autoSize">
						<Textarea
							autoSize
							placeholder="Grows with content..."
							value={a}
							onChange={(e) => setA(e.target.value)}
						/>
					</Field>
					<Field label="Clamped" hint="autoSize={{ minRows: 1, maxRows: 6 }}">
						<Textarea
							autoSize={{ minRows: 1, maxRows: 6 }}
							value={b}
							onChange={(e) => setB(e.target.value)}
						/>
					</Field>
				</Section>
			</div>
		);
	},
};

