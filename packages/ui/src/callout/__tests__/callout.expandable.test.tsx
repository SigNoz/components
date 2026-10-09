import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Callout } from '../callout.js';
import { CALLOUT_EMPTY_DESCRIPTION, CALLOUT_EMPTY_TITLE } from '../constants.js';

const icon = <svg />;

function setup(props: { defaultExpanded: boolean; title?: string; children?: React.ReactNode }) {
	return render(
		<Callout.Expandable
			color="primary"
			size="sm"
			icon={icon}
			testId="c"
			title="What is it?"
			{...props}
		>
			{'children' in props ? props.children : 'The answer'}
		</Callout.Expandable>,
	);
}

describe('Callout.Expandable', () => {
	it('shows the title and the description when expanded', () => {
		setup({ defaultExpanded: true });

		expect(screen.getByTestId('c-title')).toHaveTextContent('What is it?');
		expect(screen.getByTestId('c-description')).toBeVisible();
		expect(screen.getByTestId('c')).toHaveAttribute('data-open');
	});

	it('hides the description when it starts collapsed, but keeps the title', () => {
		setup({ defaultExpanded: false });

		expect(screen.getByTestId('c-description')).not.toBeVisible();
		expect(screen.getByTestId('c-title')).toBeVisible();
		expect(screen.getByTestId('c')).toHaveAttribute('data-closed');
		expect(screen.getByTestId('c')).toHaveAttribute('data-has-title');
	});

	it('keeps the collapsed description findable, and expands when find in page reaches it', () => {
		setup({ defaultExpanded: false });

		const description = screen.getByTestId('c-description');
		expect(description).toHaveAttribute('hidden', 'until-found');

		act(() => {
			description.dispatchEvent(new Event('beforematch'));
		});

		expect(description).toBeVisible();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
	});

	it('takes no room for the collapsed description', () => {
		setup({ defaultExpanded: false });
		const callout = screen.getByTestId('c');
		// No tokens load here, so the gap the description would add below the title row is set by hand.
		callout.style.setProperty('--callout-content-gap', '12px');
		const collapsedHeight = callout.getBoundingClientRect().height;

		screen.getByTestId('c-description').style.display = 'none';

		expect(callout.getBoundingClientRect().height).toBe(collapsedHeight);
	});

	it('leaves the whole title row to the toggle while collapsed', () => {
		setup({ defaultExpanded: false });
		// No tokens load here, so the focus padding of the description is set by hand. Kept while
		// collapsed, it would make a box over the corner of the title row.
		screen.getByTestId('c').style.setProperty('--callout-description-focus-padding', '4px');
		const toggle = screen.getByTestId('c-toggle');
		const { left, top } = toggle.getBoundingClientRect();

		expect(toggle).toContainElement(document.elementFromPoint(left + 1, top + 1) as HTMLElement);
	});

	it('turns the chevron up while expanded', async () => {
		const user = userEvent.setup();
		setup({ defaultExpanded: false });
		const chevron = screen.getByTestId('chevron-down');

		expect(getComputedStyle(chevron).transform).toBe('none');
		await user.click(screen.getByTestId('c-toggle'));
		expect(getComputedStyle(chevron).transform).not.toBe('none');
	});

	it('toggles from anywhere on the title row', async () => {
		const user = userEvent.setup();
		setup({ defaultExpanded: true });

		await user.click(screen.getByTestId('c-title'));
		expect(screen.getByTestId('c-description')).not.toBeVisible();

		await user.click(screen.getByTestId('c-toggle'));
		expect(screen.getByTestId('c-description')).toBeVisible();
	});

	it('does not toggle from the description', async () => {
		const user = userEvent.setup();
		setup({ defaultExpanded: true });

		await user.click(screen.getByTestId('c-description'));
		expect(screen.getByTestId('c-description')).toBeVisible();
	});

	it('toggles with the keyboard', async () => {
		const user = userEvent.setup();
		setup({ defaultExpanded: true });

		await user.tab();
		expect(screen.getByTestId('c-toggle')).toHaveFocus();
		await user.keyboard('{Enter}');
		expect(screen.getByTestId('c-description')).not.toBeVisible();
		await user.keyboard(' ');
		expect(screen.getByTestId('c-description')).toBeVisible();
	});

	it('wires aria-expanded, aria-controls and the accessible name', () => {
		setup({ defaultExpanded: true });

		const toggle = screen.getByRole('button', { name: 'What is it?' });
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(toggle).toHaveAttribute('aria-controls', screen.getByTestId('c-description').id);
	});

	it('renders placeholders instead of hiding when empty', () => {
		render(
			<Callout.Expandable color="primary" size="sm" icon={icon} testId="c" title="" defaultExpanded>
				{''}
			</Callout.Expandable>,
		);

		expect(screen.getByTestId('c-title')).toHaveTextContent(CALLOUT_EMPTY_TITLE);
		expect(screen.getByTestId('c-description')).toHaveTextContent(CALLOUT_EMPTY_DESCRIPTION);
	});

	it('keeps the full title in the DOM', () => {
		const title = 'A very long title '.repeat(10);
		setup({ defaultExpanded: true, title });

		expect(screen.getByTestId('c-title')).toHaveTextContent(title.trim());
	});
});
