import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Select',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Select.Root / Portal / Positioner / Popup / List. Multi-select is now the primitive’s own `multiple` mode rather than manual toggling on top of a single-select primitive.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Select.Root / Portal / Positioner / Popup / List / Item"
			notes={[
				'Positioning props moved to a Positioner layer, and Viewport became List; every public prop name is unchanged.',
				'position="item-aligned" maps to the positioner’s alignItemWithTrigger; "popper" is plain anchor positioning.',
				'The trigger resolves the selected label from items collected out of the children, because the items themselves are unmounted while the popup is closed.',
			]}
		>
			<Demo title="Single">
				<Select defaultValue="banana">
					<SelectTrigger placeholder="Pick a fruit" />
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="cherry">Cherry</SelectItem>
					</SelectContent>
				</Select>
			</Demo>

			<Demo title="Groups and separators">
				<Select>
					<SelectTrigger placeholder="Pick a framework" />
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Frontend</SelectLabel>
							<SelectItem value="react">React</SelectItem>
							<SelectItem value="vue">Vue</SelectItem>
						</SelectGroup>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Backend</SelectLabel>
							<SelectItem value="express">Express</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</Demo>

			<Demo title="Disabled">
				<Select disabled>
					<SelectTrigger placeholder="Unavailable" />
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
					</SelectContent>
				</Select>
			</Demo>
		</BaseUIPanel>
	),
};

export const Multiple: StoryObj = {
	name: 'Multiple',
	render: () => {
		function MultiSelect() {
			const [values, setValues] = useState<string[]>(['red']);
			return (
				<Select multiple value={values} onChange={(next) => setValues(next as string[])}>
					<SelectTrigger placeholder="Pick colours" />
					<SelectContent>
						<SelectItem value="red">Red</SelectItem>
						<SelectItem value="green">Green</SelectItem>
						<SelectItem value="blue">Blue</SelectItem>
					</SelectContent>
				</Select>
			);
		}

		return (
			<BaseUIPanel
				parts="Select.Root multiple"
				notes={[
					'BEHAVIOUR CHANGE: the popup now stays open across selections. It previously closed on every pick and had to be reopened, which contradicted the "keep open for multi-select" intent in the old code.',
					'The manual value toggling, the empty-string value and the pointer-event interception on items are all gone — the primitive handles them.',
					'The removable pills and the overflow badge are still ours; only the selection mechanics moved.',
				]}
			>
				<Demo title="Stays open across picks">
					<MultiSelect />
				</Demo>

				<Demo title="Pill overflow">
					<Select multiple defaultValue={['red', 'green', 'blue']}>
						<SelectTrigger placeholder="Pick colours" maxDisplayedPills={2} />
						<SelectContent>
							<SelectItem value="red">Red</SelectItem>
							<SelectItem value="green">Green</SelectItem>
							<SelectItem value="blue">Blue</SelectItem>
						</SelectContent>
					</Select>
				</Demo>
			</BaseUIPanel>
		);
	},
};
