import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Collapse } from '../collapse.js';
import { COLLAPSE_EMPTY_CONTENT, COLLAPSE_EMPTY_TITLE } from '../constants.js';
import { getHeader, GROUP_ITEMS } from './collapse.test-utils.js';

const icon = <svg data-testid="icon" />;

afterEach(() => {
	vi.restoreAllMocks();
});

function renderFull() {
	return render(
		<Collapse
			variant="outlined"
			size="sm"
			testId="c"
			title="Advanced"
			description="More settings"
			prefix={icon}
			headerSuffix={<button type="button">Edit</button>}
			defaultExpanded
		>
			Body
		</Collapse>,
	);
}

describe('Collapse parts', () => {
	it('renders the root with its slot and test id', () => {
		renderFull();

		expect(screen.getByTestId('c')).toHaveAttribute('data-slot', 'collapse');
	});

	it.each([
		['toggle', 'collapse-toggle'],
		['prefix', 'collapse-prefix'],
		['title', 'collapse-title'],
		['description', 'collapse-description'],
		['header-suffix', 'collapse-header-suffix'],
		['panel', 'collapse-panel'],
	])('renders the %s part with its test id and slot', (part, slot) => {
		renderFull();

		expect(screen.getByTestId(`c-${part}`)).toHaveAttribute('data-slot', slot);
		expect(screen.getByTestId('c')).toContainElement(screen.getByTestId(`c-${part}`));
	});

	it('renders the header row and the chevron, which have no test id', () => {
		const { container } = renderFull();
		const header = getHeader(screen.getByTestId('c'));
		const chevron = container.querySelector('[data-slot="collapse-chevron"]');

		expect(header).not.toHaveAttribute('data-testid');
		expect(chevron).not.toHaveAttribute('data-testid');
		expect(screen.getByTestId('c-toggle')).toContainElement(chevron as HTMLElement);
	});

	it('puts the title, the description, the prefix and the chevron inside the toggle', () => {
		renderFull();
		const toggle = screen.getByTestId('c-toggle');

		expect(toggle).toContainElement(screen.getByTestId('c-title'));
		expect(toggle).toContainElement(screen.getByTestId('c-description'));
		expect(toggle).toContainElement(screen.getByTestId('c-prefix'));
		expect(toggle).toContainElement(screen.getByTestId('icon'));
	});

	it('draws the chevron first, then the prefix, then the title', () => {
		const { container } = renderFull();
		const chevron = container.querySelector('[data-slot="collapse-chevron"]') as HTMLElement;
		const prefix = screen.getByTestId('c-prefix');
		const title = screen.getByTestId('c-title');
		const description = screen.getByTestId('c-description');

		expect(chevron.compareDocumentPosition(prefix)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		expect(prefix.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		expect(title.compareDocumentPosition(description)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	it('puts the header suffix in the header row, after and outside the toggle', () => {
		renderFull();
		const suffix = screen.getByTestId('c-header-suffix');
		const toggle = screen.getByTestId('c-toggle');

		expect(getHeader(screen.getByTestId('c'))).toContainElement(suffix);
		expect(toggle).not.toContainElement(suffix);
		expect(toggle.compareDocumentPosition(suffix)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		expect(within(suffix).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
	});

	it('puts the panel after the header row', () => {
		renderFull();
		const header = getHeader(screen.getByTestId('c'));
		const panel = screen.getByTestId('c-panel');

		expect(header.compareDocumentPosition(panel)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		expect(panel).toHaveTextContent('Body');
	});

	it('renders the title and the description as text', () => {
		renderFull();

		expect(screen.getByTestId('c-title')).toHaveTextContent('Advanced');
		expect(screen.getByTestId('c-description')).toHaveTextContent('More settings');
	});

	it('leaves out the prefix, the description and the header suffix when they are not given', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.queryByTestId('c-prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('c-description')).not.toBeInTheDocument();
		expect(screen.queryByTestId('c-header-suffix')).not.toBeInTheDocument();
		expect(screen.getByTestId('c-toggle')).toBeInTheDocument();
		expect(screen.getByTestId('c-title')).toBeInTheDocument();
		expect(screen.getByTestId('c-panel')).toBeInTheDocument();
	});

	it.each([null, undefined, false, ''])(
		'leaves out the description and the header suffix when they are %j',
		(empty) => {
			render(
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					title="Advanced"
					description={empty}
					headerSuffix={empty}
					defaultExpanded
				>
					Body
				</Collapse>,
			);

			expect(screen.queryByTestId('c-description')).not.toBeInTheDocument();
			expect(screen.queryByTestId('c-header-suffix')).not.toBeInTheDocument();
		},
	);

	it('renders no panel while collapsed', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument();
		expect(screen.queryByText('Body')).not.toBeInTheDocument();
	});

	it('gives no part a test id when the section has none', () => {
		const { container } = render(
			<Collapse
				variant="outlined"
				size="sm"
				title="Advanced"
				description="More"
				prefix={icon}
				headerSuffix={<span>Suffix</span>}
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		const slots = container.querySelectorAll('[data-slot]');

		expect(slots.length).toBeGreaterThanOrEqual(9);

		for (const slot of slots) {
			expect(slot).not.toHaveAttribute('data-testid');
		}

		expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
	});
});

describe('Collapse heading', () => {
	it('wraps the toggle in an h3 by default', () => {
		renderFull();

		const heading = screen.getByRole('heading', { level: 3 });

		expect(heading.tagName).toBe('H3');
		expect(heading).toContainElement(screen.getByRole('button', { name: 'Advanced' }));
	});

	it.each([2, 3, 4, 5, 6] as const)('wraps the toggle in an h%i for headingLevel %i', (level) => {
		render(
			<Collapse variant="outlined" size="sm" title="Advanced" headingLevel={level} defaultExpanded>
				Body
			</Collapse>,
		);

		const heading = screen.getByRole('heading', { level });

		expect(heading.tagName).toBe(`H${level}`);
		expect(heading).toContainElement(screen.getByRole('button', { name: 'Advanced' }));
	});

	it('holds only the toggle, so the header suffix is outside the heading', () => {
		renderFull();
		const heading = screen.getByRole('heading', { level: 3 });

		expect(heading.children).toHaveLength(1);
		expect(heading.firstElementChild).toBe(screen.getByTestId('c-toggle'));
		expect(heading).not.toContainElement(screen.getByTestId('c-header-suffix'));
	});

	it('has one heading per section', () => {
		render(
			<>
				<Collapse variant="outlined" size="sm" title="First" defaultExpanded>
					a
				</Collapse>
				<Collapse variant="outlined" size="sm" title="Second" defaultExpanded={false}>
					b
				</Collapse>
			</>,
		);

		expect(screen.getAllByRole('heading')).toHaveLength(2);
	});
});

describe('Collapse data attributes', () => {
	it.each(['outlined', 'ghost'] as const)('mirrors variant %s on the root', (variant) => {
		render(
			<Collapse variant={variant} size="sm" testId="c" title="t" defaultExpanded>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-variant', variant);
	});

	it('mirrors the size on the root', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="t" defaultExpanded>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-size', 'sm');
	});

	it('defaults the text overflow to ellipsis', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="t" defaultExpanded>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it.each(['ellipsis', 'wrap'] as const)('mirrors textOverflow %s on the root', (textOverflow) => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="t"
				textOverflow={textOverflow}
				defaultExpanded
			>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-text-overflow', textOverflow);
	});

	it('sets data-expanded on the root only while it is open', () => {
		const { rerender } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="t"
				expanded
				onExpandedChange={vi.fn()}
			>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-expanded');

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="t"
				expanded={false}
				onExpandedChange={vi.fn()}
			>
				a
			</Collapse>,
		);

		expect(screen.getByTestId('c')).not.toHaveAttribute('data-expanded');
	});
});

describe('Collapse pass-through props', () => {
	it('puts the id and every data attribute on the root', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				id="section"
				data-foo="bar"
				data-analytics-id="advanced"
				title="Advanced"
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		const root = screen.getByTestId('c');

		expect(root).toHaveAttribute('id', 'section');
		expect(root).toHaveAttribute('data-foo', 'bar');
		expect(root).toHaveAttribute('data-analytics-id', 'advanced');
		expect(screen.getByTestId('c-toggle')).not.toHaveAttribute('data-foo');
		expect(screen.getByTestId('c-toggle')).not.toHaveAttribute('id', 'section');
	});

	it('puts the aria attributes on the toggle and none on the root', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				aria-keyshortcuts="Alt+A"
				aria-details="details"
				title="Advanced"
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		const toggle = screen.getByTestId('c-toggle');
		const root = screen.getByTestId('c');

		expect(toggle).toHaveAttribute('aria-keyshortcuts', 'Alt+A');
		expect(toggle).toHaveAttribute('aria-details', 'details');
		expect(root).not.toHaveAttribute('aria-keyshortcuts');
		expect(root).not.toHaveAttribute('aria-details');
	});
});

describe('Collapse empty title', () => {
	it.each([null, undefined, false, ''])('shows <No title> for a title of %j', (title) => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title={title} defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(COLLAPSE_EMPTY_TITLE).toBe('<No title>');
		expect(screen.getByTestId('c-title')).toHaveTextContent('<No title>');
		expect(screen.getByTestId('c-title')).toHaveAttribute('data-empty-title');
		expect(screen.getByRole('button', { name: '<No title>' })).toBeInTheDocument();
	});

	it('shows <No title> for a title that is an empty fragment or an array of empties', () => {
		render(
			<>
				<Collapse
					variant="outlined"
					size="sm"
					testId="fragment"
					title={<></>}
					defaultExpanded={false}
				>
					a
				</Collapse>
				<Collapse
					variant="outlined"
					size="sm"
					testId="array"
					title={[null, false, '']}
					defaultExpanded={false}
				>
					a
				</Collapse>
			</>,
		);

		expect(screen.getByTestId('fragment-title')).toHaveTextContent('<No title>');
		expect(screen.getByTestId('array-title')).toHaveTextContent('<No title>');
	});

	it('keeps the section in the page, so the user can still open it', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c')).toBeVisible();
		expect(screen.getByTestId('c-toggle')).toBeVisible();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});

	it('writes no data-empty-title for a title with text', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-title')).not.toHaveAttribute('data-empty-title');
		expect(screen.getByTestId('c-title')).not.toHaveTextContent('<No title>');
	});

	it('shows a title with inline formatting', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title={
					<>
						All <strong>attributes</strong>
					</>
				}
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-title')).toHaveTextContent('All attributes');
		expect(screen.getByRole('button', { name: 'All attributes' })).toBeInTheDocument();
	});
});

describe('Collapse empty content', () => {
	it.each([null, undefined, false, ''])(
		'shows <No content> in the open panel for %j',
		(children) => {
			render(
				<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
					{children}
				</Collapse>,
			);

			expect(COLLAPSE_EMPTY_CONTENT).toBe('<No content>');
			expect(screen.getByTestId('c-panel')).toHaveTextContent('<No content>');
		},
	);

	it('shows <No content> for children that are an empty fragment', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				<></>
			</Collapse>,
		);

		expect(screen.getByTestId('c-panel')).toHaveTextContent('<No content>');
	});

	it('shows no <No content> while the section has content', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-panel')).not.toHaveTextContent('<No content>');
	});

	it('keeps the section in the page when both the title and the content are empty', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title={null} defaultExpanded>
				{null}
			</Collapse>,
		);

		expect(screen.getByTestId('c-title')).toHaveTextContent('<No title>');
		expect(screen.getByTestId('c-panel')).toHaveTextContent('<No content>');
	});
});

describe('Collapse.Group parts', () => {
	it('renders the root with its slot, test id and look', () => {
		render(
			<Collapse.Group
				variant="ghost"
				size="sm"
				textOverflow="wrap"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		const root = screen.getByTestId('g');

		expect(root).toHaveAttribute('data-slot', 'collapse-group');
		expect(root).toHaveAttribute('data-variant', 'ghost');
		expect(root).toHaveAttribute('data-size', 'sm');
		expect(root).toHaveAttribute('data-text-overflow', 'wrap');
	});

	it('defaults the text overflow of the group to ellipsis', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		expect(screen.getByTestId('g')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it('renders each item as g-item-<value>, with its slot', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		for (const { value } of GROUP_ITEMS) {
			const item = screen.getByTestId(`g-item-${value}`);

			expect(item).toHaveAttribute('data-slot', 'collapse-group-item');
			expect(screen.getByTestId('g')).toContainElement(item);
		}
	});

	it('renders the items in the order of items', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={[...GROUP_ITEMS].reverse()}
				defaultValue={[]}
			/>,
		);

		expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
			'Metrics',
			'Traces',
			'Logs',
		]);
	});

	it.each([
		['toggle', 'collapse-toggle'],
		['prefix', 'collapse-prefix'],
		['title', 'collapse-title'],
		['description', 'collapse-description'],
		['header-suffix', 'collapse-header-suffix'],
		['panel', 'collapse-panel'],
	])('names the %s part of an item under the item test id', (part, slot) => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={['logs']}
				items={[
					{
						value: 'logs',
						title: 'Logs',
						description: 'Everything logged',
						prefix: icon,
						headerSuffix: <button type="button">Edit</button>,
						children: 'Logs body',
					},
				]}
			/>,
		);

		const element = screen.getByTestId(`g-item-logs-${part}`);

		expect(element).toHaveAttribute('data-slot', slot);
		expect(screen.getByTestId('g-item-logs')).toContainElement(element);
	});

	it('renders the header row and the chevron of every item', () => {
		const { container } = render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />,
		);

		expect(container.querySelectorAll('[data-slot="collapse-header"]')).toHaveLength(3);
		expect(container.querySelectorAll('[data-slot="collapse-chevron"]')).toHaveLength(3);
	});

	it('leaves out the parts an item does not have, and the panel of a collapsed item', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={['logs']}
			/>,
		);

		expect(screen.getByTestId('g-item-logs-panel')).toBeInTheDocument();
		expect(screen.queryByTestId('g-item-traces-panel')).not.toBeInTheDocument();
		expect(screen.queryByTestId('g-item-logs-prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('g-item-logs-description')).not.toBeInTheDocument();
		expect(screen.queryByTestId('g-item-logs-header-suffix')).not.toBeInTheDocument();
	});

	it('lets the test id of an item win, and name its parts', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={['logs']}
				items={[
					{ value: 'logs', testId: 'custom', title: 'Logs', children: 'Logs body' },
					{ value: 'traces', title: 'Traces', children: 'Traces body' },
				]}
			/>,
		);

		expect(screen.getByTestId('custom')).toHaveAttribute('data-slot', 'collapse-group-item');
		expect(screen.getByTestId('custom-toggle')).toBeInTheDocument();
		expect(screen.getByTestId('custom-title')).toBeInTheDocument();
		expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
		expect(screen.queryByTestId('g-item-logs')).not.toBeInTheDocument();
		expect(screen.queryByTestId('g-item-logs-toggle')).not.toBeInTheDocument();
		expect(screen.getByTestId('g-item-traces')).toBeInTheDocument();
	});

	it('names the parts of an item by its own test id when the group has none', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				defaultValue={[]}
				items={[{ value: 'logs', testId: 'custom', title: 'Logs', children: 'a' }]}
			/>,
		);

		expect(screen.getByTestId('custom')).toBeInTheDocument();
		expect(screen.getByTestId('custom-toggle')).toBeInTheDocument();
	});

	it('gives nothing a test id when neither the group nor the item has one', () => {
		const { container } = render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={['logs']} />,
		);

		for (const slot of container.querySelectorAll('[data-slot]')) {
			expect(slot).not.toHaveAttribute('data-testid');
		}
	});

	it('sets data-expanded on an item only while it is open', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={['traces']}
			/>,
		);

		expect(screen.getByTestId('g-item-logs')).not.toHaveAttribute('data-expanded');
		expect(screen.getByTestId('g-item-traces')).toHaveAttribute('data-expanded');
		expect(screen.getByTestId('g')).not.toHaveAttribute('data-expanded');
	});

	it('renders the description, the prefix and the header suffix of an item next to its title', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={[]}
				items={[
					{
						value: 'logs',
						title: 'Logs',
						description: 'Everything logged',
						prefix: icon,
						headerSuffix: <button type="button">Edit</button>,
						children: 'a',
					},
				]}
			/>,
		);

		expect(screen.getByTestId('g-item-logs-description')).toHaveTextContent('Everything logged');
		expect(screen.getByTestId('g-item-logs-toggle')).toContainElement(screen.getByTestId('icon'));
		expect(screen.getByTestId('g-item-logs-toggle')).not.toContainElement(
			screen.getByRole('button', { name: 'Edit' }),
		);
	});
});

describe('Collapse.Group heading', () => {
	it('wraps every toggle in an h3 by default', () => {
		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
	});

	it.each([2, 4, 6] as const)('wraps every toggle in an h%i for headingLevel %i', (level) => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				headingLevel={level}
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		const headings = screen.getAllByRole('heading', { level });

		expect(headings).toHaveLength(3);

		for (const heading of headings) {
			expect(heading.tagName).toBe(`H${level}`);
			expect(heading.children).toHaveLength(1);
			expect(heading.firstElementChild?.tagName).toBe('BUTTON');
		}
	});
});

describe('Collapse.Group pass-through props', () => {
	it('puts the id, every aria attribute and every data attribute on the root', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				id="faq"
				aria-label="FAQ"
				aria-keyshortcuts="Alt+F"
				data-foo="bar"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		const root = screen.getByTestId('g');

		expect(root).toHaveAttribute('id', 'faq');
		expect(root).toHaveAttribute('aria-label', 'FAQ');
		expect(root).toHaveAttribute('aria-keyshortcuts', 'Alt+F');
		expect(root).toHaveAttribute('data-foo', 'bar');
		expect(screen.getByRole('button', { name: 'Logs' })).not.toHaveAttribute('aria-label');
	});
});

describe('Collapse.Group empty states', () => {
	it('renders an empty root for an empty items, with no warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(<Collapse.Group variant="outlined" size="sm" testId="g" items={[]} defaultValue={[]} />);

		expect(screen.getByTestId('g')).toBeEmptyDOMElement();
		expect(screen.getByTestId('g')).toHaveAttribute('data-slot', 'collapse-group');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});

	it('shows <No title> and <No content> for an item that has neither', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={['a']}
				items={[{ value: 'a', title: null, children: null }]}
			/>,
		);

		expect(screen.getByTestId('g-item-a-title')).toHaveTextContent('<No title>');
		expect(screen.getByTestId('g-item-a-title')).toHaveAttribute('data-empty-title');
		expect(screen.getByTestId('g-item-a-panel')).toHaveTextContent('<No content>');
	});

	it('renders only the first of two items that share a value, and warns', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={['a']}
				items={[
					{ value: 'a', title: 'First', children: 'First body' },
					{ value: 'b', title: 'Other', children: 'Other body' },
					{ value: 'a', title: 'Second', children: 'Second body' },
				]}
			/>,
		);

		expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
			'First',
			'Other',
		]);
		expect(screen.queryByText('Second')).not.toBeInTheDocument();
		expect(screen.queryByText('Second body')).not.toBeInTheDocument();
		expect(screen.getByText('First body')).toBeInTheDocument();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('share a `value`'));
	});

	it('does not warn when every value is unique', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Collapse chevron and prefix', () => {
	it('hides the chevron from assistive tech', () => {
		const { container } = renderFull();

		expect(container.querySelector('[data-slot="collapse-chevron"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
	});

	it('hides the prefix from assistive tech, and keeps the icon inside it', () => {
		renderFull();

		expect(screen.getByTestId('c-prefix')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('c-prefix')).toContainElement(screen.getByTestId('icon'));
	});

	it('keeps the prefix out of the accessible name of the toggle', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				title="Advanced"
				prefix={<svg aria-label="gear" />}
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('button', { name: 'Advanced' })).toBeInTheDocument();
	});
});
