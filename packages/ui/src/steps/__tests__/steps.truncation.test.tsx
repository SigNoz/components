import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	queryOpenTooltip,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Steps } from '../index.js';
import { LONG_DESCRIPTION, LONG_LABEL, ONBOARDING } from './steps.test-utils.js';

const LONG_ITEMS = [
	{ label: LONG_LABEL, description: LONG_DESCRIPTION },
	{ label: 'Configure', description: 'my-cluster' },
];

afterEach(resetLabelMeasurement);

describe('Steps label ellipsis', () => {
	beforeAll(() => mockLabelMeasurement('steps-label'));

	it('marks a label that is cut and makes it a tab stop', () => {
		truncate();

		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		const label = screen.getByTestId('steps-item-1-label');

		expect(label).toHaveAttribute('data-truncated', 'true');
		expect(label).toHaveAttribute('tabindex', '0');
		expect(label.tabIndex).toBe(0);
	});

	it('leaves a label that fits unmarked and out of the tab order', () => {
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		const label = screen.getByTestId('steps-item-1-label');

		expect(label).not.toHaveAttribute('data-truncated');
		expect(label).not.toHaveAttribute('tabindex');
		expect(label.tabIndex).toBe(-1);
	});

	it('marks every label that is cut, and no description', () => {
		truncate();

		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		expect(screen.getByTestId('steps-item-1-label')).toHaveAttribute('data-truncated', 'true');
		expect(screen.getByTestId('steps-item-2-label')).toHaveAttribute('data-truncated', 'true');
		expect(screen.getByTestId('steps-item-1-description')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('steps-item-1-description')).not.toHaveAttribute('tabindex');
	});

	it('shows the full label in a tooltip on hover while it is cut', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.hover(screen.getByTestId('steps-item-1-label'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL));
		expect(screen.getByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('opens no tooltip on hover while the label fits', async () => {
		const user = userEvent.setup();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.hover(screen.getByTestId('steps-item-1-label'));
		await new Promise((resolve) => setTimeout(resolve, 400));

		expect(queryOpenTooltip()).toBeNull();
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('opens the tooltip on keyboard focus, and Esc closes it', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.tab();

		expect(screen.getByTestId('steps-item-1-label')).toHaveFocus();
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL));

		await user.keyboard('{Escape}');

		await waitFor(() => expect(queryOpenTooltip()).toBeNull());
	});

	it('reaches the labels that are cut with Tab, in reading order, and skips the rest', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<>
				<button type="button">before</button>
				<Steps current={1} items={ONBOARDING} testId="steps" />
				<button type="button">after</button>
			</>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();
		for (const n of [1, 2, 3]) {
			await user.tab();
			expect(screen.getByTestId(`steps-item-${n}-label`), `step ${n}`).toHaveFocus();
		}
		await user.tab();
		expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
	});

	it('takes the tab stop away when the label stops being cut', async () => {
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);
		const label = screen.getByTestId('steps-item-1-label');
		expect(label).not.toHaveAttribute('data-truncated');

		resize(300, 100);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));
		expect(label).toHaveAttribute('tabindex', '0');

		resize(100, 100);
		await waitFor(() => expect(label).not.toHaveAttribute('data-truncated'));
		expect(label).not.toHaveAttribute('tabindex');
	});

	it('keeps the label mounted when it gets cut, so it never loses the focus', async () => {
		const user = userEvent.setup();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);
		const label = screen.getByTestId('steps-item-1-label');

		resize(300, 100);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));
		await user.tab();

		expect(screen.getByTestId('steps-item-1-label')).toBe(label);
		expect(label).toHaveFocus();
	});

	it('keeps the focus on a label that stops being cut, and drops its tab stop on blur', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Steps current={1} items={LONG_ITEMS} testId="steps" />
				<button type="button">after</button>
			</>,
		);
		const label = screen.getByTestId('steps-item-1-label');
		resize(300, 100);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));
		await user.tab();
		expect(label).toHaveFocus();

		resize(100, 100);
		await waitFor(() => expect(label).not.toHaveAttribute('data-truncated'));

		expect(label).toHaveFocus();
		expect(label).toHaveAttribute('tabindex', '0');

		await user.tab();

		expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
		expect(label).not.toHaveAttribute('tabindex');
		await user.tab({ shift: true });
		expect(label).not.toHaveFocus();
	});

	it('shows <No label> in the tooltip of a blank label that is cut', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={[{ label: '  ' }, { label: 'Two' }]} testId="steps" />);

		await user.hover(screen.getByTestId('steps-item-1-label'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent('<No label>'));
	});

	it('never marks the marker, the step or the connector', () => {
		truncate();
		render(<Steps current={2} items={LONG_ITEMS} testId="steps" />);

		for (const slot of ['steps', 'steps-item', 'steps-marker', 'steps-connector']) {
			for (const element of document.querySelectorAll(`[data-slot="${slot}"]`)) {
				expect(element, slot).not.toHaveAttribute('data-truncated');
				expect(element, slot).not.toHaveAttribute('tabindex');
			}
		}
	});

	it('writes data-truncated as true and removes it, never false', async () => {
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);
		const label = screen.getByTestId('steps-item-1-label');

		expect(label.getAttributeNames()).not.toContain('data-truncated');

		resize(300, 100);
		await waitFor(() => expect(label.getAttribute('data-truncated')).toBe('true'));

		resize(100, 100);
		await waitFor(() => expect(label.getAttributeNames()).not.toContain('data-truncated'));
	});
});

describe('Steps description ellipsis', () => {
	beforeAll(() => mockLabelMeasurement('steps-description'));

	it('marks a description that is cut and makes it a tab stop', () => {
		truncate();

		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		const description = screen.getByTestId('steps-item-1-description');

		expect(description).toHaveAttribute('data-truncated', 'true');
		expect(description).toHaveAttribute('tabindex', '0');
		expect(description.tabIndex).toBe(0);
	});

	it('leaves a description that fits unmarked and out of the tab order', () => {
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		const description = screen.getByTestId('steps-item-1-description');

		expect(description).not.toHaveAttribute('data-truncated');
		expect(description).not.toHaveAttribute('tabindex');
		expect(description.tabIndex).toBe(-1);
	});

	it('marks every description that is cut, and no label', () => {
		truncate();

		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		expect(screen.getByTestId('steps-item-1-description')).toHaveAttribute(
			'data-truncated',
			'true',
		);
		expect(screen.getByTestId('steps-item-2-description')).toHaveAttribute(
			'data-truncated',
			'true',
		);
		expect(screen.getByTestId('steps-item-1-label')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('steps-item-1-label')).not.toHaveAttribute('tabindex');
	});

	it('shows the full description in a tooltip on hover while it is cut', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.hover(screen.getByTestId('steps-item-1-description'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_DESCRIPTION));
		expect(screen.getByRole('tooltip')).toHaveTextContent(LONG_DESCRIPTION);
	});

	it('opens no tooltip on hover while the description fits', async () => {
		const user = userEvent.setup();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.hover(screen.getByTestId('steps-item-1-description'));
		await new Promise((resolve) => setTimeout(resolve, 400));

		expect(queryOpenTooltip()).toBeNull();
	});

	it('opens the tooltip on keyboard focus, and Esc closes it', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);

		await user.tab();

		expect(screen.getByTestId('steps-item-1-description')).toHaveFocus();
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_DESCRIPTION));

		await user.keyboard('{Escape}');

		await waitFor(() => expect(queryOpenTooltip()).toBeNull());
	});

	it('takes the tab stop away when the description stops being cut', async () => {
		render(<Steps current={1} items={LONG_ITEMS} testId="steps" />);
		const description = screen.getByTestId('steps-item-1-description');

		resize(300, 100);
		await waitFor(() => expect(description).toHaveAttribute('data-truncated', 'true'));

		resize(100, 100);
		await waitFor(() => expect(description).not.toHaveAttribute('data-truncated'));
		expect(description).not.toHaveAttribute('tabindex');
	});

	it('gives the reserved line no tab stop and no tooltip', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		const placeholder = screen
			.getByTestId('steps-item-3')
			.querySelector('[aria-hidden="true"]:not([data-slot])');

		expect(placeholder).not.toBeNull();
		expect(placeholder).not.toHaveAttribute('tabindex');
		expect(placeholder).not.toHaveAttribute('data-truncated');
		await user.hover(placeholder as Element);
		await new Promise((resolve) => setTimeout(resolve, 400));
		expect(queryOpenTooltip()).toBeNull();
	});
});
