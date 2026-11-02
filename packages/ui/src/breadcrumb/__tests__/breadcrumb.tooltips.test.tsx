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
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import { noop } from './breadcrumb.test-utils.js';

const LONG_TITLE = 'checkout-service-production-east-1';

/** Two crumbs, so the trail has nothing to collapse and only the labels are measured. */
const LONG_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', href: '/services' },
	{ title: LONG_TITLE },
];

beforeAll(() => mockLabelMeasurement('breadcrumb-item-label'));
afterEach(resetLabelMeasurement);

function contentOf(name: string): HTMLElement {
	const content = screen
		.getByText(name)
		.closest<HTMLElement>('[data-slot="breadcrumb-item-content"]');

	if (content === null) {
		throw new Error(`no crumb is named ${name}`);
	}

	return content;
}

describe('Breadcrumb tooltips', () => {
	it('shows the full title of a crumb whose label is cut, and marks it', async () => {
		const user = userEvent.setup();
		truncate();

		render(<Breadcrumb items={LONG_TRAIL} />);

		const content = contentOf(LONG_TITLE);
		expect(content).toHaveAttribute('data-truncated', 'true');

		await user.hover(content);

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_TITLE));
		expect(screen.getByRole('tooltip')).toHaveTextContent(LONG_TITLE);
	});

	it('shows the tooltip of a link crumb, a button crumb and a text crumb alike', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<Breadcrumb
				items={[
					{ title: 'A link crumb', href: '/a' },
					{ title: 'A button crumb', onClick: noop },
				]}
			/>,
		);

		for (const name of ['A link crumb', 'A button crumb']) {
			const content = contentOf(name);
			expect(content).toHaveAttribute('data-truncated', 'true');

			await user.hover(content);
			await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(name));
			await user.unhover(content);
			await waitFor(() => expect(queryOpenTooltip()).toBeNull());
		}
	});

	it('leaves a crumb whose label fits unmarked and opens no tooltip', async () => {
		const user = userEvent.setup();

		render(<Breadcrumb items={LONG_TRAIL} />);

		const content = contentOf(LONG_TITLE);
		await user.hover(content);

		expect(content).not.toHaveAttribute('data-truncated');
		expect(queryOpenTooltip()).toBeNull();
	});

	it('keeps the crumb mounted when the tooltip appears, so it never loses the focus', async () => {
		const user = userEvent.setup();

		render(<Breadcrumb items={[{ title: 'Reports', onClick: noop }, { title: LONG_TITLE }]} />);

		const button = screen.getByRole('button', { name: 'Reports' });
		await user.tab();
		expect(button).toHaveFocus();
		expect(button).not.toHaveAttribute('data-truncated');

		resize(300, 100);
		await waitFor(() => expect(button).toHaveAttribute('data-truncated', 'true'));
		await user.hover(button);
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent('Reports'));

		expect(screen.getByRole('button', { name: 'Reports' })).toBe(button);
		expect(button).toHaveFocus();
	});

	it('does not measure the label with textOverflow="hidden"', async () => {
		const user = userEvent.setup();
		truncate();

		render(<Breadcrumb items={LONG_TRAIL} textOverflow="hidden" />);

		const content = contentOf(LONG_TITLE);
		await user.hover(content);

		expect(content).not.toHaveAttribute('data-truncated');
		expect(contentOf('Services')).not.toHaveAttribute('data-truncated');
		await new Promise((resolve) => setTimeout(resolve, 400));
		expect(queryOpenTooltip()).toBeNull();
	});

	it('opens the tooltip of a crumb that has a menu, and still opens the menu on click', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/home' },
					{ title: LONG_TITLE, menu: [{ title: 'Payments', href: '/payments' }] },
				]}
			/>,
		);

		const trigger = screen.getByRole('button', { name: LONG_TITLE });
		expect(trigger).toHaveAttribute('data-truncated', 'true');

		await user.hover(trigger);
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_TITLE));

		await user.click(trigger);
		expect(await screen.findByRole('menu')).toBeInTheDocument();
	});

	it('gives the `...` crumb no tooltip of its own', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<Breadcrumb
				items={[
					{ title: LONG_TITLE, href: '/a' },
					{ title: 'Middle', href: '/b' },
					{ title: 'Current page' },
				]}
				maxVisible={2}
				testId="bc"
			/>,
		);

		const trigger = screen.getByTestId('bc-ellipsis');
		expect(trigger).not.toHaveAttribute('data-truncated');

		// A tooltip that has already opened for a crumb opens the next one at once, so a quiet
		// hover here is not just a slow one.
		await user.hover(contentOf(LONG_TITLE));
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_TITLE));

		await user.hover(trigger);
		await waitFor(() => expect(queryOpenTooltip()).toBeNull());
		await new Promise((resolve) => setTimeout(resolve, 400));
		expect(queryOpenTooltip()).toBeNull();
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
