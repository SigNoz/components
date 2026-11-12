import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Steps } from '../index.js';
import { ONBOARDING, PLAIN, stepElements } from './steps.test-utils.js';

describe('Steps accessibility', () => {
	it('renders an ol with one li per step', () => {
		render(<Steps current={2} items={ONBOARDING} />);

		const list = screen.getByRole('list');

		expect(list.tagName).toBe('OL');
		expect(within(list).getAllByRole('listitem')).toHaveLength(3);
		expect(Array.from(list.children).map((child) => child.tagName)).toEqual(['LI', 'LI', 'LI']);
	});

	it('gives the list no name of its own, and lets the consumer name it', () => {
		const { rerender } = render(<Steps current={1} items={PLAIN} />);

		expect(screen.getByRole('list')).not.toHaveAttribute('aria-label');
		expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');

		rerender(<Steps current={1} items={PLAIN} aria-label="Setup progress" />);

		expect(screen.getByRole('list', { name: 'Setup progress' })).toBeInTheDocument();
	});

	it('tells two lists apart by their aria-label', () => {
		render(
			<>
				<Steps current={1} items={PLAIN} aria-label="Setup progress" />
				<Steps current={2} items={PLAIN} aria-label="Billing progress" />
			</>,
		);

		expect(screen.getByRole('list', { name: 'Setup progress' })).toBeInTheDocument();
		expect(screen.getByRole('list', { name: 'Billing progress' })).toBeInTheDocument();
	});

	it('puts aria-current="step" on the current step only', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const [first, second, third] = stepElements('steps');

		expect(first).not.toHaveAttribute('aria-current');
		expect(second).toHaveAttribute('aria-current', 'step');
		expect(third).not.toHaveAttribute('aria-current');
		expect(screen.getByRole('listitem', { current: 'step' })).toBe(second);
	});

	it('moves aria-current with current', () => {
		const { rerender } = render(<Steps current={1} items={PLAIN} testId="steps" />);
		expect(stepElements('steps')[0]).toHaveAttribute('aria-current', 'step');

		rerender(<Steps current={3} items={PLAIN} testId="steps" />);

		expect(stepElements('steps')[0]).not.toHaveAttribute('aria-current');
		expect(stepElements('steps')[2]).toHaveAttribute('aria-current', 'step');
	});

	it('reads Completed after the label of a done step only', () => {
		render(<Steps current={3} items={PLAIN} testId="steps" />);

		const [first, second, third] = stepElements('steps');

		expect(first).toHaveTextContent(/^One\s*Completed$/);
		expect(second).toHaveTextContent(/^Two\s*Completed$/);
		expect(third).not.toHaveTextContent('Completed');
		expect(screen.getAllByText('Completed')).toHaveLength(2);
	});

	it('does not read Completed on the current step nor on the waiting ones', () => {
		render(<Steps current={1} items={PLAIN} />);

		expect(screen.queryByText('Completed')).toBeNull();
	});

	it('reads Completed on every step when current is above the count', () => {
		render(<Steps current={4} items={PLAIN} />);

		expect(screen.getAllByText('Completed')).toHaveLength(3);
	});

	it('places Completed after the label and before the description', () => {
		render(<Steps current={2} items={ONBOARDING} testId="steps" />);

		const first = screen.getByTestId('steps-item-1');
		const label = screen.getByTestId('steps-item-1-label');
		const completed = within(first).getByText('Completed');
		const description = screen.getByTestId('steps-item-1-description');

		expect(
			label.compareDocumentPosition(completed) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			completed.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('reads the description after the label', () => {
		render(<Steps current={3} items={ONBOARDING} testId="steps" />);

		const second = screen.getByTestId('steps-item-2');
		const label = screen.getByTestId('steps-item-2-label');
		const description = screen.getByTestId('steps-item-2-description');

		expect(
			label.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(second).toHaveTextContent(/Configure\s*Completed\s*my-cluster/);
	});

	it('keeps the Completed word in the accessibility tree, not display none', () => {
		render(<Steps current={2} items={PLAIN} />);

		const completed = screen.getByText('Completed');
		const style = getComputedStyle(completed);

		expect(completed).toBeInTheDocument();
		expect(style.display).not.toBe('none');
		expect(style.visibility).not.toBe('hidden');
		expect(completed).not.toHaveAttribute('aria-hidden');
	});

	it('hides every marker from assistive technology', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		for (const n of [1, 2, 3]) {
			expect(screen.getByTestId(`steps-item-${n}-marker`)).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('hides the connectors from assistive technology', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const connectors = document.querySelectorAll('[data-slot="steps-connector"]');

		expect(connectors).toHaveLength(2);
		for (const connector of connectors) {
			expect(connector).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('keeps every number and the done mark inside an aria-hidden marker', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		expect(screen.queryByText('1')).toBeNull();
		for (const number of ['2', '3']) {
			expect(screen.getByText(number).closest('[aria-hidden="true"]')).toBe(
				screen.getByTestId(`steps-item-${number}-marker`),
			);
		}
		expect(screen.getByTestId('steps-item-1-marker').querySelector('svg')).not.toBeNull();
	});

	it('is not a live region', () => {
		const { container } = render(<Steps current={2} items={ONBOARDING} />);

		expect(container.querySelector('[aria-live], [role="status"], [role="alert"]')).toBeNull();
	});

	it('exposes no interactive role', () => {
		render(<Steps current={2} items={ONBOARDING} />);

		for (const role of ['button', 'link', 'tab', 'menuitem', 'checkbox', 'radio']) {
			expect(screen.queryAllByRole(role), role).toHaveLength(0);
		}
	});
});

describe('Steps keyboard', () => {
	it('has no tab stop while no text is cut', async () => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">before</button>
				<Steps current={2} items={ONBOARDING} />
				<button type="button">after</button>
			</>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
	});

	it('is not focusable, nor any of its steps or markers', () => {
		const { container } = render(<Steps current={2} items={ONBOARDING} testId="steps" />);

		expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
		for (const element of container.querySelectorAll<HTMLElement>('*')) {
			element.focus();
			expect(document.activeElement, element.outerHTML).toBe(document.body);
		}
	});
});
