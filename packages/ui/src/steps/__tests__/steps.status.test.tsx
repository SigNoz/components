import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Steps } from '../index.js';
import { ariaCurrentStep, PLAIN, statusesOf } from './steps.test-utils.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Steps status', () => {
	it.each([
		[1, ['current', 'waiting', 'waiting']],
		[2, ['done', 'current', 'waiting']],
		[3, ['done', 'done', 'current']],
	])('derives the status of every step from current %i', (current, statuses) => {
		render(<Steps current={current} items={PLAIN} testId="steps" />);

		expect(statusesOf('steps')).toEqual(statuses);
		expect(screen.getByTestId('steps')).toHaveAttribute('data-current', String(current));
		expect(ariaCurrentStep('steps')).toBe(current);
	});

	it('marks every step done when current is above the count of steps', () => {
		render(<Steps current={4} items={PLAIN} testId="steps" />);

		expect(statusesOf('steps')).toEqual(['done', 'done', 'done']);
		expect(ariaCurrentStep('steps')).toBeNull();
		expect(document.querySelector('[aria-current]')).toBeNull();
		expect(warn).not.toHaveBeenCalled();
	});

	it('marks every step done for a current far above the count', () => {
		render(<Steps current={99} items={PLAIN} testId="steps" />);

		expect(statusesOf('steps')).toEqual(['done', 'done', 'done']);
		expect(ariaCurrentStep('steps')).toBeNull();
	});

	it('keeps the position of a step against current, one step at a time', () => {
		const { rerender } = render(<Steps current={1} items={PLAIN} testId="steps" />);

		rerender(<Steps current={2} items={PLAIN} testId="steps" />);
		expect(statusesOf('steps')).toEqual(['done', 'current', 'waiting']);

		rerender(<Steps current={3} items={PLAIN} testId="steps" />);
		expect(statusesOf('steps')).toEqual(['done', 'done', 'current']);

		rerender(<Steps current={2} items={PLAIN} testId="steps" />);
		expect(statusesOf('steps')).toEqual(['done', 'current', 'waiting']);
	});

	it('has one step current, and it is the only one in aria-current', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		expect(document.querySelectorAll('[data-status="current"]')).toHaveLength(1);
		expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
	});

	it('renders a single step', () => {
		render(<Steps current={1} items={[{ label: 'Only' }]} testId="steps" />);

		expect(statusesOf('steps')).toEqual(['current']);
	});

	it('does not react to a click on a step', async () => {
		const user = userEvent.setup();
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		await user.click(screen.getByTestId('steps-item-3'));
		await user.click(screen.getByTestId('steps-item-1-marker'));

		expect(statusesOf('steps')).toEqual(['done', 'current', 'waiting']);
		expect(screen.getByTestId('steps')).toHaveAttribute('data-current', '2');
	});
});

describe('Steps current that is not a step number', () => {
	it.each([
		['0', 0],
		['-1', -1],
		['2.5', 2.5],
		['0.5', 0.5],
		['NaN', Number.NaN],
		['-Infinity', Number.NEGATIVE_INFINITY],
		['Infinity', Number.POSITIVE_INFINITY],
	])('renders %s as step 1', (_name, current) => {
		render(<Steps current={current} items={PLAIN} testId="steps" />);

		expect(screen.getByTestId('steps')).toHaveAttribute('data-current', '1');
		expect(statusesOf('steps')).toEqual(['current', 'waiting', 'waiting']);
		expect(ariaCurrentStep('steps')).toBe(1);
	});

	it.each([
		['0', 0],
		['-1', -1],
		['2.5', 2.5],
		['NaN', Number.NaN],
		['Infinity', Number.POSITIVE_INFINITY],
	])('warns once in the console for %s', (_name, current) => {
		render(<Steps current={current} items={PLAIN} />);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain('current');
		expect(warn.mock.calls[0]?.[0]).toContain(String(current));
	});

	it.each([1, 2, 3, 4, 10])('does not warn for the valid current %i', (current) => {
		render(<Steps current={current} items={PLAIN} />);

		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn again when the component renders again with the same current', () => {
		const { rerender } = render(<Steps current={0} items={PLAIN} />);

		rerender(<Steps current={0} items={PLAIN} testId="steps" />);
		rerender(<Steps current={0} items={[{ label: 'Other' }]} />);

		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('does not warn while there are no steps to show, and warns once they arrive', () => {
		const { rerender } = render(<Steps current={0} items={[]} />);

		expect(warn).not.toHaveBeenCalled();

		rerender(<Steps current={0} items={PLAIN} />);

		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('warns again for a different invalid current', () => {
		const { rerender } = render(<Steps current={0} items={PLAIN} />);

		rerender(<Steps current={-3} items={PLAIN} />);

		expect(warn).toHaveBeenCalledTimes(2);
		expect(warn.mock.calls[1]?.[0]).toContain('-3');
	});

	it('stops warning once current is valid again, and draws the real current', () => {
		const { rerender } = render(<Steps current={0} items={PLAIN} testId="steps" />);
		expect(warn).toHaveBeenCalledTimes(1);

		rerender(<Steps current={3} items={PLAIN} testId="steps" />);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(statusesOf('steps')).toEqual(['done', 'done', 'current']);
	});
});
