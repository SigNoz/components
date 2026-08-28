import { Switch } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Switch',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Switch.Root / Thumb. The root is now a span with a hidden input alongside it, which moves where the id attribute lands.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Switch.Root / Switch.Thumb"
			notes={[
				'The root renders a span with role="switch" plus a hidden checkbox input that carries the value into forms.',
				'Styling keys off data-checked rather than data-state="checked".',
				'BREAKING: id now lands on the hidden input, not the interactive root. Label and form wiring is unaffected; use testId to target the visual element.',
			]}
		>
			<Demo title="States">
				<Switch defaultValue>Checked</Switch>
				<Switch>Off</Switch>
				<Switch disabled>Disabled</Switch>
			</Demo>

			<Demo title="Colours">
				<Switch color="forest" defaultValue>
					Forest
				</Switch>
				<Switch color="cherry" defaultValue>
					Cherry
				</Switch>
				<Switch color="amber" defaultValue>
					Amber
				</Switch>
			</Demo>

			<Demo title="Loading" note="spinner in the thumb">
				<Switch isLoading>Loading</Switch>
				<Switch isLoading defaultValue>
					Loading, on
				</Switch>
			</Demo>
		</BaseUIPanel>
	),
};
