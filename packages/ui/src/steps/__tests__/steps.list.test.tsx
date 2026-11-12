import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { Steps } from '../index.js';

const FUNNEL = [
	{ label: 'Service', children: <p>First content</p> },
	{ label: 'Operation', children: <p>Second content</p> },
	{ label: 'Latency', children: <p>Third content</p> },
];

function slotsIn(element: Element): string[] {
	return Array.from(element.querySelectorAll('[data-slot]')).map(
		(slot) => slot.getAttribute('data-slot') ?? '',
	);
}

function listOf(testId: string): HTMLElement {
	return screen.getByTestId(`${testId}-items`);
}

function listItems(testId: string): HTMLElement[] {
	return Array.from(listOf(testId).querySelectorAll<HTMLElement>(':scope > li'));
}

describe('Steps.List root', () => {
	it('renders a div root with the steps-list slot, and the steps in an ol of li', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		const root = screen.getByTestId('funnel');
		const list = listOf('funnel');

		expect(root.tagName).toBe('DIV');
		expect(root).toHaveAttribute('data-slot', 'steps-list');
		expect(list.tagName).toBe('OL');
		expect(list).toHaveAttribute('data-slot', 'steps-list-items');
		expect(list.parentElement).toBe(root);
		expect(listItems('funnel')).toHaveLength(3);
		expect(within(root).getAllByRole('listitem')).toHaveLength(3);
		expect(screen.getByRole('list')).toBe(list);
	});

	it('forwards the id and aria-* props to the ol, and the data-* props to the root', () => {
		render(
			<Steps.List
				items={FUNNEL}
				id="funnel-steps"
				aria-label="Funnel steps"
				aria-describedby="hint"
				data-foo="bar"
				testId="funnel"
			/>,
		);

		const root = screen.getByTestId('funnel');
		const list = listOf('funnel');

		expect(list).toHaveAttribute('id', 'funnel-steps');
		expect(list).toHaveAttribute('aria-label', 'Funnel steps');
		expect(list).toHaveAttribute('aria-describedby', 'hint');
		expect(list).not.toHaveAttribute('data-foo');
		expect(root).toHaveAttribute('data-foo', 'bar');
		expect(root).not.toHaveAttribute('id');
		expect(root).not.toHaveAttribute('aria-label');
		expect(root).not.toHaveAttribute('aria-describedby');
		expect(screen.getByRole('list', { name: 'Funnel steps' })).toBe(list);
	});

	it('keeps data-slot and the test ID on the root whatever data-* the consumer passes', () => {
		render(<Steps.List items={FUNNEL} data-slot="other" data-testid="other" testId="funnel" />);

		expect(screen.getByTestId('funnel')).toHaveAttribute('data-slot', 'steps-list');
		expect(listOf('funnel')).toHaveAttribute('data-slot', 'steps-list-items');
		expect(screen.queryByTestId('other')).toBeNull();
	});

	it('drops a prop that is not id, aria-* or data-*, and does not forward it', () => {
		render(
			<Steps.List
				items={FUNNEL}
				testId="funnel"
				{...({ role: 'tablist', title: 'x', tabIndex: 0 } as object)}
			/>,
		);

		for (const element of [screen.getByTestId('funnel'), listOf('funnel')]) {
			expect(element).not.toHaveAttribute('role');
			expect(element).not.toHaveAttribute('title');
			expect(element).not.toHaveAttribute('tabindex');
		}
		expect(screen.getByRole('list')).toBe(listOf('funnel'));
	});

	it('gives the list no name of its own', () => {
		render(<Steps.List items={FUNNEL} />);

		expect(screen.getByRole('list')).not.toHaveAttribute('aria-label');
	});

	it('has no state to expose', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(document.querySelector('[data-current], [data-status], [aria-current]')).toBeNull();
	});

	it('renders nothing for an empty items', () => {
		const { container } = render(<Steps.List items={[]} testId="funnel" />);

		expect(container).toBeEmptyDOMElement();
		expect(screen.queryByRole('list')).toBeNull();
	});

	it('renders one div root, with the ol as its only child when there is no footer', () => {
		const { container } = render(<Steps.List items={FUNNEL} />);

		expect(container.children).toHaveLength(1);
		expect(container.firstElementChild?.tagName).toBe('DIV');
		expect(container.firstElementChild?.children).toHaveLength(1);
		expect(container.firstElementChild?.firstElementChild?.tagName).toBe('OL');
	});
});

describe('Steps.List structure', () => {
	const ADD = <button type="button">Add step</button>;

	it('keeps the footer outside the ol, as the next sibling of the ol in the root', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		const root = screen.getByTestId('funnel');
		const list = listOf('funnel');
		const footer = screen.getByTestId('funnel-footer');

		expect(list.contains(footer)).toBe(false);
		expect(list.contains(screen.getByRole('button', { name: 'Add step' }))).toBe(false);
		expect(footer.parentElement).toBe(root);
		expect(list.nextElementSibling).toBe(footer);
		expect(Array.from(root.children)).toEqual([list, footer]);
	});

	it('holds only li children in the ol, each one a listitem, with the footer present', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		const list = listOf('funnel');
		const children = Array.from(list.children);

		expect(children).toHaveLength(3);
		for (const child of children) {
			expect(child.tagName).toBe('LI');
			expect(child).not.toHaveAttribute('role');
		}
		expect(within(list).getAllByRole('listitem')).toEqual(children);
		expect(within(list).queryByRole('button')).toBeNull();
	});

	it('renders the footer as a div with no role', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		const footer = screen.getByTestId('funnel-footer');

		expect(footer.tagName).toBe('DIV');
		expect(footer).not.toHaveAttribute('role');
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('renders the ol and the footer only when each has something to show', () => {
		const { rerender } = render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(listOf('funnel')).toBeInTheDocument();
		expect(screen.queryByTestId('funnel-footer')).toBeNull();

		rerender(<Steps.List items={[]} footer={ADD} testId="funnel" />);

		expect(screen.queryByTestId('funnel-items')).toBeNull();
		expect(screen.getByTestId('funnel-footer')).toBeInTheDocument();
	});

	it('forwards the ref to the root div', () => {
		const ref = createRef<HTMLDivElement>();

		render(<Steps.List ref={ref} items={FUNNEL} footer={ADD} testId="funnel" />);

		expect(ref.current).toBe(screen.getByTestId('funnel'));
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'steps-list');
	});
});

describe('Steps.List test IDs and slots', () => {
	it('names every step and part after the step number, from 1', () => {
		render(<Steps.List items={FUNNEL} testId="my-funnel-steps" />);

		const ids = Array.from(
			screen.getByTestId('my-funnel-steps').querySelectorAll('[data-testid]'),
		).map((element) => element.getAttribute('data-testid'));

		expect(ids).toEqual([
			'my-funnel-steps-items',
			'my-funnel-steps-item-1',
			'my-funnel-steps-item-1-marker',
			'my-funnel-steps-item-1-label',
			'my-funnel-steps-item-1-content',
			'my-funnel-steps-item-2',
			'my-funnel-steps-item-2-marker',
			'my-funnel-steps-item-2-label',
			'my-funnel-steps-item-2-content',
			'my-funnel-steps-item-3',
			'my-funnel-steps-item-3-marker',
			'my-funnel-steps-item-3-label',
			'my-funnel-steps-item-3-content',
		]);
	});

	it('puts every test ID on the part it names', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(screen.getByTestId('funnel-item-2').tagName).toBe('LI');
		expect(screen.getByTestId('funnel-item-2')).toHaveAttribute('data-slot', 'steps-list-item');
		expect(screen.getByTestId('funnel-item-2-marker')).toHaveAttribute(
			'data-slot',
			'steps-list-marker',
		);
		expect(screen.getByTestId('funnel-item-2-label')).toHaveAttribute(
			'data-slot',
			'steps-list-label',
		);
		expect(screen.getByTestId('funnel-item-2-content')).toHaveAttribute(
			'data-slot',
			'steps-list-content',
		);
	});

	it('gives the ol the test ID of the root with -items', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(listOf('funnel')).toHaveAttribute('data-slot', 'steps-list-items');
		expect(screen.getByTestId('funnel')).not.toBe(listOf('funnel'));
	});

	it('gives no part a data-testid without testId', () => {
		const { container } = render(<Steps.List items={FUNNEL} />);

		expect(container.querySelectorAll('[data-testid]')).toHaveLength(0);
		expect(container.querySelectorAll('[data-slot]').length).toBeGreaterThan(0);
	});

	it('names the slots of the list', () => {
		render(<Steps.List items={FUNNEL} />);

		expect(new Set(slotsIn(document.body))).toEqual(
			new Set([
				'steps-list',
				'steps-list-items',
				'steps-list-item',
				'steps-list-marker',
				'steps-list-connector',
				'steps-list-label',
				'steps-list-content',
			]),
		);
	});

	it('names the parts of a step, with the label before the content', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(slotsIn(screen.getByTestId('funnel-item-1'))).toEqual([
			'steps-list-marker',
			'steps-list-connector',
			'steps-list-label',
			'steps-list-content',
		]);
	});

	it('gives every step but the last a connector', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		const [first, second, third] = listItems('funnel').map((item) =>
			item.querySelector('[data-slot="steps-list-connector"]'),
		);

		expect(first).not.toBeNull();
		expect(second).not.toBeNull();
		expect(third).toBeNull();
	});

	it('gives a single step no connector', () => {
		render(<Steps.List items={[{ children: 'only' }]} />);

		expect(document.querySelector('[data-slot="steps-list-connector"]')).toBeNull();
	});

	it('does not use the slots of the row', () => {
		render(<Steps.List items={FUNNEL} />);

		expect(
			document.querySelector(
				'[data-slot="steps"], [data-slot="steps-item"], [data-slot="steps-marker"], [data-slot="steps-label"]',
			),
		).toBeNull();
	});
});

describe('Steps.List content', () => {
	it('numbers the markers from 1, in the order of the items', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		for (const n of [1, 2, 3]) {
			expect(screen.getByTestId(`funnel-item-${n}-marker`)).toHaveTextContent(String(n));
		}
	});

	it('hides every marker and connector from assistive technology', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		for (const n of [1, 2, 3]) {
			expect(screen.getByTestId(`funnel-item-${n}-marker`)).toHaveAttribute('aria-hidden', 'true');
		}
		for (const connector of document.querySelectorAll('[data-slot="steps-list-connector"]')) {
			expect(connector).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('renders the children of each step in its content', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		expect(within(screen.getByTestId('funnel-item-1-content')).getByText('First content')).toBe(
			screen.getByText('First content'),
		);
		expect(screen.getByTestId('funnel-item-2-content')).toHaveTextContent('Second content');
		expect(screen.getByTestId('funnel-item-3-content')).toHaveTextContent('Third content');
	});

	it('renders the label as plain text before the content', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		const label = screen.getByTestId('funnel-item-1-label');
		const content = screen.getByTestId('funnel-item-1-content');

		expect(label).toHaveTextContent('Service');
		expect(label.children).toHaveLength(0);
		expect(label.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('renders no label slot for a step with no label, and keeps the marker and the content', () => {
		render(
			<Steps.List
				items={[{ children: <p>No label content</p> }, { label: 'Second', children: 'b' }]}
				testId="funnel"
			/>,
		);

		expect(screen.queryByTestId('funnel-item-1-label')).toBeNull();
		expect(
			screen.getByTestId('funnel-item-1').querySelector('[data-slot="steps-list-label"]'),
		).toBeNull();
		expect(screen.getByTestId('funnel-item-1-marker')).toHaveTextContent('1');
		expect(screen.getByTestId('funnel-item-1-content')).toHaveTextContent('No label content');
		expect(screen.getByTestId('funnel-item-2-label')).toHaveTextContent('Second');
	});

	it.each([
		['an empty label', ''],
		['a label of spaces', '   '],
	])('renders no label slot for %s', (_name, label) => {
		render(<Steps.List items={[{ label, children: 'content' }]} testId="funnel" />);

		expect(screen.queryByTestId('funnel-item-1-label')).toBeNull();
		expect(screen.getByTestId('funnel-item-1-content')).toHaveTextContent('content');
	});

	it('does not show <No label> for a step with no label', () => {
		render(<Steps.List items={[{ children: 'content' }]} />);

		expect(screen.queryByText('<No label>')).toBeNull();
	});

	it('keeps the marker and the connector of a step whose content renders nothing', () => {
		render(
			<Steps.List
				items={[
					{ label: 'One', children: null },
					{ label: 'Two', children: false },
					{ label: 'Three', children: undefined },
					{ label: 'Four', children: <p>Four content</p> },
				]}
				testId="funnel"
			/>,
		);

		for (const n of [1, 2, 3, 4]) {
			expect(screen.getByTestId(`funnel-item-${n}-marker`), `step ${n}`).toHaveTextContent(
				String(n),
			);
			expect(screen.getByTestId(`funnel-item-${n}-content`), `step ${n}`).toBeInTheDocument();
		}
		expect(screen.getByTestId('funnel-item-1-content')).toBeEmptyDOMElement();
		expect(screen.getByTestId('funnel-item-2-content')).toBeEmptyDOMElement();
		expect(screen.getByTestId('funnel-item-3-content')).toBeEmptyDOMElement();
		expect(document.querySelectorAll('[data-slot="steps-list-connector"]')).toHaveLength(3);
	});

	it('keeps the marker of a step with no label and no content', () => {
		render(<Steps.List items={[{ children: null }, { children: 'b' }]} testId="funnel" />);

		expect(screen.getByTestId('funnel-item-1-marker')).toHaveTextContent('1');
		expect(screen.getByTestId('funnel-item-2-marker')).toHaveTextContent('2');
	});

	it('holds any element in the content', () => {
		render(
			<Steps.List
				items={[
					{
						label: 'Service',
						children: (
							<form aria-label="Service form">
								<input aria-label="Name" />
								<button type="button">Save</button>
							</form>
						),
					},
				]}
			/>,
		);

		expect(screen.getByRole('form', { name: 'Service form' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
	});

	it('keeps the state of the content of a step while the other steps change', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Steps.List
				items={[
					{ label: 'One', children: <input aria-label="One name" /> },
					{ label: 'Two', children: 'b' },
				]}
			/>,
		);
		await user.type(screen.getByRole('textbox', { name: 'One name' }), 'abc');

		rerender(
			<Steps.List
				items={[
					{ label: 'One', children: <input aria-label="One name" /> },
					{ label: 'Two changed', children: 'c' },
				]}
			/>,
		);

		expect(screen.getByRole('textbox', { name: 'One name' })).toHaveValue('abc');
	});

	it('gives the state of a removed step to no other step when the content carries a key', async () => {
		const user = userEvent.setup();
		const funnel = (names: string[]) =>
			names.map((name) => ({
				label: name,
				children: <input key={name} aria-label={`${name} name`} defaultValue={name} />,
			}));
		const { rerender } = render(<Steps.List items={funnel(['One', 'Two', 'Three'])} />);
		await user.type(screen.getByRole('textbox', { name: 'Two name' }), ' typed');

		rerender(<Steps.List items={funnel(['One', 'Three'])} />);

		expect(screen.getByRole('textbox', { name: 'Three name' })).toHaveValue('Three');
		expect(screen.queryByDisplayValue('Two typed')).toBeNull();
	});

	it('keeps the state and the focus of the steps after a removed one when the content carries a key', async () => {
		const user = userEvent.setup();
		const funnel = (names: string[]) =>
			names.map((name) => ({
				label: name,
				children: <input key={name} aria-label={`${name} name`} defaultValue={name} />,
			}));
		const { rerender } = render(<Steps.List items={funnel(['One', 'Two', 'Three'])} />);
		await user.type(screen.getByRole('textbox', { name: 'Two name' }), ' typed');
		await user.type(screen.getByRole('textbox', { name: 'Three name' }), ' typed');
		const three = screen.getByRole('textbox', { name: 'Three name' });

		rerender(<Steps.List items={funnel(['Two', 'Three'])} />);

		expect(screen.getByRole('textbox', { name: 'Two name' })).toHaveValue('Two typed');
		expect(screen.getByRole('textbox', { name: 'Three name' })).toBe(three);
		expect(three).toHaveValue('Three typed');
		expect(three).toHaveFocus();
	});

	it('keeps the state of a step that moves when the content carries a key', async () => {
		const user = userEvent.setup();
		const funnel = (names: string[]) =>
			names.map((name) => ({
				label: name,
				children: <input key={name} aria-label={`${name} name`} defaultValue={name} />,
			}));
		const { rerender } = render(<Steps.List items={funnel(['One', 'Two'])} />);
		await user.type(screen.getByRole('textbox', { name: 'One name' }), ' typed');

		rerender(<Steps.List items={funnel(['Two', 'One'])} testId="funnel" />);

		expect(screen.getByRole('textbox', { name: 'One name' })).toHaveValue('One typed');
		expect(screen.getByTestId('funnel-item-2-content')).toContainElement(
			screen.getByRole('textbox', { name: 'One name' }),
		);
	});

	it('does not cut anything, and gives no tab stop to a long label', () => {
		render(
			<Steps.List
				items={[
					{
						label: 'A very long label that wraps instead of being cut off at the end of its line',
						children: 'content',
					},
				]}
				testId="funnel"
			/>,
		);

		const label = screen.getByTestId('funnel-item-1-label');

		expect(label).not.toHaveAttribute('data-truncated');
		expect(label).not.toHaveAttribute('tabindex');
		expect(document.querySelector('[data-truncated], [tabindex]')).toBeNull();
	});
});

describe('Steps.List keyboard', () => {
	it('is not focusable, and exposes no tab stop of its own', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<>
				<button type="button">before</button>
				<Steps.List items={FUNNEL} testId="funnel" />
				<button type="button">after</button>
			</>,
		);

		expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);

		await user.tab();
		await user.tab();

		expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
	});

	it('moves Tab through the controls of step 1, then step 2, in the order they render', async () => {
		const user = userEvent.setup();
		render(
			<Steps.List
				testId="funnel"
				items={[
					{
						label: 'Service',
						children: (
							<>
								<input aria-label="1a" />
								<button type="button">1b</button>
							</>
						),
					},
					{ children: <button type="button">2a</button> },
					{ label: 'Latency', children: <input aria-label="3a" /> },
				]}
			/>,
		);

		const order: string[] = [];
		for (let index = 0; index < 4; index += 1) {
			await user.tab();
			order.push(
				document.activeElement?.getAttribute('aria-label') ??
					document.activeElement?.textContent ??
					'',
			);
		}

		expect(order).toEqual(['1a', '1b', '2a', '3a']);
	});

	it('keeps the focus order of the content whatever the step with no content does', async () => {
		const user = userEvent.setup();
		render(
			<Steps.List
				items={[
					{ children: <button type="button">first</button> },
					{ children: null },
					{ children: <button type="button">third</button> },
				]}
			/>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'first' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: 'third' })).toHaveFocus();
	});

	it('does not react to a click on a marker or a label', async () => {
		const user = userEvent.setup();
		render(<Steps.List items={FUNNEL} testId="funnel" />);

		await user.click(screen.getByTestId('funnel-item-2-marker'));
		await user.click(screen.getByTestId('funnel-item-2-label'));

		expect(document.body).toHaveFocus();
	});
});

describe('Steps.List props that get past the types', () => {
	it('drops current, and does not forward it', () => {
		render(<Steps.List items={FUNNEL} testId="funnel" {...({ current: 2 } as object)} />);

		const root = screen.getByTestId('funnel');

		expect(root).not.toHaveAttribute('current');
		expect(root).not.toHaveAttribute('data-current');
		expect(listItems('funnel').every((item) => !item.hasAttribute('aria-current'))).toBe(true);
		expect(listItems('funnel').every((item) => !item.hasAttribute('data-status'))).toBe(true);
		for (const n of [1, 2, 3]) {
			expect(screen.getByTestId(`funnel-item-${n}-marker`)).toHaveTextContent(String(n));
		}
	});

	it('does not warn about a current it drops', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		onTestFinished(() => warn.mockRestore());

		render(<Steps.List items={FUNNEL} {...({ current: 0 } as object)} />);

		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Steps.List footer', () => {
	const ADD = <button type="button">Add step</button>;

	it('renders the footer after the last step, outside the count of steps', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" aria-label="Funnel steps" />);

		const list = screen.getByRole('list', { name: 'Funnel steps' });
		const footer = screen.getByTestId('funnel-footer');

		const last = listItems('funnel').at(-1) as HTMLElement;

		expect(listItems('funnel')).toHaveLength(3);
		expect(last.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(within(list).getAllByRole('listitem')).toHaveLength(3);
		expect(
			within(screen.getByTestId('funnel-footer-content')).getByRole('button'),
		).toHaveTextContent('Add step');
	});

	it('names the slots and test IDs of the footer', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		expect(slotsIn(screen.getByTestId('funnel-footer'))).toEqual([
			'steps-list-footer-connector',
			'steps-list-footer-marker',
			'steps-list-footer-content',
		]);
		expect(screen.getByTestId('funnel-footer')).toHaveAttribute('data-slot', 'steps-list-footer');
		expect(screen.getByTestId('funnel-footer-marker')).toHaveAttribute(
			'data-slot',
			'steps-list-footer-marker',
		);
		expect(screen.getByTestId('funnel-footer-content')).toHaveAttribute(
			'data-slot',
			'steps-list-footer-content',
		);
	});

	it('gives the footer a dot with no number, hidden from assistive technology', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		const marker = screen.getByTestId('funnel-footer-marker');

		expect(marker).toHaveAttribute('aria-hidden', 'true');
		expect(marker).toBeEmptyDOMElement();
	});

	it('runs the line of the last step down to the footer', () => {
		render(<Steps.List items={FUNNEL} footer={ADD} testId="funnel" />);

		for (const n of [1, 2, 3]) {
			expect(
				screen.getByTestId(`funnel-item-${n}`).querySelector('[data-slot="steps-list-connector"]'),
				`step ${n}`,
			).not.toBeNull();
		}
	});

	it('renders the footer alone for an empty items, with no list at all', () => {
		render(
			<Steps.List
				items={[]}
				footer={ADD}
				testId="funnel"
				id="funnel-steps"
				aria-label="Funnel steps"
				data-foo="bar"
			/>,
		);

		const root = screen.getByTestId('funnel');

		expect(screen.queryByRole('list')).toBeNull();
		expect(screen.queryByRole('listitem')).toBeNull();
		expect(screen.queryByTestId('funnel-items')).toBeNull();
		expect(root.querySelector('ol, li')).toBeNull();
		expect(root).toHaveAttribute('data-foo', 'bar');
		expect(document.querySelector('[aria-label], [id]')).toBeNull();
		expect(within(root).getByRole('button', { name: 'Add step' })).toBeInTheDocument();
		expect(Array.from(root.children)).toEqual([screen.getByTestId('funnel-footer')]);
	});

	it.each([
		['null', null],
		['false', false],
		['an empty string', ''],
		['undefined', undefined],
		['an empty array', []],
		['a fragment of a false condition', <>{false}</>],
		['an array of empty values', [null, false, '']],
	])('renders no footer for %s, and no line under the last step', (_name, footer) => {
		render(<Steps.List items={FUNNEL} footer={footer} testId="funnel" />);

		expect(screen.queryByTestId('funnel-footer')).toBeNull();
		expect(
			screen.getByTestId('funnel-item-3').querySelector('[data-slot="steps-list-connector"]'),
		).toBeNull();
	});

	it.each([
		['false', false],
		['a fragment of a false condition', <>{false}</>],
	])('renders nothing for an empty items and a footer of %s', (_name, footer) => {
		const { container } = render(<Steps.List items={[]} footer={footer} testId="funnel" />);

		expect(container).toBeEmptyDOMElement();
	});

	it('reaches the footer with Tab after the content of the last step', async () => {
		const user = userEvent.setup();

		render(
			<Steps.List
				items={[{ label: 'Service', children: <input aria-label="Service" /> }]}
				footer={ADD}
			/>,
		);

		await user.tab();
		expect(screen.getByRole('textbox', { name: 'Service' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Add step' })).toHaveFocus();
	});
});
