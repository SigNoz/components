import { act, render, screen } from '@testing-library/react';
import {
	type ComponentProps,
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type ReactNode,
} from 'react';
import type { BreadcrumbItemType } from '../types.js';

export const noop = (): void => {};

/**
 * Stands in for a router link: takes a `to`, renders an `<a>` and forwards the rest. It navigates
 * on the client, so a click never loads a page in the browser the tests run in.
 */
export const RouterLink = forwardRef<HTMLAnchorElement, ComponentProps<'a'> & { to?: string }>(
	function RouterLink({ to, onClick, children, ...props }, ref) {
		return (
			<a
				ref={ref}
				href={to}
				onClick={(event) => {
					onClick?.(event);
					event.preventDefault();
				}}
				{...props}
			>
				{children}
			</a>
		);
	},
);

/** Five crumbs, every one but the current page a link. */
export const TRAIL: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments', href: '/dashboards/payments' },
	{ title: 'Services', href: '/dashboards/payments/services' },
	{ title: 'Checkout', href: '/dashboards/payments/services/checkout' },
	{ title: 'prod-east' },
];

/**
 * Pins the width of a separator at 10px and of the `...` crumb at 30px, so the thresholds do not
 * depend on the font. The crumbs keep the width of their own content.
 */
export const PINNED_PARTS = `
	[data-slot="breadcrumb-separator"],
	[data-slot="breadcrumb-measure-separator"] { width: 10px; }
	[data-slot="breadcrumb-measure-ellipsis"] { width: 30px; }
`;

/**
 * {@link PINNED_PARTS} and a width of 100px for every crumb, with no gap.
 *
 * With the five crumbs of {@link TRAIL}, the trail needs 540px, then 470px with one crumb
 * collapsed, 360px with two and 250px with three.
 */
export const FIXED_LAYOUT = `
	[data-slot="breadcrumb-item"] { width: 100px; }
	${PINNED_PARTS}
`;

export const FULL_WIDTH = 540;

/**
 * The box every crumb sits in. The design tokens are not loaded in a unit test, and the floor a
 * crumb shrinks to reads one of them, so the box sets it.
 */
export function Frame({
	size,
	style,
	children,
}: {
	size: number;
	style?: Record<string, string>;
	children: ReactNode;
}): ReactElement {
	return (
		<div
			data-testid="frame"
			style={{ width: size, '--spacing-1': '2px', ...style } as CSSProperties}
		>
			<style>{FIXED_LAYOUT}</style>
			{children}
		</div>
	);
}

type FrameResult = Omit<ReturnType<typeof render>, 'rerender'> & {
	frame: HTMLElement;
	/** Renders the same frame again with new content, at the width the frame has now. */
	rerender: (ui: ReactElement) => void;
	/** Changes the width of the frame in place, the way a window or a sidebar does, and waits. */
	resize: (size: number) => Promise<void>;
};

/**
 * Renders inside a box of a fixed width, with the pinned layout. `style` sets custom properties
 * on the box, which every crumb inherits.
 */
export function renderInFrame(
	ui: ReactElement,
	size: number,
	style?: Record<string, string>,
): FrameResult {
	const result = render(
		<Frame size={size} style={style}>
			{ui}
		</Frame>,
	);
	const frame = screen.getByTestId('frame');

	return {
		...result,
		frame,
		rerender: (next) =>
			result.rerender(
				<Frame size={Number.parseFloat(frame.style.width)} style={style}>
					{next}
				</Frame>,
			),
		resize: async (next) => {
			frame.style.width = `${next}px`;
			await settle();
		},
	};
}

/** Lets a `ResizeObserver` report and the state it sets flush, which takes a frame or two. */
export async function settle(): Promise<void> {
	await act(async () => {
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
}

export function visibleCrumbs(): HTMLElement[] {
	return Array.from(
		document.querySelectorAll<HTMLElement>(
			'[data-slot="breadcrumb-item"]:not([data-collapsed="true"])',
		),
	);
}

export function collapsedCrumbs(): HTMLElement[] {
	return Array.from(
		document.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"][data-collapsed="true"]'),
	);
}

export function labelsOf(crumbs: HTMLElement[]): (string | null)[] {
	return crumbs.map((crumb) => crumb.textContent);
}

export function ellipsis(): HTMLElement | null {
	return document.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis-trigger"]');
}
