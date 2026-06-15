import {
	InputNumber,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof InputNumber> = {
	title: 'Primitive Components/InputNumber',
	component: InputNumber,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					"Numeric input with prefix/suffix, addonBefore/addonAfter, optional spinner controls, formatter/parser, sizes, variants, and status. API mirrors Ant Design's `InputNumber` for a drop-in migration path.",
			},
		},
	},
	argTypes: {
		value: { control: 'number', table: { category: 'Form' } },
		defaultValue: { control: 'number', table: { category: 'Form' } },
		min: { control: 'number', table: { category: 'Behavior' } },
		max: { control: 'number', table: { category: 'Behavior' } },
		step: { control: 'number', table: { category: 'Behavior' } },
		precision: { control: 'number', table: { category: 'Behavior' } },
		placeholder: { control: 'text', table: { category: 'Form' } },
		disabled: { control: 'boolean', table: { category: 'Behavior' } },
		readOnly: { control: 'boolean', table: { category: 'Behavior' } },
		controls: { control: 'boolean', table: { category: 'Behavior' } },
		mode: {
			control: 'inline-radio',
			options: ['input', 'spinner'],
			table: { category: 'Behavior' },
		},
		variant: {
			control: 'inline-radio',
			options: ['outlined', 'filled', 'borderless', 'underlined'],
			table: { category: 'Appearance' },
		},
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
		keyboard: { control: 'boolean', table: { category: 'Behavior' } },
		changeOnWheel: { control: 'boolean', table: { category: 'Behavior' } },
		changeOnBlur: { control: 'boolean', table: { category: 'Behavior' } },
		prefix: { control: false, table: { category: 'Appearance' } },
		suffix: { control: false, table: { category: 'Appearance' } },
		addonBefore: { control: false, table: { category: 'Appearance' } },
		addonAfter: { control: false, table: { category: 'Appearance' } },
		onChange: { control: false, table: { category: 'Events' } },
		onStep: { control: false, table: { category: 'Events' } },
		onPressEnter: { control: false, table: { category: 'Events' } },
	},
};

export default meta;

type Story = StoryObj<typeof InputNumber>;

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
		<section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<header style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
					{title}
				</h3>
				{description && (
					<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{description}</p>
				)}
			</header>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{children}</div>
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
		<label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
			<span
				style={{
					display: 'block',
					fontSize: '0.75rem',
					fontWeight: 500,
					color: 'var(--muted-foreground)',
				}}
			>
				{label}
			</span>
			{children}
			{hint && <span style={{ display: 'block', color: 'var(--muted-foreground)' }}>{hint}</span>}
		</label>
	);
}

function Output({ value }: { value: number | null }) {
	return (
		<p style={{ color: 'var(--muted-foreground)' }}>
			onChange: <code style={{ fontFamily: 'monospace' }}>{value === null ? 'null' : value}</code>
		</p>
	);
}

function FormatterPreview() {
	const [currency, setCurrency] = useState<number | null>(1000);
	const [percent, setPercent] = useState<number | null>(80);
	const [bytes, setBytes] = useState<number | null>(1024);
	return (
		<div style={{ padding: '2rem', maxWidth: '28rem', backgroundColor: 'var(--background)' }}>
			<Section title="Formatter & parser">
				<Field label="Currency" hint="Thousands separators + leading symbol.">
					<InputNumber
						value={currency}
						onChange={setCurrency}
						formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
					/>
					<Output value={currency} />
				</Field>
				<Field label="Percentage" hint="Clamped between 0 and 100.">
					<InputNumber
						value={percent}
						onChange={setPercent}
						min={0}
						max={100}
						formatter={(v) => `${v}%`}
						parser={(v) => v.replace('%', '')}
					/>
					<Output value={percent} />
				</Field>
				<Field label="Bytes" hint="Decimal separator can be customized.">
					<InputNumber
						value={bytes}
						onChange={setBytes}
						formatter={(v) => `${v} B`}
						parser={(v) => v.replace(/\s?B/g, '')}
					/>
					<Output value={bytes} />
				</Field>
			</Section>
		</div>
	);
}

function PrecisionPreview() {
	const [value, setValue] = useState<number | null>(1.234);
	return (
		<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
			<Field label="precision={2}" hint="Try typing 1.2345 — onChange will receive 1.23.">
				<InputNumber value={value} onChange={setValue} precision={2} step={0.01} controls />
				<Output value={value} />
			</Field>
		</div>
	);
}

function AddonsPreview() {
	const [unit, setUnit] = useState('GiB');
	return (
		<div style={{ padding: '2rem', maxWidth: '28rem', backgroundColor: 'var(--background)' }}>
			<Section title="Outer addons">
				<Field label="Text addons" hint="A URL field, for example.">
					<InputNumber addonBefore="https://" addonAfter=".com" defaultValue={42} />
				</Field>
				<Field
					label="Select as addonAfter"
					hint="The Select's own border is removed so the whole thing reads as one control."
				>
					<InputNumber
						defaultValue={500}
						addonAfter={
							<Select value={unit} onChange={(v) => setUnit(v as string)}>
								<SelectTrigger aria-label="unit">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="MiB">MiB</SelectItem>
									<SelectItem value="GiB">GiB</SelectItem>
									<SelectItem value="TiB">TiB</SelectItem>
								</SelectContent>
							</Select>
						}
					/>
				</Field>
				<Field label="Disabled embedded Select" hint="Pass `disabled` to the Select itself.">
					<InputNumber
						defaultValue={500}
						addonAfter={
							<Select value="GiB" disabled>
								<SelectTrigger aria-label="unit">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="GiB">GiB</SelectItem>
								</SelectContent>
							</Select>
						}
					/>
				</Field>
			</Section>
		</div>
	);
}

function ClampOnBlurPreview() {
	const [value, setValue] = useState<number | null>(5);
	return (
		<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
			<Field label="Clamp to 0–10" hint="Type 99 and tab/click away — value clamps to 10.">
				<InputNumber value={value} onChange={setValue} min={0} max={10} />
				<Output value={value} />
			</Field>
		</div>
	);
}

function KeyboardAndWheelPreview() {
	const [keyboardEnabled, setKeyboardEnabled] = useState(true);
	const [wheelEnabled, setWheelEnabled] = useState(true);
	return (
		<div
			style={{
				padding: '2rem',
				maxWidth: '24rem',
				backgroundColor: 'var(--background)',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
				<label
					style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
				>
					<input
						type="checkbox"
						checked={keyboardEnabled}
						onChange={(e) => setKeyboardEnabled(e.target.checked)}
					/>
					<code>keyboard</code>
				</label>
				<label
					style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
				>
					<input
						type="checkbox"
						checked={wheelEnabled}
						onChange={(e) => setWheelEnabled(e.target.checked)}
					/>
					<code>changeOnWheel</code>
				</label>
			</div>
			<Field label="Try it" hint="Focus the input, then press ↑ / ↓ or scroll the mouse wheel.">
				<InputNumber
					defaultValue={5}
					min={0}
					max={100}
					keyboard={keyboardEnabled}
					changeOnWheel={wheelEnabled}
					controls
				/>
			</Field>
		</div>
	);
}

function PressEnterPreview() {
	const [submitted, setSubmitted] = useState<number | null>(null);
	const [value, setValue] = useState<number | null>(null);
	return (
		<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
			<Field
				label="Type a number, press Enter"
				hint={submitted === null ? 'Nothing submitted yet.' : `Last submitted: ${submitted}`}
			>
				<InputNumber
					value={value}
					onChange={setValue}
					onPressEnter={() => setSubmitted(value)}
					placeholder="e.g. 42"
				/>
			</Field>
		</div>
	);
}

export const Default: Story = {
	args: {
		defaultValue: 3,
		min: 0,
		max: 100,
		step: 1,
		placeholder: 'Enter a number',
	},
	render: (args) => (
		<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
			<InputNumber {...args} />
		</div>
	),
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
					States
				</h3>
				<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
					<Section title="States" description="Same input, three interactive modes.">
						<Field label="Default">
							<InputNumber defaultValue={3} placeholder="0" />
						</Field>
						<Field label="Disabled" hint="Cannot be focused or edited.">
							<InputNumber defaultValue={3} disabled />
						</Field>
						<Field label="Read-only" hint="Can be selected but not edited.">
							<InputNumber defaultValue={3} readOnly />
						</Field>
					</Section>
				</div>
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
					Spinner
				</h3>
				<div style={{ padding: '2rem', maxWidth: '28rem', backgroundColor: 'var(--background)' }}>
					<Section
						title="Spinner controls"
						description="Click the arrows, focus and press ↑ / ↓, or scroll with the wheel when changeOnWheel is on."
					>
						<Field label="Stacked (default)" hint='mode="input"'>
							<InputNumber defaultValue={3} min={1} max={10} controls />
						</Field>
						<Field label="Side-by-side" hint='mode="spinner"'>
							<InputNumber defaultValue={3} min={1} max={10} controls mode="spinner" />
						</Field>
						<Field label="At the maximum" hint="The up arrow is disabled at value === max.">
							<InputNumber value={10} min={1} max={10} controls />
						</Field>
					</Section>
				</div>
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
					Formatter
				</h3>
				<FormatterPreview />
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
					Precision
				</h3>
				<PrecisionPreview />
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
					Prefix And Suffix
				</h3>
				<div style={{ padding: '2rem', maxWidth: '28rem', backgroundColor: 'var(--background)' }}>
					<Section title="Inline adornments">
						<Field label="Currency prefix">
							<InputNumber prefix="$" defaultValue={999} precision={2} />
						</Field>
						<Field label="Currency prefix and unit suffix">
							<InputNumber prefix="¥" suffix="RMB" defaultValue={1500} />
						</Field>
						<Field label="Symbol prefix only">
							<InputNumber prefix="#" placeholder="Quantity" min={0} />
						</Field>
					</Section>
				</div>
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
					Addons
				</h3>
				<AddonsPreview />
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
					Status
				</h3>
				<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
					<Section title="Validation surfaces">
						<Field label="Error" hint="Form validation failure.">
							<InputNumber defaultValue={3} status="error" />
						</Field>
						<Field label="Warning" hint="Non-blocking warning.">
							<InputNumber defaultValue={3} status="warning" />
						</Field>
						<Field label="Out of range" hint="Auto-warning when value < min or value > max.">
							<InputNumber value={99} min={1} max={10} controls />
						</Field>
					</Section>
				</div>
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
					Clamp On Blur
				</h3>
				<ClampOnBlurPreview />
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
					Sizes
				</h3>
				<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
					<Section title="Sizes">
						<Field label="Small" hint="24px height — dense toolbars, table cells.">
							<InputNumber defaultValue={3} size="small" />
						</Field>
						<Field label="Middle (default)" hint="32px height — most forms.">
							<InputNumber defaultValue={3} size="middle" />
						</Field>
						<Field label="Large" hint="40px height — primary form fields, hero inputs.">
							<InputNumber defaultValue={3} size="large" />
						</Field>
					</Section>
				</div>
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
					Variants
				</h3>
				<div style={{ padding: '2rem', maxWidth: '24rem', backgroundColor: 'var(--background)' }}>
					<Section title="Variants">
						<Field label="Outlined (default)">
							<InputNumber defaultValue={3} variant="outlined" />
						</Field>
						<Field label="Filled" hint="Solid background, no border.">
							<InputNumber defaultValue={3} variant="filled" />
						</Field>
						<Field label="Borderless" hint="No chrome — for embedding in larger surfaces.">
							<InputNumber defaultValue={3} variant="borderless" />
						</Field>
						<Field label="Underlined" hint="Material-style underline only.">
							<InputNumber defaultValue={3} variant="underlined" />
						</Field>
					</Section>
				</div>
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
					Keyboard And Wheel
				</h3>
				<KeyboardAndWheelPreview />
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
					Press Enter
				</h3>
				<PressEnterPreview />
			</section>
		</div>
	),
};
