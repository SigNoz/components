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
	title: 'Components/InputNumber',
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

function Output({ value }: { value: number | null }) {
	return (
		<p className="text-[11px] text-vanilla-500 dark:text-vanilla-500">
			onChange: <code className="font-mono">{value === null ? 'null' : value}</code>
		</p>
	);
}

/* -------------------------------------------------------------------------- */
/*  Primary                                                                   */
/* -------------------------------------------------------------------------- */

/** Playground — explore every prop. */
export const Playground: Story = {
	args: {
		defaultValue: 3,
		min: 0,
		max: 100,
		step: 1,
		placeholder: 'Enter a number',
	},
	render: (args) => (
		<div className="p-8 max-w-sm bg-background">
			<InputNumber {...args} />
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/*  Core props                                                                */
/* -------------------------------------------------------------------------- */

/** States — basic, disabled, readonly. */
export const States: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Three interactive states stacked for comparison.',
			},
		},
	},
	render: () => (
		<div className="p-8 max-w-sm bg-background">
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
	),
};

/** Spinner controls — opt in via `controls`, choose layout via `mode`. */
export const Spinner: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`controls` toggles the up/down buttons; `mode` chooses their layout. The buttons disable automatically at `min` / `max`.',
			},
		},
	},
	render: () => (
		<div className="p-8 max-w-md bg-background">
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
	),
};

/** Formatter / parser — custom display formatting. */
export const Formatter: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`formatter` controls how the value renders; `parser` extracts the numeric part of what the user types. Common cases: currency, percentage, units.',
			},
		},
	},
	render: () => {
		const [currency, setCurrency] = useState<number | null>(1000);
		const [percent, setPercent] = useState<number | null>(80);
		const [bytes, setBytes] = useState<number | null>(1024);
		return (
			<div className="p-8 max-w-md bg-background">
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
	},
};

/** Precision — round to a fixed number of decimals. */
export const Precision: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`precision` rounds the emitted value AND pads the display with trailing zeros so the field always shows a consistent shape.',
			},
		},
	},
	render: () => {
		const [value, setValue] = useState<number | null>(1.234);
		return (
			<div className="p-8 max-w-sm bg-background">
				<Field label="precision={2}" hint="Try typing 1.2345 — onChange will receive 1.23.">
					<InputNumber value={value} onChange={setValue} precision={2} step={0.01} controls />
					<Output value={value} />
				</Field>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/*  Slots                                                                     */
/* -------------------------------------------------------------------------- */

/** Prefix / suffix — inline content inside the input border. */
export const PrefixAndSuffix: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use for short labels, units, or icons. Renders inline inside the bordered input — no extra outer box.',
			},
		},
	},
	render: () => (
		<div className="p-8 max-w-md bg-background">
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
	),
};

/** Addons — bordered outer slots that merge into the input. */
export const Addons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`addonBefore` / `addonAfter` are bordered outer slots that visually merge with the input wrapper. Common pattern: text labels on either side, or an embedded `Select` for unit choice.',
			},
		},
	},
	render: () => {
		const [unit, setUnit] = useState('GiB');
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Outer addons">
					<Field label="Text addons" hint="A URL field, for example.">
						<InputNumber addonBefore="https://" addonAfter=".com" defaultValue={42} />
					</Field>
					<Field label="Select as addonAfter" hint="The Select's own border is removed so the whole thing reads as one control.">
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
	},
};

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

/** Status & out-of-range. */
export const Status: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`status` paints an error or warning border. When the value drifts outside `[min, max]`, the wrapper picks up a warning border automatically (unless `status` is set explicitly).',
			},
		},
	},
	render: () => (
		<div className="p-8 max-w-sm bg-background">
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
	),
};

/** Clamping — value rounds back into range on blur. */
export const ClampOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`changeOnBlur` (default `true`) re-emits a clamped, precision-rounded value when the input loses focus. Useful when you want users to be able to type freely but settle on a valid value.',
			},
		},
	},
	render: () => {
		const [value, setValue] = useState<number | null>(5);
		return (
			<div className="p-8 max-w-sm bg-background">
				<Field
					label="Clamp to 0–10"
					hint="Type 99 and tab/click away — value clamps to 10."
				>
					<InputNumber value={value} onChange={setValue} min={0} max={10} />
					<Output value={value} />
				</Field>
			</div>
		);
	},
};

/* -------------------------------------------------------------------------- */
/*  Appearance                                                                */
/* -------------------------------------------------------------------------- */

/** Sizes — small (24px), middle (32px), large (40px). */
export const Sizes: Story = {
	render: () => (
		<div className="p-8 max-w-sm bg-background">
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
	),
};

/** Variants — outlined, filled, borderless, underlined. */
export const Variants: Story = {
	render: () => (
		<div className="p-8 max-w-sm bg-background">
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
	),
};

/* -------------------------------------------------------------------------- */
/*  Interaction                                                               */
/* -------------------------------------------------------------------------- */

/** Keyboard & wheel. */
export const KeyboardAndWheel: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`keyboard` controls ↑/↓ stepping. `changeOnWheel` enables mouse-wheel stepping when the input is focused (focus required to avoid accidental edits while scrolling the page).',
			},
		},
	},
	render: () => {
		const [keyboardEnabled, setKeyboardEnabled] = useState(true);
		const [wheelEnabled, setWheelEnabled] = useState(true);
		return (
			<div className="p-8 max-w-sm bg-background space-y-4">
				<div className="flex flex-col gap-2">
					<label className="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={keyboardEnabled}
							onChange={(e) => setKeyboardEnabled(e.target.checked)}
						/>
						<code>keyboard</code>
					</label>
					<label className="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={wheelEnabled}
							onChange={(e) => setWheelEnabled(e.target.checked)}
						/>
						<code>changeOnWheel</code>
					</label>
				</div>
				<Field
					label="Try it"
					hint="Focus the input, then press ↑ / ↓ or scroll the mouse wheel."
				>
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
	},
};

/** onPressEnter — submit on Enter. */
export const PressEnter: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`onPressEnter` fires when the user hits Enter while the input is focused. Pair with a controlled value to build "type-and-submit" flows.',
			},
		},
	},
	render: () => {
		const [submitted, setSubmitted] = useState<number | null>(null);
		const [value, setValue] = useState<number | null>(null);
		return (
			<div className="p-8 max-w-sm bg-background">
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
	},
};

/* -------------------------------------------------------------------------- */
/*  Real-world examples — mirrored from SigNoz PR #11378                      */
/* -------------------------------------------------------------------------- */

/** Threshold field — alert rule threshold with text prefix. */
export const ThresholdField: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `FormAlertRules/RuleOptions.tsx`. A labelled threshold field — the label sits in the prefix slot so it stays right next to the value.',
			},
		},
	},
	render: () => {
		const [value, setValue] = useState<number | null>(null);
		return (
			<div className="p-8 max-w-md bg-background">
				<Field label="Alert threshold" hint="Triggered when the metric crosses this value.">
					<InputNumber prefix="Threshold" value={value} onChange={setValue} />
					<Output value={value} />
				</Field>
			</div>
		);
	},
};

/** Ingestion limits — value + unit dropdown. */
export const IngestionLimits: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `IngestionSettings/MultiIngestionSettings.tsx`. A daily-limit field paired with a unit `Select` in the `addonAfter` slot.',
			},
		},
	},
	render: () => {
		const [dailyLimit, setDailyLimit] = useState<number | null>(null);
		const [unit, setUnit] = useState('GiB');
		const [samples, setSamples] = useState<number | null>(null);
		const [samplesUnit, setSamplesUnit] = useState('million');
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Daily ingestion limits">
					<Field label="Volume per day">
						<InputNumber
							value={dailyLimit}
							onChange={setDailyLimit}
							placeholder="e.g. 500"
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
					<Field label="Samples per day">
						<InputNumber
							value={samples}
							onChange={setSamples}
							placeholder="Enter max # of samples/day"
							addonAfter={
								<Select
									value={samplesUnit}
									onChange={(v) => setSamplesUnit(v as string)}
								>
									<SelectTrigger aria-label="scale">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="thousand">thousand</SelectItem>
										<SelectItem value="million">million</SelectItem>
										<SelectItem value="billion">billion</SelectItem>
									</SelectContent>
								</Select>
							}
						/>
					</Field>
				</Section>
			</div>
		);
	},
};

/** Histogram buckets — integer count + decimal width. */
export const HistogramBuckets: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `NewWidget/HistogramBucketsSection.tsx`. A pair of bucket-config inputs with different precisions and steps.',
			},
		},
	},
	render: () => {
		const [count, setCount] = useState<number | null>(null);
		const [width, setWidth] = useState<number | null>(null);
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Histogram bucket configuration">
					<Field label="Bucket count" hint="Number of histogram buckets.">
						<InputNumber value={count} onChange={setCount} min={0} placeholder="Default: 30" />
					</Field>
					<Field label="Bucket width" hint="Use 0 / empty for auto.">
						<InputNumber
							value={width}
							onChange={setWidth}
							precision={2}
							step={0.1}
							placeholder="Default: Auto"
						/>
					</Field>
				</Section>
			</div>
		);
	},
};

/** Soft axes — paired min/max range. */
export const SoftAxesRange: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `NewWidget/AxesSection.tsx`. Paired soft-min / soft-max inputs in a horizontal field layout.',
			},
		},
	},
	render: () => {
		const [softMin, setSoftMin] = useState<number | null>(null);
		const [softMax, setSoftMax] = useState<number | null>(null);
		return (
			<div className="p-8 max-w-md bg-background">
				<Section title="Y-axis bounds" description="Leave blank for auto-fit.">
					<div className="grid grid-cols-[80px_1fr] items-center gap-3">
						<span className="text-xs text-vanilla-700 dark:text-vanilla-300">Soft Min</span>
						<InputNumber value={softMin} onChange={setSoftMin} placeholder="Auto" />
						<span className="text-xs text-vanilla-700 dark:text-vanilla-300">Soft Max</span>
						<InputNumber value={softMax} onChange={setSoftMax} placeholder="Auto" />
					</div>
				</Section>
			</div>
		);
	},
};

/** Query limit — min=1, optionally disabled. */
export const QueryLimit: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `QueryBuilder/filters/LimitFilter`. A row-limit field that is min-clamped to 1 and can be disabled when the query isn\'t configured to use a limit.',
			},
		},
	},
	render: () => {
		const [limit, setLimit] = useState<number | null>(10);
		const [disabled, setDisabled] = useState(false);
		return (
			<div className="p-8 max-w-sm bg-background">
				<Section title="Query row limit">
					<label className="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={disabled}
							onChange={(e) => setDisabled(e.target.checked)}
						/>
						Disable input
					</label>
					<Field label="Limit" hint="Minimum is 1.">
						<InputNumber
							min={1}
							value={limit}
							onChange={setLimit}
							disabled={disabled}
							controls
						/>
						<Output value={limit} />
					</Field>
				</Section>
			</div>
		);
	},
};

/** Max lines per row — compact spinner. */
export const MaxLinesField: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Adapted from `OptionsMenu/MaxLinesField`. A compact, small-sized input with spinner controls for dense option menus.',
			},
		},
	},
	render: () => {
		const [value, setValue] = useState<number | null>(5);
		return (
			<div className="p-8 max-w-xs bg-background">
				<Field label="Max lines per row" hint="1–50">
					<InputNumber
						value={value}
						onChange={setValue}
						controls
						size="small"
						min={1}
						max={50}
					/>
					<Output value={value} />
				</Field>
			</div>
		);
	},
};
