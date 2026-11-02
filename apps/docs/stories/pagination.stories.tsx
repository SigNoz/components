import {
	Button,
	Pagination,
	type PaginationCursorProps,
	type PaginationProps,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './pagination.stories.module.css';
import {
	ALIGNS,
	DISABLED_REASON,
	paginationArgTypes,
	paginationParameters,
} from './shared/pagination-arg-types.js';
import {
	type Canvas,
	controlsWidthOf,
	positionOf,
	slotsOf,
	slotTexts,
	widthOf,
} from './shared/pagination-play.js';
import { waitForEffects } from './shared/play.js';

const PAGE_SIZE_OPTIONS = [10, 20, { value: 25, label: 'Auto (25)' }, 50];

const NARROW_LABEL = 'pods in this namespace';

const NARROW_TEXT = `1 — 10 of 200 ${NARROW_LABEL}`;

const LAST_CURSOR_PAGE = 3;

const pageSizeSpies = { onPageChange: fn(), onPageSizeChange: fn() };

const disabledSpies = { onPageChange: fn(), onPageSizeChange: fn() };

const meta: Meta<typeof Pagination> = {
	title: 'Composed Components/Pagination',
	component: Pagination,
	parameters: {
		...paginationParameters,
		docs: {
			description: {
				component:
					'The bar at the bottom of a table, a list or a stack of cards: a position label at the start and the page controls at the end.',
			},
		},
	},
	argTypes: paginationArgTypes,
	args: {
		testId: 'pagination',
		total: 1240,
		onPageChange: fn(),
		onPageSizeChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * Owns the page and the page size, as a consumer does, so a click moves the bar. A `current` or a
 * `pageSize` set from the Controls panel is only where it starts.
 */
function ControlledPagination({
	current,
	defaultCurrent,
	onPageChange,
	pageSize,
	defaultPageSize,
	onPageSizeChange,
	...props
}: PaginationProps): ReactElement {
	const [page, setPage] = useState(current ?? defaultCurrent ?? 1);
	const [size, setSize] = useState(pageSize ?? defaultPageSize ?? 10);

	return (
		<Pagination
			{...props}
			current={page}
			onPageChange={(next) => {
				setPage(next);
				onPageChange?.(next);
			}}
			pageSize={size}
			onPageSizeChange={(next) => {
				setSize(next);
				onPageSizeChange?.(next);
			}}
		/>
	);
}

// Remounts when a Controls value that only sets where the bar starts changes.
function startKey({ current, defaultCurrent, pageSize, defaultPageSize }: PaginationProps): string {
	return [current, defaultCurrent, pageSize, defaultPageSize].join('/');
}

/**
 * A list that has no last page of its own: the consumer knows from the cursor of the API, or from
 * a full page, whether a page follows. It asks the API, here a list of three pages.
 */
function CursorOfThreePages(props: Omit<PaginationCursorProps, 'hasNextPage'>): ReactElement {
	const [page, setPage] = useState(1);

	return (
		<Pagination.Cursor
			{...props}
			current={page}
			onPageChange={setPage}
			hasNextPage={page < LAST_CURSOR_PAGE}
		/>
	);
}

const renderBar: Story['render'] = (args) => (
	<div className="story-container-full">
		<ControlledPagination key={startKey(args)} {...args} />
	</div>
);

function Rows({ children }: { children: ReactNode }): ReactElement {
	return <div className={styles.matrix}>{children}</div>;
}

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.caption}>
				{label}
			</Typography>
			<div className={styles.cell}>{children}</div>
		</>
	);
}

function pageButton(canvas: Canvas, number: number): HTMLElement {
	return canvas.getByRole('button', { name: `Page ${number}` });
}

/**
 * The numbered bar with a total label. A click on a page and on Next moves the current page and the
 * position label, and focus stays on Next so the same key can go on.
 */
export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `PaginationShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		showTotalLabel: 'pods',
	},
	render: renderBar,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		await expect(positionOf(canvas, 'pagination-total')).toBe('1 — 10 of 1,240 pods');
		await expect(pageButton(canvas, 1)).toHaveAttribute('aria-current', 'page');

		await userEvent.click(pageButton(canvas, 3));

		await waitFor(() => expect(pageButton(canvas, 3)).toHaveAttribute('aria-current', 'page'));
		await expect(pageButton(canvas, 1)).not.toHaveAttribute('aria-current');
		await expect(positionOf(canvas, 'pagination-total')).toBe('21 — 30 of 1,240 pods');
		await expect(pageButton(canvas, 3)).toHaveFocus();

		const next = canvas.getByRole('button', { name: 'Next page' });
		await userEvent.click(next);

		await waitFor(() => expect(pageButton(canvas, 4)).toHaveAttribute('aria-current', 'page'));
		await expect(positionOf(canvas, 'pagination-total')).toBe('31 — 40 of 1,240 pods');
		await expect(next).toHaveFocus();
	},
};

function AlignRows(): ReactElement {
	return (
		<Rows>
			{ALIGNS.map((align) => (
				<Row key={align} label={`align="${align}"`}>
					<Pagination
						total={200}
						showTotal={false}
						align={align}
						defaultCurrent={3}
						aria-label={`Pagination aligned to the ${align}`}
						testId={`align-${align}`}
					/>
				</Row>
			))}
		</Rows>
	);
}

const MANY_PAGES = [1, 5, 10, 16, 20] as const;

const MANY_PAGES_SLOTS: Record<(typeof MANY_PAGES)[number], string[]> = {
	1: ['1', '2', '3', '4', '5', '-', '20'],
	5: ['1', '-', '4', '5', '6', '-', '20'],
	10: ['1', '-', '9', '10', '11', '-', '20'],
	16: ['1', '-', '15', '16', '17', '-', '20'],
	20: ['1', '-', '16', '17', '18', '19', '20'],
};

const DIGITS = [
	{ pages: 100, total: 1000 },
	{ pages: 1200, total: 12000 },
] as const;

function ManyPagesRows(): ReactElement {
	return (
		<Rows>
			{MANY_PAGES.map((current) => (
				<Row key={current} label={`Page ${current} of 20`}>
					<Pagination
						total={200}
						showTotalLabel="pods"
						defaultCurrent={current}
						aria-label={`Pagination at page ${current}`}
						testId={`pages-${current}`}
					/>
				</Row>
			))}
			{DIGITS.map(({ pages, total }) => (
				<Row key={pages} label={`Page 10 of ${pages.toLocaleString('en-US')}`}>
					<Pagination
						total={total}
						showTotalLabel="pods"
						defaultCurrent={10}
						aria-label={`Pagination of ${pages} pages`}
						testId={`digits-${pages}`}
					/>
				</Row>
			))}
		</Rows>
	);
}

const SINGLE_PAGE = [
	{ id: 'empty', label: 'total={0}', props: { total: 0 } },
	{
		id: 'empty-selector',
		label: 'total={0}, with pageSizeOptions',
		props: { total: 0, pageSizeOptions: true },
	},
	{ id: 'compact-empty', label: 'compact, total={0}', props: { total: 0, variant: 'compact' } },
	{ id: 'fits', label: 'total={8}', props: { total: 8 } },
	{
		id: 'fits-size',
		label: 'total={30}, pageSize={50}',
		props: { total: 30, defaultPageSize: 50 },
	},
	{
		id: 'selector-pick',
		label: 'the same, with pageSizeOptions, then 10 picked',
		props: { total: 30, defaultPageSize: 50, pageSizeOptions: true },
	},
	{ id: 'compact', label: 'compact, total={8}', props: { total: 8, variant: 'compact' } },
] as const;

/**
 * A list that has not answered yet: the total is 0 and the page comes from somewhere else, such as
 * the URL. The bar shows page 1 meanwhile and keeps the page, so it is still there once the total
 * arrives.
 */
function TotalArrives(): ReactElement {
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(3);

	return (
		<div className={styles.stack}>
			<Pagination
				total={total}
				current={page}
				onPageChange={setPage}
				aria-label="Single page, arrives"
				testId="arrives"
			/>
			<div className="story-row">
				<Button variant="outlined" color="secondary" size="sm" onClick={() => setTotal(100)}>
					Load the list
				</Button>
			</div>
		</div>
	);
}

function SinglePageRows(): ReactElement {
	return (
		<Rows>
			{SINGLE_PAGE.map(({ id, label, props }) => (
				<Row key={id} label={label}>
					<Pagination {...props} aria-label={`Single page, ${id}`} testId={id} />
				</Row>
			))}
			<Row label="total={0}, current={3}, then 100">
				<TotalArrives />
			</Row>
		</Rows>
	);
}

function NarrowRows(): ReactElement {
	return (
		<div className={styles.narrow}>
			<Pagination
				total={200}
				showTotalLabel={NARROW_LABEL}
				aria-label="Narrow numbered pagination"
				testId="narrow-numbered"
			/>
			<Pagination
				variant="compact"
				total={200}
				showTotalLabel="pods"
				aria-label="Narrow compact pagination"
				testId="narrow-compact"
			/>
		</div>
	);
}

const STATES = ['default', 'hover', 'focus'] as const;

const CONTROLS = [
	'[data-slot="pagination-page"]',
	'[data-slot="pagination-previous"]',
	'[data-slot="pagination-next"]',
];

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them on the controls inside the `[data-state-cell]`
 * cells. The current page does not change on hover.
 */
function stateSelector(state: Exclude<(typeof STATES)[number], 'default'>): string[] {
	return CONTROLS.map((control) => `[data-state-cell="${state}"] ${control}`);
}

function StateRows(): ReactElement {
	return (
		<Rows>
			{STATES.map((state) => (
				<Row key={state} label={`numbered, ${state}`}>
					<div data-state-cell={state}>
						<Pagination
							total={200}
							showTotalLabel="pods"
							defaultCurrent={5}
							aria-label={`Numbered, ${state}`}
						/>
					</div>
				</Row>
			))}
			{STATES.map((state) => (
				<Row key={state} label={`compact, ${state}`}>
					<div data-state-cell={state}>
						<Pagination
							variant="compact"
							total={30}
							showTotalLabel="pods"
							defaultCurrent={2}
							aria-label={`Compact, ${state}`}
						/>
					</div>
				</Row>
			))}
		</Rows>
	);
}

function Section({
	title,
	testId,
	children,
}: {
	title: string;
	testId?: string | undefined;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section" data-testid={testId}>
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			{children}
		</div>
	);
}

function navOf(canvas: Canvas, name: string): HTMLElement {
	return canvas.getByRole('navigation', { name });
}

async function expectFewPages(canvas: Canvas): Promise<void> {
	const bar = navOf(canvas, 'Five pages');
	const inBar = within(bar);

	await expect(slotTexts(bar)).toEqual(['1', '2', '3', '4', '5']);

	const next = inBar.getByRole('button', { name: 'Next page' });
	await userEvent.click(next);

	await waitFor(() => expect(pageButton(inBar, 5)).toHaveAttribute('aria-current', 'page'));
	await expect(positionOf(canvas, 'few-pages-total')).toBe('41 — 50 of 50 pods');
	await expect(next).toBeDisabled();
	await expect(pageButton(inBar, 5)).toHaveFocus();
}

async function expectCompactWalk(canvas: Canvas): Promise<void> {
	const inBar = within(navOf(canvas, 'Compact, press Next twice'));

	await expect(inBar.queryByRole('button', { name: 'Previous' })).toBeNull();
	await expect(positionOf(canvas, 'compact-walk-total')).toBe('1 — 10 of 30 pods');

	await userEvent.click(inBar.getByRole('button', { name: 'Next' }));

	const previous = await inBar.findByRole('button', { name: 'Previous' });
	await expect(positionOf(canvas, 'compact-walk-total')).toBe('11 — 20 of 30 pods');

	const left = previous.getBoundingClientRect().left;
	await userEvent.click(inBar.getByRole('button', { name: 'Next' }));

	await waitFor(() => expect(inBar.queryByRole('button', { name: 'Next' })).toBeNull());
	await expect(positionOf(canvas, 'compact-walk-total')).toBe('21 — 30 of 30 pods');
	await expect(getComputedStyle(canvas.getByTestId('compact-walk-next')).visibility).toBe('hidden');
	await expect(previous).toHaveFocus();
	await expect(previous.getBoundingClientRect().left).toBeCloseTo(left, 0);
}

async function expectCursorEnd(canvas: Canvas): Promise<void> {
	const inBar = within(navOf(canvas, 'Cursor, three pages'));

	for (const page of [2, LAST_CURSOR_PAGE]) {
		await userEvent.click(inBar.getByRole('button', { name: 'Next' }));
		await waitFor(() => expect(positionOf(canvas, 'cursor-end-total')).toBe(`Page ${page}`));
	}

	await waitFor(() => expect(inBar.queryByRole('button', { name: 'Next' })).toBeNull());
	await expect(getComputedStyle(canvas.getByTestId('cursor-end-next')).visibility).toBe('hidden');
	await expect(inBar.getByRole('button', { name: 'Previous' })).toHaveFocus();
}

async function expectPageSizePick(canvas: Canvas): Promise<void> {
	const inBar = within(navOf(canvas, 'Page size, pick a size'));
	const { onPageChange, onPageSizeChange } = pageSizeSpies;

	await userEvent.click(pageButton(inBar, 3));
	await waitFor(() => expect(positionOf(canvas, 'size-walk-total')).toBe('21 — 30 of 1,240 pods'));

	const selector = inBar.getByRole('combobox', { name: 'Rows per page' });
	await userEvent.click(selector);

	const listbox = await within(document.body).findByRole('listbox');
	await expect(
		within(listbox)
			.getAllByRole('option')
			.map((option) => option.textContent),
	).toEqual(['10', '20', 'Auto (25)', '50']);

	await userEvent.click(within(listbox).getByRole('option', { name: 'Auto (25)' }));

	await waitFor(() => expect(onPageSizeChange).toHaveBeenCalledWith(25));
	await expect(onPageChange).toHaveBeenLastCalledWith(1);
	await waitFor(() => expect(positionOf(canvas, 'size-walk-total')).toBe('1 — 25 of 1,240 pods'));
	await expect(pageButton(inBar, 1)).toHaveAttribute('aria-current', 'page');
	await expect(selector).toHaveTextContent(/^25$/);
}

async function expectAlign(canvas: Canvas): Promise<void> {
	for (const align of ALIGNS) {
		const bar = navOf(canvas, `Pagination aligned to the ${align}`);

		await expect(bar).toHaveAttribute('data-align', align);
		await expect(canvas.queryByTestId(`align-${align}-total`)).toBeNull();
	}

	const rect = (testId: string): DOMRect => canvas.getByTestId(testId).getBoundingClientRect();
	const start = rect('align-start');
	const center = rect('align-center');
	const end = rect('align-end');

	await expect(rect('align-start-previous').left - start.left).toBeLessThan(40);
	await expect(end.right - rect('align-end-next').right).toBeLessThan(40);

	const middle = (rect('align-center-previous').left + rect('align-center-next').right) / 2;
	await expect(Math.abs(middle - (center.left + center.right) / 2)).toBeLessThan(8);
}

async function expectDisabled(canvas: Canvas): Promise<void> {
	const inBar = within(navOf(canvas, 'Numbered, disabled'));
	const { onPageChange, onPageSizeChange } = disabledSpies;

	await userEvent.click(pageButton(inBar, 6));
	await userEvent.click(inBar.getByRole('button', { name: 'Next page' }));
	await userEvent.click(inBar.getByRole('combobox', { name: 'Rows per page' }));

	await expect(onPageChange).not.toHaveBeenCalled();
	await expect(onPageSizeChange).not.toHaveBeenCalled();
	await expect(within(document.body).queryByRole('listbox')).toBeNull();
	await expect(pageButton(inBar, 5)).toHaveAttribute('aria-current', 'page');
	await expect(positionOf(canvas, 'disabled-numbered-total')).toBe('41 — 50 of 200 pods');

	const hovered = pageButton(inBar, 6);
	await userEvent.hover(hovered);

	await waitFor(() => expect(document.body).toHaveTextContent(DISABLED_REASON));

	// Closes it again, so the one the narrow label holds open is the only one left.
	await userEvent.unhover(hovered);
	await userEvent.keyboard('{Escape}');
	await waitFor(() => expect(within(document.body).queryAllByRole('tooltip')).toHaveLength(0));
}

async function expectManyPages(canvas: Canvas): Promise<void> {
	const bars = MANY_PAGES.map((current) => navOf(canvas, `Pagination at page ${current}`));

	for (const [index, current] of MANY_PAGES.entries()) {
		const bar = bars[index] as HTMLElement;

		await expect(slotTexts(bar)).toEqual(MANY_PAGES_SLOTS[current]);

		const widths = slotsOf(bar).map(widthOf);
		await expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(0.5);
		await expect(controlsWidthOf(bar)).toBeCloseTo(controlsWidthOf(bars[0] as HTMLElement), 0);
		await expect(widthOf(canvas.getByTestId(`pages-${current}-total`))).toBeCloseTo(
			widthOf(canvas.getByTestId('pages-1-total')),
			0,
		);
	}

	const bar = bars[2] as HTMLElement;
	const width = controlsWidthOf(bar);
	const previous = canvas.getByTestId('pages-10-previous');
	const left = previous.getBoundingClientRect().left;

	await userEvent.click(within(bar).getByRole('button', { name: 'Previous page' }));
	await waitFor(() => expect(slotTexts(bar)).toEqual(['1', '-', '8', '9', '10', '-', '20']));
	await expect(controlsWidthOf(bar)).toBeCloseTo(width, 0);

	await userEvent.click(within(bar).getByRole('button', { name: 'Next page' }));
	await waitFor(() => expect(slotTexts(bar)).toEqual(MANY_PAGES_SLOTS[10]));
	await expect(controlsWidthOf(bar)).toBeCloseTo(width, 0);
	await expect(previous.getBoundingClientRect().left).toBeCloseTo(left, 0);

	// Page 10 of 20 pages, in the rows above, then of 100 and of 1,200.
	const slotWidths = [
		bars[2] as HTMLElement,
		...DIGITS.map(({ pages }) => canvas.getByTestId(`digits-${pages}`)),
	].map((digitsBar) => widthOf(slotsOf(digitsBar)[0] as HTMLElement));
	await expect(slotWidths[0]).toBeLessThan(slotWidths[1] as number);
	await expect(slotWidths[1]).toBeLessThan(slotWidths[2] as number);
}

/**
 * Resolves once the web fonts in the story have loaded. On a cold cache Inter swaps in while `play`
 * runs and moves the controls, so a position read before the swap no longer matches one read after
 * it. Reading a rect lays the canvas out, which starts the font loads that `document.fonts.ready`
 * then waits for.
 */
async function waitForFonts(canvasElement: HTMLElement): Promise<void> {
	canvasElement.getBoundingClientRect();
	await document.fonts.ready;
}

async function expectNarrowContainer(canvas: Canvas): Promise<void> {
	const total: HTMLElement = canvas.getByTestId('narrow-numbered-total');
	const bar = navOf(canvas, 'Narrow numbered pagination');
	const text = total.querySelector<HTMLElement>(':scope > span:not([aria-hidden])');

	// The tooltip only exists once the label has been measured as truncated.
	await waitFor(() => expect(total).toHaveAttribute('data-truncated'));
	await waitForEffects();

	await expect(text?.scrollWidth).toBeGreaterThan(text?.clientWidth ?? 0);
	await expect(positionOf(canvas, 'narrow-numbered-total')).toBe(NARROW_TEXT);
	await expect(
		canvas.getByTestId('narrow-numbered-next').getBoundingClientRect().right,
	).toBeLessThanOrEqual(bar.getBoundingClientRect().right);
	await expect(canvas.getByTestId('narrow-compact-total')).not.toHaveAttribute('data-truncated');
}

async function expectOnePage(canvas: Canvas, id: string, label: string): Promise<void> {
	const inBar = within(navOf(canvas, `Single page, ${id}`));

	await expect(positionOf(canvas, `${id}-total`)).toBe(label);
	await expect(inBar.getAllByRole('button', { name: /^Page \d+$/ })).toHaveLength(1);
	await expect(inBar.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
		'aria-current',
		'page',
	);
	await expect(inBar.getByRole('button', { name: 'Previous page' })).toBeDisabled();
	await expect(inBar.getByRole('button', { name: 'Next page' })).toBeDisabled();
}

async function expectHiddenCompact(canvas: Canvas, id: string, label: string): Promise<void> {
	const inBar = within(navOf(canvas, `Single page, ${id}`));

	await expect(positionOf(canvas, `${id}-total`)).toBe(label);
	await expect(inBar.queryByRole('button', { name: 'Previous' })).toBeNull();
	await expect(inBar.queryByRole('button', { name: 'Next' })).toBeNull();

	for (const part of ['previous', 'divider', 'next']) {
		const element = canvas.getByTestId(`${id}-${part}`);

		await expect(getComputedStyle(element).visibility).toBe('hidden');
		await expect(widthOf(element)).toBeGreaterThan(0);
	}
}

async function expectSinglePage(canvas: Canvas): Promise<void> {
	await expectOnePage(canvas, 'empty', '0 — 0 of 0');
	await expectOnePage(canvas, 'empty-selector', '0 — 0 of 0');
	await expectHiddenCompact(canvas, 'compact-empty', '0 — 0 of 0');
	await expectOnePage(canvas, 'fits', '1 — 8 of 8');
	await expectOnePage(canvas, 'fits-size', '1 — 30 of 30');
	await expectOnePage(canvas, 'selector-pick', '1 — 30 of 30');
	await expectHiddenCompact(canvas, 'compact', '1 — 8 of 8');

	await expect(
		within(navOf(canvas, 'Single page, empty-selector')).getByRole('combobox', {
			name: 'Rows per page',
		}),
	).toBeVisible();

	const picked = within(navOf(canvas, 'Single page, selector-pick'));

	await userEvent.click(picked.getByRole('combobox', { name: 'Rows per page' }));

	const listbox = await within(document.body).findByRole('listbox');
	await userEvent.click(within(listbox).getByRole('option', { name: '10' }));

	await waitFor(() =>
		expect(picked.getAllByRole('button', { name: /^Page \d+$/ })).toHaveLength(3),
	);
	await expect(picked.getByRole('button', { name: 'Next page' })).toBeEnabled();

	await expectOnePage(canvas, 'arrives', '0 — 0 of 0');

	await userEvent.click(canvas.getByRole('button', { name: 'Load the list' }));

	const arrived = within(navOf(canvas, 'Single page, arrives'));

	await waitFor(() => expect(pageButton(arrived, 3)).toHaveAttribute('aria-current', 'page'));
	await expect(positionOf(canvas, 'arrives-total')).toBe('21 — 30 of 100');
}

async function expectTwoPaginations(canvas: Canvas): Promise<void> {
	const inSection = within(canvas.getByTestId('two-paginations'));
	const logs = inSection.getByRole('navigation', { name: 'Logs pagination' });
	const events = inSection.getByRole('navigation', { name: 'Events pagination' });

	await expect(inSection.getAllByRole('navigation')).toHaveLength(2);
	await expect(logs).not.toBe(events);

	await userEvent.click(within(logs).getByRole('button', { name: 'Next page' }));

	await waitFor(() => expect(positionOf(canvas, 'logs-total')).toBe('11 — 20 of 240 log lines'));
	await expect(positionOf(canvas, 'events-total')).toBe('1 — 10 of 95 events');
}

async function holdNarrowTooltipOpen(canvas: Canvas): Promise<void> {
	const total = canvas.getByTestId('narrow-numbered-total');

	fireEvent.pointerEnter(total);
	fireEvent.mouseEnter(total);
	fireEvent.mouseMove(total);

	await waitFor(() =>
		expect(within(document.body).getByRole('tooltip')).toHaveTextContent(NARROW_TEXT),
	);
}

/**
 * Every variant and every state in one snapshot: the numbered and compact bars at the first, a
 * middle and the last page, up to seven pages, `Pagination.Cursor`, the page size selector at both
 * ends, the bar without its position label, the disabled bars, the seven slots at every page, the
 * controls in each state, the truncated position label with its tooltip held open by `play`, the
 * bars with a single page or no items, and two bars on one screen. `play` presses through the rows
 * that name a press: Next to the last page, a page size from the list, a disabled bar that ignores
 * both, and a total that arrives after the page.
 */
export const PaginationShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
		pseudo: {
			hover: stateSelector('hover'),
			focusVisible: stateSelector('focus'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		await waitForFonts(canvasElement);

		await expectFewPages(canvas);
		await expectCompactWalk(canvas);
		await expectCursorEnd(canvas);
		await expectPageSizePick(canvas);
		await expectAlign(canvas);
		await expectDisabled(canvas);
		await expectManyPages(canvas);
		await expectNarrowContainer(canvas);
		await expectSinglePage(canvas);
		await expectTwoPaginations(canvas);
		await holdNarrowTooltipOpen(canvas);
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section title="Numbered">
				<Typography size="sm">
					The first page, a page in the middle and the last page, with a total label. Up to seven
					pages every page renders and no separator does. At the last page Next is disabled and
					focus moves to the current page. The last row is pressed through to its last page.
				</Typography>
				<Rows>
					{[1, 5, 20].map((current) => (
						<Row key={current} label={`Page ${current} of 20`}>
							<Pagination
								total={200}
								showTotalLabel="pods"
								defaultCurrent={current}
								aria-label={`Numbered, page ${current}`}
							/>
						</Row>
					))}
					<Row label="5 pages, no separator">
						<ControlledPagination
							total={50}
							showTotalLabel="pods"
							defaultCurrent={4}
							aria-label="Five pages"
							testId="few-pages"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Compact">
				<Typography size="sm">
					At the ends the button with nowhere to go hides and keeps its space, so the other one does
					not move, and focus follows to the other button. The last row is pressed through to the
					last page.
				</Typography>
				<Rows>
					{[1, 2, 3].map((current) => (
						<Row key={current} label={`Page ${current} of 3`}>
							<Pagination
								variant="compact"
								total={30}
								showTotalLabel="pods"
								defaultCurrent={current}
								aria-label={`Compact, page ${current}`}
							/>
						</Row>
					))}
					<Row label="Press Next twice">
						<ControlledPagination
							variant="compact"
							total={30}
							showTotalLabel="pods"
							aria-label="Compact, press Next twice"
							testId="compact-walk"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Pagination.Cursor">
				<Typography size="sm">
					For a list that does not know its total. Next hides while <code>hasNextPage</code> is
					false, and focus moves to Previous so a keyboard user is not left on a button that is
					gone. The last row asks a list of three pages and is pressed through to the end.
				</Typography>
				<Rows>
					{[
						{ current: 1, hasNextPage: true },
						{ current: 2, hasNextPage: true },
						{ current: 3, hasNextPage: false },
					].map(({ current, hasNextPage }) => (
						<Row key={current} label={`Page ${current}, hasNextPage ${String(hasNextPage)}`}>
							<Pagination.Cursor
								defaultCurrent={current}
								hasNextPage={hasNextPage}
								aria-label={`Cursor, page ${current}`}
							/>
						</Row>
					))}
					<Row label="Three pages, press Next twice">
						<CursorOfThreePages aria-label="Cursor, three pages" testId="cursor-end" />
					</Row>
				</Rows>
			</Section>

			<Section title="Page size">
				<Typography size="sm">
					The selector after the page controls, and before them. The option with a label shows its
					label in the list and its value once picked, and a new size goes back to page 1. The last
					row goes to page 3 and picks that option.
				</Typography>
				<Rows>
					<Row label="position end">
						<Pagination
							total={1240}
							showTotalLabel="pods"
							pageSizeOptions={{ items: PAGE_SIZE_OPTIONS }}
							defaultPageSize={25}
							aria-label="Page size at the end"
						/>
					</Row>
					<Row label="position start">
						<Pagination
							total={1240}
							showTotalLabel="pods"
							pageSizeOptions={{ position: 'start' }}
							aria-label="Page size at the start"
						/>
					</Row>
					<Row label="compact">
						<Pagination
							variant="compact"
							total={1240}
							showTotalLabel="pods"
							pageSizeOptions
							defaultCurrent={2}
							aria-label="Compact with page size"
						/>
					</Row>
					<Row label="Page 3, then a size">
						<ControlledPagination
							total={1240}
							showTotalLabel="pods"
							pageSizeOptions={{ items: PAGE_SIZE_OPTIONS }}
							aria-label="Page size, pick a size"
							testId="size-walk"
							{...pageSizeSpies}
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Without the position label">
				<Typography size="sm">
					<code>align</code> places the page controls when <code>showTotal</code> is false.
				</Typography>
				<AlignRows />
			</Section>

			<Section title="Disabled">
				<Typography size="sm">
					Every control keeps its slot and the position label still shows the range. A press changes
					nothing, and the tooltip shows on hover over any control.
				</Typography>
				<Rows>
					<Row label="numbered">
						<Pagination
							total={200}
							showTotalLabel="pods"
							defaultCurrent={5}
							pageSizeOptions
							disabled
							disabledTooltip={DISABLED_REASON}
							aria-label="Numbered, disabled"
							testId="disabled-numbered"
							{...disabledSpies}
						/>
					</Row>
					<Row label="compact">
						<Pagination
							variant="compact"
							total={30}
							showTotalLabel="pods"
							defaultCurrent={2}
							disabled
							disabledTooltip={DISABLED_REASON}
							aria-label="Compact, disabled"
						/>
					</Row>
				</Rows>
			</Section>

			<Section title="Many pages">
				<Typography size="sm">
					Seven slots at every page, one width for every slot, and slots that grow only when the
					page count gains a digit. The controls and the position label keep their width and their
					place while the page changes.
				</Typography>
				<ManyPagesRows />
			</Section>

			<Section title="States">
				<Typography size="sm">
					The page buttons and the arrows in each state. <code>hover</code> and <code>focus</code>{' '}
					are forced by <code>storybook-addon-pseudo-states</code>.
				</Typography>
				<StateRows />
			</Section>

			<Section title="Narrow container">
				<Typography size="sm">
					The bar fills its parent and the page controls never shrink or wrap, so in a narrow parent
					the position label truncates first and a tooltip holds the full text. A parent too narrow
					for the numbered list should use <code>variant=&quot;compact&quot;</code>, which fits.
				</Typography>
				<NarrowRows />
			</Section>

			<Section title="Single page and total 0">
				<Typography size="sm">
					The bar always renders. With a single page, or a <code>total</code> of 0, the page list
					shows <code>1</code>, both arrows are disabled and a total of 0 reads{' '}
					<code>0 — 0 of 0</code>. The page size selector stays. In <code>compact</code> Previous,
					Next and the divider are hidden and keep their space. A total of 0 never moves the page,
					so a list that has not answered yet leaves the bar on page 1 and the page is still there
					once the total arrives. The row with a selector and a size of 50 picks 10, and the last
					row loads the list.
				</Typography>
				<SinglePageRows />
			</Section>

			<Section title="Two on one screen" testId="two-paginations">
				<Typography size="sm">
					Each bar gets its own <code>aria-label</code>, so the two landmarks differ and a press in
					one leaves the other alone.
				</Typography>
				<div className={styles.stack}>
					<Pagination
						total={240}
						showTotalLabel="log lines"
						aria-label="Logs pagination"
						testId="logs"
					/>
					<Pagination
						total={95}
						showTotalLabel="events"
						aria-label="Events pagination"
						testId="events"
					/>
				</div>
			</Section>
		</div>
	),
};
