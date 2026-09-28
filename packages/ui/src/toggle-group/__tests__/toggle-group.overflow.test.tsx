import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

/**
 * Real layout and a real `ResizeObserver`, so nothing here may import `mockLabelMeasurement`: it
 * redefines the `scrollWidth`/`clientWidth` prototype getters and swaps `ResizeObserver` for a
 * synchronous fake, which is exactly what these cases measure.
 */
const MANY_ITEMS: ToggleGroupItemProps[] = Array.from({ length: 8 }, (_, index) => ({
	value: `item-${index}`,
	label: `Option ${index}`,
}));

const FEW_ITEMS: ToggleGroupItemProps[] = MANY_ITEMS.slice(0, 2);

function renderInFrame(ui: ReactElement, { size }: { size: number }): ReturnType<typeof render> {
	return render(ui, {
		wrapper: ({ children }: { children: ReactNode }) => (
			<div style={{ width: size }}>{children}</div>
		),
	});
}

function viewport(): HTMLElement {
	const element = document.querySelector<HTMLElement>('[data-slot="toggle-group-viewport"]');

	if (!element) {
		throw new Error('no scroll viewport');
	}

	return element;
}

function scrollButton(direction: 'start' | 'end'): HTMLButtonElement | null {
	return document.querySelector<HTMLButtonElement>(
		`[data-slot="toggle-group-scroll-button"][data-direction="${direction}"]`,
	);
}

describe('ToggleGroup overflow', () => {
	it('renders no arrows while every option fits', async () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				items={FEW_ITEMS}
			/>,
			{ size: 800 },
		);

		await waitFor(() => expect(scrollButton('start')).toBeNull());
		expect(scrollButton('end')).toBeNull();
	});

	it('renders both arrows once the strip is wider than the bar', async () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				items={MANY_ITEMS}
			/>,
			{ size: 260 },
		);

		await waitFor(() => expect(scrollButton('start')).not.toBeNull());
		expect(scrollButton('end')).not.toBeNull();
	});

	it('disables the start arrow until the strip has travelled, and scrolls on a press', async () => {
		const user = userEvent.setup();
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				items={MANY_ITEMS}
			/>,
			{ size: 260 },
		);

		await waitFor(() => expect(scrollButton('end')).not.toBeNull());

		expect(scrollButton('start')).toBeDisabled();
		expect(scrollButton('end')).toBeEnabled();

		const end = scrollButton('end');

		if (!end) {
			throw new Error('no end arrow');
		}

		await user.click(end);

		await waitFor(() => expect(viewport().scrollLeft).toBeGreaterThan(0));
		await waitFor(() => expect(scrollButton('start')).toBeEnabled());
	});

	it('keeps the options at their own size rather than shrinking them', async () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				testId="bar"
				items={MANY_ITEMS}
			/>,
			{ size: 260 },
		);

		await waitFor(() => expect(scrollButton('end')).not.toBeNull());

		expect(viewport().scrollWidth).toBeGreaterThan(viewport().clientWidth);
	});
});
