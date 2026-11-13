import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Card } from '../card.js';
import { slotsOf } from './card.test-utils.js';

afterEach(() => {
	vi.restoreAllMocks();
});

function renderFull() {
	return render(
		<Card
			testId="card"
			title="Top services"
			titlePrefix={<svg data-testid="icon" width={40} height={40} />}
			titleSuffix={<span>Beta</span>}
			description="The services with the most requests."
			headerSuffix={<button type="button">Settings</button>}
			footerPrefix={<a href="/services">View all</a>}
			footerSuffix={<button type="button">Save</button>}
		>
			<p>Body</p>
		</Card>,
	);
}

describe('Card slots', () => {
	it('renders the header, the body and the footer in that order', () => {
		renderFull();

		expect(slotsOf(screen.getByTestId('card'))).toEqual([
			'card-header',
			'card-body',
			'card-footer',
		]);
	});

	it('renders each part of the header in its slot', () => {
		renderFull();

		const header = screen.getByTestId('card-header');

		expect(within(header).getByTestId('card-title-prefix')).toHaveAttribute(
			'data-slot',
			'card-title-prefix',
		);
		expect(within(header).getByTestId('card-title')).toHaveTextContent('Top services');
		expect(within(header).getByTestId('card-title')).toHaveAttribute('data-slot', 'card-title');
		expect(within(header).getByTestId('card-title-suffix')).toHaveTextContent('Beta');
		expect(within(header).getByTestId('card-description')).toHaveTextContent(
			'The services with the most requests.',
		);
		expect(within(header).getByTestId('card-header-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Settings' }),
		);
	});

	it('renders the footer prefix before the footer suffix', () => {
		renderFull();

		const footer = screen.getByTestId('card-footer');

		expect(slotsOf(footer)).toEqual(['card-footer-prefix', 'card-footer-suffix']);
		expect(screen.getByTestId('card-footer-prefix')).toContainElement(
			screen.getByRole('link', { name: 'View all' }),
		);
		expect(screen.getByTestId('card-footer-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Save' }),
		);
	});

	it('renders the children in the body', () => {
		renderFull();

		expect(screen.getByTestId('card-body')).toHaveAttribute('data-slot', 'card-body');
		expect(screen.getByTestId('card-body')).toHaveTextContent('Body');
	});

	it('puts the title before the description and the title line before the suffix', () => {
		renderFull();

		const header = screen.getByTestId('card-header');
		const title = screen.getByTestId('card-title');
		const description = screen.getByTestId('card-description');
		const suffix = screen.getByTestId('card-header-suffix');

		expect(
			title.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			description.compareDocumentPosition(suffix) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(header.lastElementChild).toBe(suffix);
	});

	it('renders no part that was not asked for', () => {
		render(<Card testId="card" title="Title" />);

		const root = screen.getByTestId('card');

		expect(slotsOf(root)).toEqual(['card-header']);
		expect(root.querySelector('[data-slot="card-title-prefix"]')).toBeNull();
		expect(root.querySelector('[data-slot="card-title-suffix"]')).toBeNull();
		expect(root.querySelector('[data-slot="card-description"]')).toBeNull();
		expect(root.querySelector('[data-slot="card-header-suffix"]')).toBeNull();
	});

	it('renders the footer when only the prefix is set', () => {
		render(
			<Card testId="card" footerPrefix="Hint">
				Body
			</Card>,
		);

		expect(slotsOf(screen.getByTestId('card-footer'))).toEqual(['card-footer-prefix']);
	});

	it('renders the footer when only the suffix is set', () => {
		render(
			<Card testId="card" footerSuffix="Save">
				Body
			</Card>,
		);

		expect(slotsOf(screen.getByTestId('card-footer'))).toEqual(['card-footer-suffix']);
	});

	it('renders no footer when both parts are empty', () => {
		render(
			<Card testId="card" footerPrefix={null} footerSuffix="">
				Body
			</Card>,
		);

		expect(screen.queryByTestId('card-footer')).toBeNull();
	});

	it('renders no body for a card with a header and no children', () => {
		render(<Card testId="card" title="Setting" description="What it does" />);

		expect(screen.queryByTestId('card-body')).toBeNull();
	});

	it.each([
		['a title', { title: 'Title' }],
		['a title suffix', { titleSuffix: <span>Beta</span>, title: 'Title' }],
		['a description', { description: 'Description', title: 'Title' }],
		['a header suffix', { headerSuffix: <button type="button">Go</button>, title: 'Title' }],
	])('renders the header for %s', (_name, props) => {
		render(<Card testId="card" {...props} />);

		expect(screen.getByTestId('card-header')).toBeInTheDocument();
	});

	it.each([
		['a title suffix', { titleSuffix: <span>Beta</span> }],
		['a description', { description: 'Description' }],
		['a header suffix', { headerSuffix: <button type="button">Go</button> }],
	])('renders the header for %s alone, with <No title> for the name', (_name, props) => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Card testId="card" {...props} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('<No title>');
	});

	it('renders no header for children alone', () => {
		render(<Card testId="card">Body</Card>);

		expect(screen.queryByTestId('card-header')).toBeNull();
	});

	it('renders no header for a title prefix alone', () => {
		render(
			<Card testId="card" titlePrefix={<svg />}>
				Body
			</Card>,
		);

		expect(screen.queryByTestId('card-header')).toBeNull();
	});
});

describe('Card test ids', () => {
	it('names every part after the root', () => {
		renderFull();

		for (const part of [
			'header',
			'title-prefix',
			'title',
			'title-suffix',
			'description',
			'header-suffix',
			'body',
			'footer',
			'footer-prefix',
			'footer-suffix',
		]) {
			expect(screen.getByTestId(`card-${part}`)).toBeInTheDocument();
		}
	});

	it('gives no part a data-testid without testId', () => {
		const { container } = render(
			<Card
				title="Title"
				titlePrefix={<svg />}
				titleSuffix="Beta"
				description="Description"
				headerSuffix="Action"
				footerPrefix="Hint"
				footerSuffix="Save"
			>
				Body
			</Card>,
		);

		expect(container.querySelectorAll('[data-testid]')).toHaveLength(0);
		expect(container.querySelectorAll('[data-slot]')).toHaveLength(11);
	});
});

describe('Card root', () => {
	it('is a div with no role', () => {
		render(
			<Card testId="card" title="Title">
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root.tagName).toBe('DIV');
		expect(root).not.toHaveAttribute('role');
		expect(root).not.toHaveAttribute('tabindex');
		expect(root).toHaveAttribute('data-slot', 'card');
	});

	it('forwards id, every aria and any data attribute to the root', () => {
		render(
			<Card testId="card" id="panel" aria-label="Panel" aria-live="polite" data-panel="top">
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root).toHaveAttribute('id', 'panel');
		expect(root).toHaveAttribute('aria-label', 'Panel');
		expect(root).toHaveAttribute('aria-live', 'polite');
		expect(root).toHaveAttribute('data-panel', 'top');
	});

	it('keeps its own data attributes over the ones that are passed', () => {
		render(
			<Card testId="card" data-slot="other" data-text-overflow="other">
				Body
			</Card>,
		);

		expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
		expect(screen.getByTestId('card')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it('does not forward a className or a style that gets past the types', () => {
		const stray = {
			className: 'stray',
			style: { color: 'rgb(255, 0, 0)', width: '10px' },
		} as object;

		render(
			<Card testId="card" {...stray}>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root).not.toHaveClass('stray');
		expect(root.style.color).toBe('');
		expect(root.style.width).toBe('');
	});

	it('writes only custom properties in the inline style', () => {
		render(
			<Card
				testId="card"
				width={240}
				maxWidth="50%"
				height={200}
				minHeight={100}
				padding={4}
				gap={2}
				margin={6}
			>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		for (const name of Array.from(root.style)) {
			expect(name.startsWith('--card-internal-')).toBe(true);
		}
	});

	it('mirrors textOverflow, headerDivider and loading as data attributes', () => {
		const { rerender } = render(
			<Card testId="card" title="Title">
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root).toHaveAttribute('data-text-overflow', 'ellipsis');
		expect(root).not.toHaveAttribute('data-header-divider');
		expect(root).not.toHaveAttribute('data-loading');

		rerender(
			<Card testId="card" title="Title" textOverflow="wrap" headerDivider loading>
				Body
			</Card>,
		);

		expect(root).toHaveAttribute('data-text-overflow', 'wrap');
		expect(root).toHaveAttribute('data-header-divider');
		expect(root).toHaveAttribute('data-loading');
	});
});

describe('Card title prefix', () => {
	it('hides the icon from screen readers', () => {
		renderFull();

		expect(screen.getByTestId('card-title-prefix')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('card-title-prefix')).toContainElement(screen.getByTestId('icon'));
	});

	it('leaves the icon element as it was passed', () => {
		renderFull();

		expect(screen.getByTestId('icon')).toHaveAttribute('width', '40');
	});
});
