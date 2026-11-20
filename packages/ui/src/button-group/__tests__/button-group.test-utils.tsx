import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { type MockInstance, vi } from 'vitest';
import type { ButtonGroupItemType } from '../types.js';

/** The appearance every case shares, spread so a render fits on one line. */
export const BASE = { variant: 'outlined', color: 'secondary', size: 'md' } as const;

export const noop = (): void => {};

/**
 * The package tokens are not loaded here, so a frame declares the ones the members read, with the
 * numbers `@signozhq/design-tokens` ships: the gap and wide gap between members, the corner radius
 * and the text sizes.
 */
export const TOKENS = {
	'--spacing-2': '4px',
	'--spacing-4': '8px',
	'--spacing-6': '12px',
	'--radius-1': '6px',
	'--label-small-500-font-size': '11px',
	'--label-small-500-line-height': '1',
	'--label-base-500-font-size': '13px',
	'--label-base-500-line-height': '1',
} as CSSProperties;

export const ITEMS: ButtonGroupItemType[] = [
	{ value: 'day', label: 'Day', onClick: noop },
	{ value: 'week', label: 'Week', onClick: noop },
	{ value: 'month', label: 'Month', onClick: noop },
];

/** Six members, so a 300px frame has to collapse some of them. */
export const MANY_ITEMS: ButtonGroupItemType[] = Array.from({ length: 6 }, (_, index) => ({
	value: `item-${index}`,
	label: `Option ${index}`,
	onClick: noop,
}));

/**
 * Renders inside a box of a fixed width. The box is the `wrapper`, so a `rerender` keeps it.
 */
export function renderInFrame(
	ui: ReactElement,
	{ size, style }: { size: number; style?: CSSProperties },
): ReturnType<typeof render> {
	return render(ui, {
		wrapper: ({ children }) => <div style={{ width: size, ...style }}>{children}</div>,
	});
}

/** The members still in the row, without the ellipsis, in `items` order. */
export function visibleMembers(): HTMLElement[] {
	return screen.getAllByRole('button').filter((button) => button.dataset.overflow !== 'true');
}

/** Swallows the `console.error` a missing label reports, and hands back the spy. */
export function silenceConsoleError(): MockInstance<typeof console.error> {
	return vi.spyOn(console, 'error').mockImplementation(() => {});
}
