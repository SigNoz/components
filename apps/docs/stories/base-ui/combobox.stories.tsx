import {
	Button,
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxSimple,
	ComboboxTrigger,
	type ComboboxSimpleGroup,
	type ComboboxSimpleItem,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Combobox',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The popover layer moved off @radix-ui/react-popover and onto our Base UI-backed Popover. cmdk still owns filtering and the list, and the virtualiser is untouched.',
			},
		},
	},
};

export default meta;

const SIGNALS: ComboboxSimpleItem[] = [
	{ value: 'logs', label: 'Logs' },
	{ value: 'traces', label: 'Traces' },
	{ value: 'metrics', label: 'Metrics' },
	{ value: 'exceptions', label: 'Exceptions' },
];

const GROUPS: ComboboxSimpleGroup[] = [
	{ heading: 'Signals', items: SIGNALS.slice(0, 3) },
	{
		heading: 'Attributes',
		items: [
			{ value: 'service.name', label: 'service.name' },
			{ value: 'http.status_code', label: 'http.status_code' },
		],
	},
];

/**
 * Primitive composition, so the parts that changed shape are exercised
 * directly rather than through the preset: `Combobox` is the popover root,
 * `ComboboxTrigger` takes `asChild`, and `ComboboxContent` is a popover
 * content whose ref is now a plain `HTMLDivElement`.
 */
function PrimitiveCombobox() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string>();

	return (
		<Combobox open={open} onOpenChange={setOpen}>
			<ComboboxTrigger asChild>
				<Button variant="outlined">{value ?? 'Pick a signal'}</Button>
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxCommand>
					<ComboboxInput placeholder="Search signals…" />
					<ComboboxList>
						<ComboboxEmpty>No signal matches.</ComboboxEmpty>
						{SIGNALS.map((item) => (
							<ComboboxItem
								key={item.value}
								value={item.value}
								onSelect={() => {
									setValue(item.value);
									setOpen(false);
								}}
							>
								{item.label}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxCommand>
			</ComboboxContent>
		</Combobox>
	);
}

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="our Popover (Popover.Root / Positioner / Popup) + cmdk"
			notes={[
				'Combobox is our Popover root; on main it was PopoverPrimitive.Root from @radix-ui/react-popover.',
				'ComboboxTrigger and ComboboxContent compose PopoverTrigger / PopoverContent, so their refs are a plain HTMLButtonElement and HTMLDivElement instead of Radix element types.',
				'asChild on the trigger is unchanged and still forwards to the popover trigger.',
				'cmdk keeps ownership of filtering, grouping and list semantics; the @tanstack/react-virtual virtualiser was not touched.',
				'Base UI dismisses on outside press, so clicking a control outside an open popover closes it before that control reacts.',
			]}
		>
			<Demo title="Single" note="ComboboxSimple">
				<ComboboxSimple items={SIGNALS} placeholder="Select a signal" />
			</Demo>

			<Demo title="Multiple" note="pills + overflow tooltip">
				<ComboboxSimple
					multiple
					items={SIGNALS}
					defaultValue={['logs', 'traces']}
					placeholder="Select signals"
				/>
			</Demo>

			<Demo title="Grouped" note="cmdk groups">
				<ComboboxSimple groups={GROUPS} placeholder="Select a key" />
			</Demo>

			<Demo title="Create" note="allowCreate">
				<ComboboxSimple allowCreate items={SIGNALS} placeholder="Select or create" />
			</Demo>

			<Demo title="asChild trigger" note="composed from the primitives">
				<PrimitiveCombobox />
			</Demo>

			<Demo title="Inline" note="withPortal={false}">
				<ComboboxSimple withPortal={false} items={SIGNALS} placeholder="Rendered in place" />
			</Demo>
		</BaseUIPanel>
	),
};
