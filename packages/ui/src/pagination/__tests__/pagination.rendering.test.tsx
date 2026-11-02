import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, slotsOf } from './pagination.test-utils.js';

describe('Pagination rendering', () => {
	it('renders a nav landmark named Pagination', () => {
		render(<Pagination total={100} />);

		expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
	});

	it('lets the consumer name the landmark', () => {
		render(<Pagination total={100} aria-label="Logs pagination" />);

		expect(screen.getByRole('navigation', { name: 'Logs pagination' })).toBeInTheDocument();
		expect(screen.queryByRole('navigation', { name: 'Pagination' })).toBeNull();
	});

	it('forwards the id, aria-* and data-* props to the nav', () => {
		render(<Pagination total={100} id="logs" aria-describedby="hint" data-foo="bar" testId="p" />);

		const nav = screen.getByTestId('p');

		expect(nav.tagName).toBe('NAV');
		expect(nav).toHaveAttribute('id', 'logs');
		expect(nav).toHaveAttribute('aria-describedby', 'hint');
		expect(nav).toHaveAttribute('data-foo', 'bar');
	});

	it('keeps data-slot on the nav whatever data-* the consumer passes', () => {
		render(<Pagination total={100} data-slot="other" testId="p" />);

		expect(screen.getByTestId('p')).toHaveAttribute('data-slot', 'pagination');
	});

	it('mirrors the layout props as data attributes, with the defaults', () => {
		render(<Pagination total={100} testId="p" />);

		const nav = screen.getByTestId('p');

		expect(nav).toHaveAttribute('data-slot', 'pagination');
		expect(nav).toHaveAttribute('data-variant', 'numbered');
		expect(nav).toHaveAttribute('data-align', 'end');
		expect(nav).not.toHaveAttribute('data-disabled');
	});

	it('mirrors variant, align and disabled', () => {
		render(<Pagination total={100} testId="p" variant="compact" align="center" disabled />);

		const nav = screen.getByTestId('p');

		expect(nav).toHaveAttribute('data-variant', 'compact');
		expect(nav).toHaveAttribute('data-align', 'center');
		expect(nav).toHaveAttribute('data-disabled', 'true');
	});

	it('writes data-testid only when testId is set', () => {
		const { container } = render(<Pagination total={200} defaultCurrent={10} pageSizeOptions />);

		expect(container.querySelectorAll('[data-testid]:not(svg)')).toHaveLength(0);
	});

	it('derives a test id for every part', () => {
		render(<Pagination total={200} defaultCurrent={10} pageSizeOptions testId="p" />);

		for (const id of [
			'p',
			'p-total',
			'p-previous',
			'p-page-1',
			'p-separator-start',
			'p-page-9',
			'p-page-10',
			'p-page-11',
			'p-separator-end',
			'p-page-20',
			'p-next',
			'p-page-size',
		]) {
			expect(screen.getByTestId(id), id).toBeInTheDocument();
		}
	});

	it('gives every part its data-slot', () => {
		render(<Pagination total={200} defaultCurrent={10} pageSizeOptions testId="p" />);

		expect(screen.getByTestId('p-total')).toHaveAttribute('data-slot', 'pagination-total');
		expect(screen.getByTestId('p-previous')).toHaveAttribute('data-slot', 'pagination-previous');
		expect(screen.getByTestId('p-page-9')).toHaveAttribute('data-slot', 'pagination-page');
		expect(screen.getByTestId('p-separator-start')).toHaveAttribute(
			'data-slot',
			'pagination-separator',
		);
		expect(screen.getByTestId('p-next')).toHaveAttribute('data-slot', 'pagination-next');
		expect(screen.getByTestId('p-page-size')).toHaveAttribute('data-slot', 'pagination-page-size');
	});

	it('names every page button Page N and marks the current one', () => {
		render(<Pagination total={200} defaultCurrent={10} testId="p" />);

		expect(screen.getByRole('button', { name: 'Page 9' })).toHaveTextContent('9');
		expect(screen.getByRole('button', { name: 'Page 20' })).toHaveTextContent('20');

		const current = screen.getByRole('button', { name: 'Page 10' });

		expect(current).toHaveAttribute('aria-current', 'page');
		expect(current).toHaveAttribute('data-current');
		expect(screen.getByRole('button', { name: 'Page 9' })).not.toHaveAttribute('aria-current');
		expect(screen.getByRole('button', { name: 'Page 9' })).not.toHaveAttribute('data-current');
		expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
	});

	it('names the arrows Previous page and Next page', () => {
		render(<Pagination total={200} defaultCurrent={10} />);

		expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
	});

	it('hides the separators from assistive tech and gives them no text', () => {
		render(<Pagination total={200} defaultCurrent={10} testId="p" />);

		for (const id of ['p-separator-start', 'p-separator-end']) {
			expect(screen.getByTestId(id)).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByTestId(id)).toBeEmptyDOMElement();
		}
	});

	it('renders the buttons as type button, so a form around it is not submitted', () => {
		render(<Pagination total={200} defaultCurrent={10} />);

		for (const button of screen.getAllByRole('button')) {
			expect(button).toHaveAttribute('type', 'button');
		}
	});

	it('renders the position label as a polite live region', () => {
		render(<Pagination total={95} testId="p" />);

		const label = screen.getByTestId('p-total');

		expect(label).toHaveAttribute('aria-live', 'polite');
		expect(positionOf('p-total')).toBe('1 \u2014 10 of 95');
	});

	it('renders the page list the spec lists for 20 pages', () => {
		const expected: Array<[number, string]> = [
			[1, '1 2 3 4 5 - 20'],
			[2, '1 2 3 4 5 - 20'],
			[3, '1 2 3 4 5 - 20'],
			[4, '1 2 3 4 5 - 20'],
			[5, '1 - 4 5 6 - 20'],
			[10, '1 - 9 10 11 - 20'],
			[16, '1 - 15 16 17 - 20'],
			[17, '1 - 16 17 18 19 20'],
			[18, '1 - 16 17 18 19 20'],
			[19, '1 - 16 17 18 19 20'],
			[20, '1 - 16 17 18 19 20'],
		];

		for (const [current, slots] of expected) {
			const { unmount } = render(<Pagination total={200} current={current} testId="p" />);

			expect(slotsOf('p').join(' '), `current ${current}`).toBe(slots);
			unmount();
		}
	});

	it.each([1, 2, 3, 4, 5, 6, 7])('renders every page and no separator for %i pages', (count) => {
		render(<Pagination total={count * 10} testId="p" />);

		expect(slotsOf('p')).toEqual(Array.from({ length: count }, (_, index) => String(index + 1)));
	});
});
