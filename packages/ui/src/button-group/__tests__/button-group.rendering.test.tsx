import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import { BASE, ITEMS, noop, silenceConsoleError } from './button-group.test-utils.js';

afterEach(() => vi.restoreAllMocks());

describe('ButtonGroup rendering', () => {
	it('renders a div with role=group and one button per item', () => {
		render(<ButtonGroup {...BASE} items={ITEMS} testId="range" />);

		const group = screen.getByRole('group');
		expect(group.tagName).toBe('DIV');
		expect(group).toBe(screen.getByTestId('range'));
		expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
			'Day',
			'Week',
			'Month',
		]);
	});

	it.each([
		['a text label', 'Week'],
		['a JSX label', <span key="label">Week</span>],
	])('holds %s once, so text queries find the member', (_, label) => {
		render(<ButtonGroup {...BASE} items={[{ value: 'week', label, onClick: noop }]} />);

		expect(screen.getAllByText('Week')).toHaveLength(1);
		expect(screen.getByText('Week').closest('button')).toBe(
			screen.getByRole('button', { name: 'Week' }),
		);
	});

	it('mirrors its props on the group element', () => {
		render(<ButtonGroup {...BASE} size="sm" textOverflow="hidden" items={ITEMS} testId="range" />);

		const group = screen.getByTestId('range');
		expect(group).toHaveAttribute('data-slot', 'button-group');
		expect(group).toHaveAttribute('data-variant', 'outlined');
		expect(group).toHaveAttribute('data-color', 'secondary');
		expect(group).toHaveAttribute('data-size', 'sm');
		expect(group).toHaveAttribute('data-text-overflow', 'hidden');
	});

	it('names every member after the group and its value', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					...ITEMS.slice(0, 2),
					{ value: 'month', label: 'Month', onClick: noop, testId: 'custom' },
				]}
				testId="range"
			/>,
		);

		expect(screen.getByTestId('range-item-day')).toHaveTextContent('Day');
		expect(screen.getByTestId('range-item-week')).toHaveTextContent('Week');
		expect(screen.getByTestId('custom')).toHaveTextContent('Month');
	});

	it('marks where each member sits, so only the outer corners round', () => {
		render(<ButtonGroup {...BASE} items={ITEMS} />);

		expect(
			screen.getAllByRole('button').map((button) => button.getAttribute('data-position')),
		).toEqual(['start', 'middle', 'end']);
	});

	it('marks a lone member as the only one', () => {
		render(<ButtonGroup {...BASE} items={ITEMS.slice(0, 1)} />);

		expect(screen.getByRole('button')).toHaveAttribute('data-position', 'only');
	});

	it('renders an icon member with its accessible name', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'next',
						icon: <svg data-testid="icon" />,
						ariaLabel: 'Next page',
						onClick: noop,
					},
				]}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Next page' });
		expect(button).toHaveAttribute('data-icon', 'true');
		expect(button).toContainElement(screen.getByTestId('icon'));
	});

	it('renders a link member as the element it is given', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
					{ value: 'docs', label: 'Docs', render: <a href="/docs" /> },
				]}
			/>,
		);

		expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
	});

	it('drops the rendered element own children, so the label and slots stay', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'docs',
						label: 'Docs',
						prefix: <svg data-testid="prefix" />,
						render: (
							<a href="/docs" data-owner="nav">
								Ignored
							</a>
						),
					},
				]}
			/>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveAttribute('data-owner', 'nav');
		expect(link).toContainElement(screen.getByTestId('prefix'));
		expect(link.querySelector('[data-slot="button-group-item-label"]')).toHaveTextContent('Docs');
		expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
	});

	it.each([
		['an empty string', ''],
		['true', true],
	])('falls back to <No label> and reports it when the label is %s', (_, label) => {
		const error = silenceConsoleError();

		render(<ButtonGroup {...BASE} items={[{ value: 'empty', label, onClick: noop }]} />);

		expect(screen.getByRole('button', { name: '<No label>' })).toBeInTheDocument();
		expect(error).toHaveBeenCalledWith(expect.stringContaining('"empty" renders no label'));
	});

	it('forwards data-* and aria-* to the group element', () => {
		render(<ButtonGroup {...BASE} items={ITEMS} data-owner="alerts" aria-label="Time range" />);

		const group = screen.getByRole('group', { name: 'Time range' });
		expect(group).toHaveAttribute('data-owner', 'alerts');
	});

	it('writes width and maxWidth as custom properties', () => {
		render(<ButtonGroup {...BASE} items={ITEMS} width={400} maxWidth="50%" testId="range" />);

		const group = screen.getByTestId('range');
		expect(group.style.getPropertyValue('--button-group-internal-width')).toBe('400px');
		expect(group.style.getPropertyValue('--button-group-internal-max-width')).toBe('50%');
	});

	it('forwards its ref to the group element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<ButtonGroup {...BASE} items={ITEMS} ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('group'));
	});
});
