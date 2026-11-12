import { Plus } from '@signozhq/icons';
import { Button, Input, Steps, type StepsListItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { waitForEffects } from './shared/play.js';
import { FUNNEL_ITEMS, stepsArgTypes, stepsParameters } from './shared/steps-arg-types.js';
import styles from './steps.stories.module.css';

/**
 * The static members of `Steps`, grouped under `Steps/Components` in the sidebar. They are
 * documented on the `Steps` page, `steps.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Steps> = {
	title: 'Primitive Components/Steps/Components',
	component: Steps,
	tags: ['!autodocs'],
	parameters: stepsParameters,
	argTypes: stepsArgTypes,
};

export default meta;

/**
 * `Steps.List` is a vertical list of numbered steps where each step holds its own content, such as
 * the steps of a trace funnel. It has no current step and no state, so every marker looks the same.
 * The sections with a form in each step and with an Add step button are in `StepsShowcase`, and
 * `ListBuilder` adds steps by hand.
 */
export const List: StoryObj<typeof Steps.List> = {
	parameters: {
		// `Steps.List` has no current step.
		controls: { exclude: ['current'] },
		// For trying it by hand. The list is in `StepsShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		testId: 'funnel-steps',
		'aria-label': 'Funnel steps',
		items: FUNNEL_ITEMS,
	},
	argTypes: {
		items: {
			control: 'object',
			description:
				'Required. The steps, in order. The first one is step 1. `label` is a title next to the marker and wraps, it is never cut. Leave it out when the content shows its own title. `children` is the content of the step and can hold any element. A step whose content renders nothing still shows its marker, so the numbers stay in order. An empty array renders nothing, unless there is a `footer`.',
			table: { category: 'Content', type: { summary: 'StepsListItem[]' } },
		},
		footer: {
			control: false,
			description:
				'A row after the last step, such as the button that adds a step. It sits in the content column with a dot in place of a number, and the line of the last step runs down to it. It is not a step: it takes no number, and a screen reader does not count it. With an empty `items`, the footer renders alone.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
	},
	render: (args) => (
		<div className="story-container-lg">
			<Steps.List {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const list = canvas.getByRole('list', { name: 'Funnel steps' });
		const steps = within(list).getAllByRole('listitem');

		await expect(steps).toHaveLength(FUNNEL_ITEMS.length);
		await expect(list.tagName).toBe('OL');
		await expect(list.parentElement).toBe(canvas.getByTestId('funnel-steps'));
		await expect(list).not.toHaveAttribute('data-current');
		await expect(list.querySelector('[data-status], [aria-current]')).toBeNull();
		await expect(list.querySelector('button, a, input, [tabindex]')).toBeNull();

		for (const [index, { label, children }] of FUNNEL_ITEMS.entries()) {
			const number = index + 1;
			const joined = canvas
				.getByTestId(`funnel-steps-item-${number}`)
				.querySelector('[data-slot="steps-list-connector"]');

			await expect(canvas.getByTestId(`funnel-steps-item-${number}-marker`)).toHaveTextContent(
				String(number),
			);
			await expect(canvas.getByTestId(`funnel-steps-item-${number}-label`)).toHaveTextContent(
				String(label),
			);
			await expect(canvas.getByTestId(`funnel-steps-item-${number}-content`)).toHaveTextContent(
				String(children),
			);
			await expect(joined !== null).toBe(index < FUNNEL_ITEMS.length - 1);
		}
	},
};

const FIRST_SERVICES = ['cart', 'checkout', 'payment'];

/**
 * A funnel builder. Each step holds a field, and the Add step button is the `footer`, which the list
 * does not count as a step. A press on it adds a step at the end, numbered 4.
 */
function FunnelBuilder(): ReactElement {
	const [services, setServices] = useState(FIRST_SERVICES);
	const items: StepsListItem[] = services.map((service, index) => ({
		children: (
			<Input
				aria-label={`Service of step ${index + 1}`}
				placeholder="Service name"
				defaultValue={service}
			/>
		),
	}));

	return (
		<div className={styles.listColumn}>
			<Steps.List
				items={items}
				aria-label="Funnel builder"
				testId="builder"
				footer={
					<Button
						variant="outlined"
						color="secondary"
						size="sm"
						prefix={<Plus />}
						onClick={() => setServices([...services, ''])}
					>
						Add step
					</Button>
				}
			/>
		</div>
	);
}

export const ListBuilder: StoryObj<typeof Steps.List> = {
	parameters: {
		controls: { disable: true },
		// For trying it by hand. The list with forms is in `StepsShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: () => (
		<div className="story-container-lg">
			<FunnelBuilder />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const list = canvas.getByTestId('builder');
		const items = canvas.getByTestId('builder-items');

		await expect(within(list).getAllByRole('listitem')).toHaveLength(FIRST_SERVICES.length);
		await expect(items.contains(canvas.getByTestId('builder-footer'))).toBe(false);

		await userEvent.click(canvas.getByRole('textbox', { name: 'Service of step 1' }));
		await userEvent.tab();
		await expect(canvas.getByRole('textbox', { name: 'Service of step 2' })).toHaveFocus();

		const add = canvas.getByRole('button', { name: 'Add step' });

		await expect(canvas.getByTestId('builder-footer-content').contains(add)).toBe(true);

		await userEvent.click(add);

		await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(4));
		await expect(Array.from(items.children).every((child) => child.tagName === 'LI')).toBe(true);
		await expect(canvas.getByTestId('builder-item-4-marker')).toHaveTextContent('4');
		await expect(list.querySelectorAll('[data-slot="steps-list-connector"]')).toHaveLength(4);
		await expect(canvas.getByRole('textbox', { name: 'Service of step 4' })).toHaveValue('');
	},
};
