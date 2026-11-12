import { Plus } from '@signozhq/icons';
import {
	Button,
	Input,
	Steps,
	type StepsItem,
	type StepsListItem,
	type StepsProps,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fireEvent, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import {
	FUNNEL_ITEMS,
	ONBOARDING_ITEMS,
	stepsArgTypes,
	stepsParameters,
} from './shared/steps-arg-types.js';
import { waitForEffects } from './shared/play.js';
import styles from './steps.stories.module.css';

type Canvas = ReturnType<typeof within>;

const meta: Meta<typeof Steps> = {
	title: 'Primitive Components/Steps',
	component: Steps,
	parameters: {
		...stepsParameters,
		docs: {
			description: {
				component:
					'A row of numbered steps that shows where the user is in a flow with a known number of steps, such as the setup of a data source. It is display only: the page moves between steps with its own buttons.',
			},
		},
	},
	argTypes: stepsArgTypes,
	args: {
		testId: 'steps',
		'aria-label': 'Setup progress',
		items: ONBOARDING_ITEMS,
		current: 2,
	},
};

export default meta;

type Story = StoryObj<typeof Steps>;

const BACK_REASON = 'This is the first step.';

const FINISHED_REASON = 'Every step is done.';

const LONG_LABEL = 'Select the data source';

const LONG_ITEMS: StepsItem[] = [
	{ label: LONG_LABEL, description: 'Kubernetes cluster in us-east-1' },
	{ label: 'Configure the collector', description: 'Helm chart, default namespace' },
	{ label: 'Send data' },
];

const DESCRIBED_ITEMS: StepsItem[] = [
	{ label: 'Select data source', description: 'Kubernetes' },
	{ label: 'Configure', description: 'Acme Inc.' },
	{ label: 'Send data', description: 'Waiting for the first log' },
];

const LABEL_ONLY_ITEMS: StepsItem[] = ONBOARDING_ITEMS.map(({ label }) => ({ label }));

const EMPTY_LABEL_ITEMS: StepsItem[] = [
	{ label: '' },
	{ label: '   ', description: 'Kubernetes' },
	{ label: 'Send data' },
];

type FunnelStep = { service: string; span: string };

const FUNNEL_STEPS: FunnelStep[] = [
	{ service: 'cart', span: 'POST /cart' },
	{ service: 'checkout', span: 'POST /checkout' },
	{ service: 'payment', span: 'charge' },
];

/**
 * Owns the current step, as the page of a flow does with its own Back and Continue buttons, so a
 * press moves the row. A `current` set from the Controls panel is only where it starts.
 */
function FlowSteps({ current, items, ...props }: StepsProps): ReactElement {
	const [step, setStep] = useState(current);

	return (
		<div className={styles.flow}>
			<Steps {...props} items={items} current={step} />
			<div className="story-row">
				<Button
					variant="outlined"
					color="secondary"
					size="sm"
					disabled={step <= 1}
					disabledTooltip={BACK_REASON}
					onClick={() => setStep(step - 1)}
				>
					Back
				</Button>
				<Button
					variant="solid"
					color="primary"
					size="sm"
					disabled={step > items.length}
					disabledTooltip={FINISHED_REASON}
					onClick={() => setStep(step + 1)}
				>
					Continue
				</Button>
			</div>
		</div>
	);
}

// Remounts when a Controls value that only sets where the flow starts changes.
function startKey({ current, items }: StepsProps): string {
	return `${current}/${JSON.stringify(items)}`;
}

function itemsOf(list: HTMLElement): HTMLElement[] {
	return Array.from(list.querySelectorAll<HTMLElement>('[data-slot="steps-item"]'));
}

function statusesOf(list: HTMLElement): Array<string | undefined> {
	return itemsOf(list).map((item) => item.dataset.status);
}

function layoutOf(list: HTMLElement): number[] {
	return [
		list.getBoundingClientRect().height,
		...itemsOf(list).flatMap((item) => {
			const { left, top, width, height } = item.getBoundingClientRect();

			return [left, top, width, height];
		}),
	];
}

/**
 * The text of a label or a description, one line each.
 */
function textOf(canvas: Canvas, testId: string): string {
	return canvas.getByTestId(testId).textContent ?? '';
}

/**
 * A press on Continue moves the current step and nothing else: no step changes its position or its
 * size. At the end every step is done and no step is current.
 */
export const Default: Story = {
	parameters: {
		// For trying it by hand. The states it moves through are in `StepsShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container-full">
			<FlowSteps key={startKey(args)} {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		await waitForFonts(canvasElement);

		const list = canvas.getByRole('list', { name: 'Setup progress' });

		await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
		await expect(list).toHaveAttribute('data-current', '2');
		await expect(statusesOf(list)).toEqual(['done', 'current', 'waiting']);
		await expect(list.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
		await expect(canvas.getByTestId('steps-item-2')).toHaveAttribute('aria-current', 'step');
		await expect(canvas.getByTestId('steps-item-1')).toHaveTextContent('Completed');
		await expect(canvas.getByTestId('steps-item-2')).not.toHaveTextContent('Completed');
		await expect(textOf(canvas, 'steps-item-1-label')).toBe('Select data source');
		await expect(textOf(canvas, 'steps-item-1-description')).toBe('Kubernetes');
		await expect(textOf(canvas, 'steps-item-2-marker')).toBe('2');
		await expect(textOf(canvas, 'steps-item-3-marker')).toBe('3');

		const layout = layoutOf(list);

		await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));

		await waitFor(() => expect(statusesOf(list)).toEqual(['done', 'done', 'current']));
		await expect(list).toHaveAttribute('data-current', '3');
		await expect(textOf(canvas, 'steps-item-2-marker')).toBe('');
		await expect(textOf(canvas, 'steps-item-3-marker')).toBe('3');
		await expect(layoutOf(list)).toEqual(layout);

		await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));

		await waitFor(() => expect(statusesOf(list)).toEqual(['done', 'done', 'done']));
		await expect(list).toHaveAttribute('data-current', '4');
		await expect(list.querySelector('[aria-current]')).toBeNull();
		await expect(layoutOf(list)).toEqual(layout);
		await expect(canvas.getByRole('button', { name: 'Continue' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);

		await userEvent.click(canvas.getByRole('button', { name: 'Back' }));

		await waitFor(() => expect(statusesOf(list)).toEqual(['done', 'done', 'current']));
		await expect(layoutOf(list)).toEqual(layout);
	},
};

function Rows({ children }: { children: ReactNode }): ReactElement {
	return <div className={styles.matrix}>{children}</div>;
}

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<>
			<Typography
				variant="label"
				size="small"
				weight="medium"
				color="inherit"
				as="span"
				textOverflow="visible"
			>
				{label}
			</Typography>
			<div className={styles.cell}>{children}</div>
		</>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }): ReactElement {
	return (
		<section className="story-section" aria-label={title}>
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			{children}
		</section>
	);
}

function Note({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			variant="paragraph"
			size="small"
			weight="regular"
			color="inherit"
			as="p"
			textOverflow="wrap"
		>
			{children}
		</Typography>
	);
}

function FunnelStepForm({ step, number }: { step: FunnelStep; number: number }): ReactElement {
	return (
		<div className={styles.form}>
			<Input
				aria-label={`Service of step ${number}`}
				placeholder="Service name"
				defaultValue={step.service}
			/>
			<Input
				aria-label={`Span name of step ${number}`}
				placeholder="Span name"
				defaultValue={step.span}
			/>
		</div>
	);
}

/**
 * A funnel with a form in each step. The action that adds a step is the `footer`: it takes a dot,
 * not a number, and the list does not count it as a step.
 */
function FunnelForms(): ReactElement {
	const items: StepsListItem[] = FUNNEL_STEPS.map((step, index) => ({
		children: <FunnelStepForm step={step} number={index + 1} />,
	}));

	return (
		<div className={styles.listColumn}>
			<Steps.List
				items={items}
				aria-label="Funnel with forms"
				testId="list-rich"
				footer={
					<Button variant="outlined" color="secondary" size="sm" prefix={<Plus />}>
						Add step
					</Button>
				}
			/>
		</div>
	);
}

function TitledContent({ title, children }: { title: string; children: string }): ReactElement {
	return (
		<>
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{children}
			</Typography>
		</>
	);
}

const UNLABELLED_ITEMS: StepsListItem[] = [
	{
		children: (
			<TitledContent title="Add to cart">Spans named POST /cart in the cart service.</TitledContent>
		),
	},
	{
		children: (
			<TitledContent title="Checkout">
				Spans named POST /checkout in the checkout service.
			</TitledContent>
		),
	},
	{
		children: (
			<TitledContent title="Payment">Spans named charge in the payment service.</TitledContent>
		),
	},
];

const EDGE_ITEMS: StepsListItem[] = [
	{
		label: 'Spans named POST /checkout in the checkout service, with a status code of 500',
		children: 'The long label wraps onto more lines, it is never cut.',
	},
	{ label: 'A step with no content', children: null },
	{ children: 'No label, only the content.' },
];

const TRUNCATION_WIDTHS = [
	{ id: 'wide', label: '40rem', className: styles.width40 },
	{ id: 'medium', label: '28rem', className: styles.width28 },
	{ id: 'narrow', label: '22rem', className: styles.width22 },
	{ id: 'tight', label: '20rem', className: styles.width20 },
	{ id: 'overflow', label: '14rem', className: styles.width14 },
] as const;

const SURFACES = ['surface-1', 'surface-2', 'surface-3'] as const;

const SURFACE_STEPS: StepsItem[] = [
	{ label: 'Source', description: 'Kubernetes' },
	{ label: 'Configure', description: 'Acme Inc.' },
	{ label: 'Send data' },
];

const SURFACE_LIST: StepsListItem[] = [
	{ label: 'Add to cart', children: 'Spans named POST /cart.' },
	{ label: 'Checkout', children: 'Spans named POST /checkout.' },
];

const FOCUS_CELL = '[data-state-cell="focus"] [data-truncated]';

/** The warnings the showcase printed, held by its `beforeEach` in place of the console. */
const showcaseWarnings: unknown[] = [];

function heightOf(element: Element): number {
	return element.getBoundingClientRect().height;
}

async function expectCurrentStep(section: Canvas): Promise<void> {
	const expected: Array<[number, string[]]> = [
		[1, ['current', 'waiting', 'waiting']],
		[2, ['done', 'current', 'waiting']],
		[3, ['done', 'done', 'current']],
	];

	for (const [current, statuses] of expected) {
		const list = section.getByTestId(`current-${current}`);

		await expect(list).toHaveAttribute('data-current', String(current));
		await expect(statusesOf(list)).toEqual(statuses);
		await expect(list.querySelectorAll('[aria-current="step"]')).toHaveLength(1);

		for (const [index, status] of statuses.entries()) {
			const number = index + 1;
			const item = section.getByTestId(`current-${current}-item-${number}`);
			const marker = textOf(section, `current-${current}-item-${number}-marker`);

			await expect(marker).toBe(status === 'done' ? '' : String(number));
			await expect(item.textContent?.includes('Completed')).toBe(status === 'done');
			await expect(item.hasAttribute('aria-current')).toBe(status === 'current');
		}
	}
}

async function expectOutsideTheSteps(section: Canvas): Promise<void> {
	const finished = section.getByTestId('finished');

	await expect(finished).toHaveAttribute('data-current', '4');
	await expect(statusesOf(finished)).toEqual(['done', 'done', 'done']);
	await expect(finished.querySelector('[aria-current]')).toBeNull();

	const invalid = section.getByTestId('invalid');

	await expect(invalid).toHaveAttribute('data-current', '1');
	await expect(statusesOf(invalid)).toEqual(['current', 'waiting', 'waiting']);
	await expect(showcaseWarnings).toContainEqual(expect.stringContaining('`current`'));
}

async function expectDescriptions(section: Canvas): Promise<void> {
	const heightsOf = (testId: string): number[] =>
		itemsOf(section.getByTestId(testId)).map((item) => heightOf(item));
	const [reservedFirst, ...reserved] = heightsOf('described-reserved');
	const [describedFirst] = heightsOf('described-all');
	const [bare] = heightsOf('described-none');

	for (const height of [...reserved, describedFirst]) {
		await expect(height).toBeCloseTo(reservedFirst as number, 0);
	}

	await expect(bare).toBeLessThan(reservedFirst as number);
	await expect(section.queryByTestId('described-reserved-item-3-description')).toBeNull();
	await expect(section.queryByTestId('described-none-item-1-description')).toBeNull();
}

async function expectEmptyLabel(section: Canvas): Promise<void> {
	const list = section.getByTestId('empty-label');

	await expect(itemsOf(list)).toHaveLength(3);

	for (const number of [1, 2]) {
		await expect(textOf(section, `empty-label-item-${number}-label`)).toBe('<No label>');
	}

	await expect(textOf(section, 'empty-label-item-2-description')).toBe('Kubernetes');

	for (const number of [1, 2, 3]) {
		await expect(textOf(section, `empty-label-item-${number}-marker`)).toBe(String(number));
	}
}

async function expectNarrow(section: Canvas): Promise<void> {
	const list = section.getByTestId('narrow');
	const parts = ['item-1-label', 'item-1-description', 'item-2-label', 'item-2-description'];

	for (const part of parts) {
		const text = section.getByTestId(`narrow-${part}`);

		await waitFor(() => expect(text).toHaveAttribute('data-truncated'));
		await expect(text).toHaveAttribute('tabindex', '0');
		await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
	}

	const last = section.getByTestId('narrow-item-3-label');

	await expect(last).not.toHaveAttribute('data-truncated');
	await expect(last).not.toHaveAttribute('tabindex');

	const tops = itemsOf(list).map((item) => item.getBoundingClientRect().top);

	await expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);

	const markers = [1, 2, 3].map((number) => section.getByTestId(`narrow-item-${number}-marker`));
	const sizes = markers.map((marker) => marker.getBoundingClientRect().width);

	await expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThan(0.5);

	const lastItem = itemsOf(list).at(-1) as HTMLElement;

	await expect(lastItem.getBoundingClientRect().right).toBeLessThanOrEqual(
		list.getBoundingClientRect().right + 0.5,
	);

	for (const number of [1, 2, 3]) {
		const text = section.getByTestId(`wide-item-${number}-label`);

		await expect(text).not.toHaveAttribute('data-truncated');
	}
}

async function expectLists(section: Canvas): Promise<void> {
	const labelled = section.getByTestId('list-labels');
	const entries = within(labelled).getAllByRole('listitem');

	await expect(entries).toHaveLength(3);

	for (const [index, { label }] of FUNNEL_ITEMS.entries()) {
		const number = index + 1;

		await expect(textOf(section, `list-labels-item-${number}-label`)).toBe(label);
		await expect(textOf(section, `list-labels-item-${number}-marker`)).toBe(String(number));

		const joined = section
			.getByTestId(`list-labels-item-${number}`)
			.querySelector('[data-slot="steps-list-connector"]');

		await expect(joined !== null).toBe(index < FUNNEL_ITEMS.length - 1);
	}

	const marker = section.getByTestId('list-labels-item-2-marker').getBoundingClientRect();
	const connector = section
		.getByTestId('list-labels-item-1')
		.querySelector('[data-slot="steps-list-connector"]') as HTMLElement;

	await expect(marker.top - connector.getBoundingClientRect().bottom).toBeLessThan(6);
	await expect(marker.top - connector.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(0);

	await expect(section.getByRole('list', { name: 'Funnel steps with labels' })).toBe(
		section.getByTestId('list-labels-items'),
	);

	const unlabelled = section.getByTestId('list-unlabelled');

	await expect(unlabelled.querySelector('[data-slot="steps-list-label"]')).toBeNull();
	await expect(within(unlabelled).getAllByRole('listitem')).toHaveLength(3);
}

async function expectFormList(section: Canvas): Promise<void> {
	const list = section.getByTestId('list-rich');
	const items = section.getByTestId('list-rich-items');
	const footer = section.getByTestId('list-rich-footer');

	await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
	await expect(within(list).getAllByRole('textbox')).toHaveLength(6);
	await expect(items.contains(footer)).toBe(false);
	await expect(items.nextElementSibling).toBe(footer);

	const add = section.getByRole('button', { name: 'Add step' });

	await expect(section.getByTestId('list-rich-footer-content').contains(add)).toBe(true);
	await expect(list.querySelectorAll('[data-slot="steps-list-connector"]')).toHaveLength(3);
}

async function expectListEdges(section: Canvas): Promise<void> {
	const label = section.getByTestId('list-edge-item-1-label');
	const marker = section.getByTestId('list-edge-item-1-marker');

	await expect(label).not.toHaveAttribute('data-truncated');
	await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
	await expect(heightOf(label)).toBeGreaterThan(heightOf(marker) * 1.5);

	await expect(textOf(section, 'list-edge-item-2-marker')).toBe('2');
	await expect(textOf(section, 'list-edge-item-2-content')).toBe('');
	await expect(textOf(section, 'list-edge-item-3-marker')).toBe('3');
	await expect(section.queryByTestId('list-edge-item-3-label')).toBeNull();
}

async function expectNoSteps(section: Canvas): Promise<void> {
	await expect(section.queryByTestId('empty-steps')).toBeNull();
	await expect(section.queryByRole('list', { name: 'No steps' })).toBeNull();
	await expect(section.queryByTestId('empty-list')).toBeNull();
	await expect(section.queryByRole('list', { name: 'No steps in the list' })).toBeNull();
}

async function expectTruncation(section: Canvas): Promise<void> {
	await waitFor(() =>
		expect(section.getByTestId('truncation-tight-item-1-label')).toHaveAttribute('data-truncated'),
	);
	await waitForEffects();

	const cuts = TRUNCATION_WIDTHS.map(
		({ id }) => section.getByTestId(`truncation-${id}`).querySelectorAll('[data-truncated]').length,
	);

	await expect(cuts[0]).toBe(0);
	await expect(cuts.at(-1)).toBeGreaterThan(0);

	for (const [index, cut] of cuts.entries()) {
		await expect(cut).toBeGreaterThanOrEqual(cuts[index - 1] ?? 0);
	}

	for (const { id } of TRUNCATION_WIDTHS) {
		const list = section.getByTestId(`truncation-${id}`);
		const tops = itemsOf(list).map((item) => item.getBoundingClientRect().top);
		const sizes = [1, 2, 3].map(
			(number) =>
				section.getByTestId(`truncation-${id}-item-${number}-marker`).getBoundingClientRect().width,
		);
		const last = itemsOf(list).at(-1) as HTMLElement;
		const overflows = last.getBoundingClientRect().right > list.getBoundingClientRect().right + 1;

		await expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);
		await expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThan(0.5);
		await expect(overflows).toBe(id === 'overflow');
	}
}

async function expectSurfaces(surfaces: HTMLElement): Promise<void> {
	const section = within(surfaces);
	const blocks = Array.from(surfaces.querySelectorAll<HTMLElement>('[data-surface]'));

	await expect(blocks.map((block) => block.dataset.surface)).toEqual([...SURFACES]);
	await expect(new Set(blocks.map((block) => getComputedStyle(block).backgroundColor)).size).toBe(
		SURFACES.length,
	);

	for (const surface of SURFACES) {
		const row = section.getByTestId(`${surface}-steps`);

		await expect(statusesOf(row)).toEqual(['done', 'current', 'waiting']);
		await expect(
			within(section.getByTestId(`${surface}-list`)).getAllByRole('listitem'),
		).toHaveLength(SURFACE_LIST.length);
	}
}

/**
 * Resolves once the web fonts in the story have loaded. On a cold cache Inter swaps in while `play`
 * runs and moves the steps, so a position read before the swap no longer matches one read after it.
 * Reading a rect lays the canvas out, which starts the font loads that `document.fonts.ready` then
 * waits for.
 */
async function waitForFonts(canvasElement: HTMLElement): Promise<void> {
	canvasElement.getBoundingClientRect();
	await document.fonts.ready;
}

async function holdNarrowTooltipOpen(section: Canvas): Promise<void> {
	const label = section.getByTestId('narrow-item-1-label');

	fireEvent.pointerEnter(label);
	fireEvent.mouseEnter(label);
	fireEvent.mouseMove(label);

	await waitFor(() =>
		expect(within(document.body).getByRole('tooltip')).toHaveTextContent(LONG_LABEL),
	);
}

/**
 * Every state in one snapshot, one labelled section each: the current step at the first, a middle
 * and the last step, a current above the count and one below 1, the description on every step, on
 * none and on one with its line reserved on the others, a step with no label, the labels and the
 * descriptions cut in a narrow container with the first label's tooltip held open by `play`, the cut
 * text in focus, the same steps in containers from 40rem down to 14rem, `Steps.List` with labels,
 * without labels and with a form in each step and an Add step button after it, a long label and a
 * step with no content, the lists with no items, and a row and a list set on each of the three
 * surfaces. `play` checks each section through `within(section)`. `Default` is the story the
 * controls drive. `TruncatedKeyboard` and `ListBuilder` are stories of their own because their
 * `play` presses keys and buttons, which needs a fresh mount.
 */
export const StepsShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
		pseudo: { focusVisible: FOCUS_CELL },
	},
	beforeEach: () => {
		// `current` below 1 warns on mount: keep the console quiet and the message for `play`.
		showcaseWarnings.length = 0;
		const warn = spyOn(console, 'warn').mockImplementation((message: unknown) => {
			showcaseWarnings.push(message);
		});

		return () => warn.mockRestore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const section = (name: string): HTMLElement => canvas.getByRole('region', { name });

		await waitForEffects();
		await waitForFonts(canvasElement);

		await expectCurrentStep(within(section('Current step')));
		await expectOutsideTheSteps(within(section('Current outside the steps')));
		await expectDescriptions(within(section('Descriptions')));
		await expectEmptyLabel(within(section('No label')));
		await expectNarrow(within(section('Narrow container')));
		await expectTruncation(within(section('Truncation by container width')));
		await expectLists(within(section('Steps.List')));
		await expectFormList(within(section('Steps.List with a form in each step')));
		await expectListEdges(within(section('Steps.List edges')));
		await expectNoSteps(within(section('No items')));
		await expectSurfaces(section('Surfaces'));
		await holdNarrowTooltipOpen(within(section('Narrow container')));
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section title="Current step">
				<Note>
					The first step, a step in the middle and the last step. The steps before the current one
					show the done mark in place of the number, the current one stands out, and the ones after
					it show their number.
				</Note>
				<Rows>
					{[1, 2, 3].map((current) => (
						<Row key={current} label={`current={${current}}`}>
							<Steps
								items={ONBOARDING_ITEMS}
								current={current}
								aria-label={`Current at step ${current}`}
								testId={`current-${current}`}
							/>
						</Row>
					))}
				</Rows>
			</Section>

			<Section title="Current outside the steps">
				<Note>
					A current above the count of steps marks every step done and none is current. A current
					below 1 renders as 1 and warns on the console.
				</Note>
				<Rows>
					<Row label="current={4}">
						<Steps
							items={ONBOARDING_ITEMS}
							current={4}
							aria-label="Every step done"
							testId="finished"
						/>
					</Row>
					<Row label="current={0}">
						<Steps
							items={ONBOARDING_ITEMS}
							current={0}
							aria-label="Current below 1"
							testId="invalid"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Descriptions">
				<Note>
					While one step has a description, every step keeps the line of it, so the row has the same
					height as the row with a description on every step. With none, the row is shorter.
				</Note>
				<Rows>
					<Row label="every step">
						<Steps
							items={DESCRIBED_ITEMS}
							current={2}
							aria-label="Description on every step"
							testId="described-all"
						/>
					</Row>
					<Row label="no step">
						<Steps
							items={LABEL_ONLY_ITEMS}
							current={2}
							aria-label="No description"
							testId="described-none"
						/>
					</Row>
					<Row label="two of three, the line reserved">
						<Steps
							items={ONBOARDING_ITEMS}
							current={2}
							aria-label="Reserved description line"
							testId="described-reserved"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="No label">
				<Note>
					A step with an empty label, or one with only spaces, shows <code>&lt;No label&gt;</code>.
					It is never hidden, so the numbers of the steps after it do not move.
				</Note>
				<Rows>
					<Row label="'' and '   '">
						<Steps
							items={EMPTY_LABEL_ITEMS}
							current={1}
							aria-label="Empty labels"
							testId="empty-label"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Narrow container">
				<Note>
					When the row runs out of width, the labels and the descriptions cut first, with a tooltip
					on hover and on keyboard focus. The markers keep their size and the row never wraps. The
					same steps in a wide container do not cut. The tooltip of the first label is held open.
				</Note>
				<Rows>
					<Row label="22rem">
						<div className={styles.narrow}>
							<Steps
								items={LONG_ITEMS}
								current={1}
								aria-label="Narrow setup progress"
								testId="narrow"
							/>
						</div>
					</Row>
					<Row label="cut text in focus">
						<div className={styles.narrow} data-state-cell="focus">
							<Steps
								items={LONG_ITEMS}
								current={2}
								aria-label="Narrow setup progress, focus"
								testId="narrow-focus"
							/>
						</div>
					</Row>
					<Row label="the same steps, wide">
						<Steps items={LONG_ITEMS} current={1} aria-label="Wide setup progress" testId="wide" />
					</Row>
				</Rows>
			</Section>

			<Section title="Truncation by container width">
				<Note>
					The same steps in containers from 40rem down to 14rem, the dashed line being the edge of
					the parent. The text cuts from the right as the container narrows, and the row stays on
					one line with markers of the same size. When even the cut text does not fit, at the last
					width, the row overflows its parent and never wraps.
				</Note>
				<Rows>
					{TRUNCATION_WIDTHS.map(({ id, label, className }) => (
						<Row key={id} label={label}>
							<div className={`${styles.bounds} ${className}`}>
								<Steps
									items={LONG_ITEMS}
									current={2}
									aria-label={`Setup progress in ${label}`}
									testId={`truncation-${id}`}
								/>
							</div>
						</Row>
					))}
				</Rows>
			</Section>

			<Section title="Steps.List">
				<Note>
					A vertical list of numbered steps. A line joins each marker to the next along the full
					height of the content, and the last step has no line. There is no current step, so every
					marker looks the same. Without labels, the content shows its own title.
				</Note>
				<Rows>
					<Row label="with labels">
						<div className={styles.listColumn}>
							<Steps.List
								items={FUNNEL_ITEMS}
								aria-label="Funnel steps with labels"
								testId="list-labels"
							/>
						</div>
					</Row>
					<Row label="without labels">
						<div className={styles.listColumn}>
							<Steps.List
								items={UNLABELLED_ITEMS}
								aria-label="Funnel steps without labels"
								testId="list-unlabelled"
							/>
						</div>
					</Row>
				</Rows>
			</Section>

			<Section title="Steps.List with a form in each step">
				<Note>
					The content of a step is any element and keeps its own focus order. The Add step button is
					the footer: an action on the list, with a dot in place of a number, that the list does not
					count as a step.
				</Note>
				<FunnelForms />
			</Section>

			<Section title="Steps.List edges">
				<Note>
					In a narrow container the label wraps and is never cut. A step with no content keeps its
					marker, so the numbers stay in order, and a step with no label shows the marker and the
					content only.
				</Note>
				<div className={styles.narrowList}>
					<Steps.List items={EDGE_ITEMS} aria-label="Funnel step edges" testId="list-edge" />
				</div>
			</Section>

			<Section title="No items">
				<Note>An empty list of items renders nothing, on Steps and on Steps.List.</Note>
				<Rows>
					<Row label="Steps, items={[]}">
						<Steps items={[]} current={1} aria-label="No steps" testId="empty-steps" />
					</Row>
					<Row label="Steps.List, items={[]}">
						<Steps.List items={[]} aria-label="No steps in the list" testId="empty-list" />
					</Row>
				</Rows>
			</Section>

			<Section title="Surfaces">
				<Note>
					A Steps row and a short Steps.List set directly on each surface, with no frame around
					them, so the markers, the lines and the text show against surface-1, surface-2 and
					surface-3.
				</Note>
				<div className={styles.surfaces}>
					{SURFACES.map((surface) => (
						<div key={surface} className={styles.surface} data-surface={surface}>
							<Typography
								variant="label"
								size="small"
								weight="medium"
								color="inherit"
								as="span"
								textOverflow="wrap"
							>
								{surface}
							</Typography>
							<Steps
								items={SURFACE_STEPS}
								current={2}
								aria-label={`Setup progress on ${surface}`}
								testId={`${surface}-steps`}
							/>
							<Steps.List
								items={SURFACE_LIST}
								aria-label={`Funnel steps on ${surface}`}
								testId={`${surface}-list`}
							/>
						</div>
					))}
				</div>
			</Section>
		</div>
	),
};

/**
 * A row that is too narrow for its text: the label and the description cut with `…`, each one a tab
 * stop while it is cut. `Tab` reaches the first one, the tooltip with the full text opens on focus,
 * and `Esc` closes it.
 */
export const TruncatedKeyboard: Story = {
	parameters: {
		// For trying it by hand. The cut text is in `StepsShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		testId: 'truncated',
		'aria-label': 'Setup progress, narrow',
		items: LONG_ITEMS,
		current: 1,
	},
	render: (args) => (
		<div className="story-container-full">
			<div className={styles.narrow}>
				<Steps {...args} />
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const label = canvas.getByTestId('truncated-item-1-label');

		await waitForEffects();
		await waitFor(() => expect(label).toHaveAttribute('data-truncated'));
		await expect(label).toHaveAttribute('tabindex', '0');
		await expect(canvas.getByTestId('truncated-item-3-label')).not.toHaveAttribute('tabindex');

		await userEvent.tab();

		await expect(label).toHaveFocus();
		await waitFor(() =>
			expect(within(document.body).getByRole('tooltip')).toHaveTextContent(LONG_LABEL),
		);

		await userEvent.keyboard('{Escape}');

		await waitFor(() => expect(within(document.body).queryAllByRole('tooltip')).toHaveLength(0));

		await userEvent.tab();

		await expect(canvas.getByTestId('truncated-item-1-description')).toHaveFocus();
	},
};
