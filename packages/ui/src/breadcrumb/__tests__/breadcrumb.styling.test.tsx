import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType, BreadcrumbVariantType } from '../types.js';
import { ellipsis, noop, openEllipsisPopup, settle } from './breadcrumb.test-utils.js';

/**
 * The design tokens are not loaded in the tests, so the text style the trail reads is declared
 * here with the values `@signozhq/design-tokens` ships, and the page around the trail gets a
 * deliberately wrong font, so a part that does not take the trail's style shows it.
 */
const TOKENS = `
	:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-12: 24px;
		--spacing-16: 32px;
		--radius-0: 0px;
		--radius-1: 2px;
		--radius-2: 4px;
		--breadcrumb-label: rgb(240, 240, 240);
		--breadcrumb-label-hover: rgb(255, 255, 255);
		--breadcrumb-background-hover: rgb(10, 10, 10);
		--l2-foreground: rgb(170, 170, 170);
		--l2-border: rgb(30, 30, 30);
		--l3-border: rgb(60, 60, 60);
		--l3-background-30: rgb(20, 20, 20);
		--l3-background-60: rgb(40, 40, 40);
		--label-base-400-font-family: Arial, sans-serif;
		--label-base-400-font-size: 13px;
		--label-base-400-font-weight: 400;
		--label-base-400-line-height: 1;
		--label-base-400-letter-spacing: -0.005em;
		--label-base-400-text-transform: none;
	}

	[data-testid='page'] {
		font-family: 'Courier New', monospace;
		font-size: 20px;
		font-weight: 700;
		line-height: 40px;
		letter-spacing: 3px;
		text-transform: uppercase;
		font-variant-numeric: tabular-nums slashed-zero;
		font-feature-settings: 'ss01' 0;
	}
`;

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments', href: '/dashboards/payments' },
	{ title: 'Services', onClick: noop },
	{ title: 'Checkout', menu: [{ title: 'Orders', href: '/orders' }] },
	{ title: 'prod-east' },
];

const TEXT_PROPERTIES = [
	'font-family',
	'font-size',
	'font-weight',
	'line-height',
	'letter-spacing',
	'text-transform',
	'font-variant-numeric',
	'font-feature-settings',
] as const;

let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = TOKENS;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function renderTrail() {
	render(
		<div data-testid="page">
			<Breadcrumb items={ITEMS} maxVisible={4} testId="bc" />
		</div>,
	);
}

function textStyle(element: Element): Record<string, string> {
	const style = getComputedStyle(element);
	return Object.fromEntries(
		TEXT_PROPERTIES.map((property) => [property, style.getPropertyValue(property)]),
	);
}

describe('Breadcrumb text style', () => {
	it('draws the trail in Label / Base / 400 with open digits, whatever the page sets', () => {
		renderTrail();

		expect(textStyle(screen.getByTestId('bc'))).toEqual({
			'font-family': 'Arial, sans-serif',
			'font-size': '13px',
			'font-weight': '400',
			'line-height': '13px',
			'letter-spacing': '-0.065px',
			'text-transform': 'none',
			'font-variant-numeric': 'normal',
			'font-feature-settings': '"ss01"',
		});
	});

	it('gives every crumb, links, buttons, menus and the ellipsis included, the style of the trail', () => {
		renderTrail();

		const root = textStyle(screen.getByTestId('bc'));
		const parts = [
			...screen.getByTestId('bc').querySelectorAll('[data-slot="breadcrumb-item-content"]'),
			screen.getByTestId('bc-ellipsis'),
		];
		const tags = parts.map((part) => part.tagName);

		expect(tags).toEqual(expect.arrayContaining(['A', 'BUTTON', 'SPAN']));
		for (const part of parts) {
			expect(textStyle(part)).toEqual(root);
		}
	});

	it('keeps a crumb 21px tall, the line height of the text style aside', () => {
		renderTrail();

		const crumb = screen
			.getByTestId('bc')
			.querySelector('[data-slot="breadcrumb-item-content"]') as HTMLElement;

		expect(crumb.getBoundingClientRect().height).toBe(21);
	});
});

const OUTLINED_ITEMS: BreadcrumbItemType[] = [
	{ title: 'Clusters', href: '/clusters' },
	{ title: 'Pods', onClick: noop },
	{ title: 'Traces' },
	{ title: 'Logs' },
];

function renderVariant(variant: BreadcrumbVariantType, items = OUTLINED_ITEMS) {
	render(<Breadcrumb items={items} variant={variant} testId="bc" />);
}

function contentOf(index: number): HTMLElement {
	return within(screen.getByTestId(`bc-item-${index}`)).getByText(
		(_, element) => element?.getAttribute('data-slot') === 'breadcrumb-item-content',
	);
}

function boxOf(element: HTMLElement): Record<string, string> {
	const style = getComputedStyle(element);

	return {
		height: style.height,
		padding: style.padding,
		columnGap: style.columnGap,
		borderWidth: style.borderTopWidth,
		borderStyle: style.borderTopStyle,
		borderColor: style.borderTopColor,
		borderRadius: style.borderTopLeftRadius,
		backgroundColor: style.backgroundColor,
		color: style.color,
	};
}

const CHIP = {
	height: '24px',
	padding: '3px 8px 3px 6px',
	columnGap: '6px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'rgb(30, 30, 30)',
	borderRadius: '4px',
	backgroundColor: 'rgb(20, 20, 20)',
	color: 'rgb(170, 170, 170)',
};

describe('Breadcrumb outlined variant', () => {
	it('draws every crumb but the current page as a chip, whatever it does', () => {
		renderVariant('outlined');

		for (const index of [0, 1, 2]) {
			expect(boxOf(contentOf(index))).toEqual(CHIP);
		}
	});

	it('leaves the current page as text in the primary colour with the padding of a chip', () => {
		renderVariant('outlined');

		expect(boxOf(contentOf(3))).toEqual({
			height: '22px',
			padding: '3px 8px 3px 6px',
			columnGap: '6px',
			borderWidth: '0px',
			borderStyle: 'none',
			borderColor: 'rgb(240, 240, 240)',
			borderRadius: '4px',
			backgroundColor: 'rgba(0, 0, 0, 0)',
			color: 'rgb(240, 240, 240)',
		});
	});

	it('draws the lone crumb as the current page', () => {
		render(<Breadcrumb items={[{ title: 'Home' }]} variant="outlined" testId="bc" />);

		expect(boxOf(contentOf(0))).toMatchObject({ borderWidth: '0px', color: 'rgb(240, 240, 240)' });
	});

	it('draws the ... crumb as a chip with no room for an icon', () => {
		render(
			<div style={{ width: 200 }}>
				<Breadcrumb
					items={[...OUTLINED_ITEMS, { title: 'Spans', href: '/spans' }, { title: 'Done' }]}
					variant="outlined"
					testId="bc"
				/>
			</div>,
		);

		const trigger = ellipsis();

		expect(trigger).not.toBeNull();
		expect(boxOf(trigger as HTMLElement)).toEqual({ ...CHIP, padding: '3px 8px' });
	});

	it('strengthens the fill and the border of a chip on hover and leaves the label colour', async () => {
		renderVariant('outlined');

		const chip = contentOf(0);

		await userEvent.hover(chip);

		// The colours transition, so the computed style gets there after a moment.
		await vi.waitFor(() =>
			expect(boxOf(chip)).toEqual({
				...CHIP,
				borderColor: 'rgb(60, 60, 60)',
				backgroundColor: 'rgb(40, 40, 40)',
			}),
		);
	});

	it('keeps the plain hover on the current page when it reacts, with no border', async () => {
		renderVariant('outlined', [
			{ title: 'Clusters', href: '/clusters' },
			{ title: 'Pods', href: '/pods' },
		]);

		const current = contentOf(1);

		await userEvent.hover(current);

		await vi.waitFor(() =>
			expect(boxOf(current)).toMatchObject({
				borderWidth: '0px',
				borderRadius: '4px',
				backgroundColor: 'rgb(10, 10, 10)',
				color: 'rgb(255, 255, 255)',
			}),
		);
	});

	it('leaves the plain variant as it was, no chip anywhere', () => {
		renderVariant('plain');

		for (const index of [0, 1, 2, 3]) {
			expect(boxOf(contentOf(index))).toEqual({
				height: '21px',
				padding: '4px 2px',
				columnGap: '4px',
				borderWidth: '0px',
				borderStyle: 'none',
				borderColor: 'rgb(240, 240, 240)',
				borderRadius: '0px',
				backgroundColor: 'rgba(0, 0, 0, 0)',
				color: 'rgb(240, 240, 240)',
			});
		}
	});

	it('spaces the chips by 4px around a separator and the plain crumbs by 8px', () => {
		const gap = (variant: BreadcrumbVariantType): string => {
			const { unmount } = render(
				<Breadcrumb items={OUTLINED_ITEMS} variant={variant} testId="bc" />,
			);
			const value = getComputedStyle(within(screen.getByTestId('bc')).getByRole('list')).columnGap;

			unmount();

			return value;
		};

		expect(gap('outlined')).toBe('4px');
		expect(gap('plain')).toBe('8px');
	});

	it('takes the chip into the measures: the ... crumb is measured as wide as it renders', async () => {
		render(
			<div style={{ width: 200 }}>
				<Breadcrumb items={[...OUTLINED_ITEMS, { title: 'Done' }]} variant="outlined" testId="bc" />
			</div>,
		);
		await settle();

		const measured = screen
			.getByTestId('bc')
			.querySelector('[data-slot="breadcrumb-measure-ellipsis"]') as HTMLElement;

		expect(boxOf(measured)).toMatchObject({
			padding: '3px 8px',
			borderWidth: '1px',
			height: '24px',
		});
		expect(measured.getBoundingClientRect().width).toBe(
			(ellipsis() as HTMLElement).getBoundingClientRect().width,
		);
	});

	it('leaves room for the chip in the floor a shortened crumb sits at', () => {
		const floor = (variant: BreadcrumbVariantType): number => {
			const { unmount } = render(
				<Breadcrumb items={OUTLINED_ITEMS} variant={variant} testId="bc" />,
			);
			const width = (
				screen
					.getByTestId('bc')
					.querySelector('[data-slot="breadcrumb-measure-floor"]') as HTMLElement
			).getBoundingClientRect().width;

			unmount();

			return width;
		};

		// 6px and 8px of padding and two 1px borders where the plain crumb has two 2px.
		expect(floor('outlined') - floor('plain')).toBe(16 - 4);
	});

	it('collapses before the chips overflow the room, at every width the trail can fit', async () => {
		const items: BreadcrumbItemType[] = [
			{ title: 'Clusters', href: '/clusters' },
			{ title: 'prod-gke-eu-west1', href: '/clusters/prod' },
			{ title: 'payments-7c9d5-xk2lp', href: '/pods/payments' },
			{ title: 'POST /charge', href: '/traces/charge' },
			{ title: 'OOMKilled: container over the limit' },
		];

		for (const width of [900, 640, 520, 440]) {
			const { unmount } = render(
				<div style={{ width }}>
					<Breadcrumb items={items} variant="outlined" testId="bc" />
				</div>,
			);
			await settle();

			const list = within(screen.getByTestId('bc')).getByRole('list');

			expect(list.scrollWidth, `${width}px`).toBeLessThanOrEqual(list.clientWidth);
			unmount();
		}
	});
});

describe('Breadcrumb popup of the `...` crumb', () => {
	const CAP_TOKEN = '--breadcrumb-ellipsis-max-block-size';
	const LONG_LIST: BreadcrumbItemType[] = Array.from({ length: 30 }, (_, index) => ({
		title: `Crumb ${index}`,
		href: `/crumb-${index}`,
	}));

	afterEach(() => {
		document.documentElement.style.removeProperty(CAP_TOKEN);
	});

	function content(popup: HTMLElement): HTMLElement {
		return popup.querySelector('[data-slot="breadcrumb-ellipsis-content"]') as HTMLElement;
	}

	it('draws the rows in Label / Base / 400, which the page around the trail does not reach', async () => {
		render(
			<div data-testid="page">
				<Breadcrumb items={ITEMS} maxVisible={2} testId="bc" />
			</div>,
		);

		const popup = await openEllipsisPopup();
		const rows = Array.from(
			popup.querySelectorAll('[data-slot="breadcrumb-ellipsis-row"]'),
		) as HTMLElement[];

		expect(rows.map((row) => row.tagName)).toEqual(['A', 'BUTTON', 'BUTTON']);
		for (const row of rows) {
			expect(textStyle(row)).toMatchObject({
				'font-family': 'Arial, sans-serif',
				'font-size': '13px',
				'font-weight': '400',
				'text-transform': 'none',
			});
			expect(getComputedStyle(row).textDecorationLine).toBe('none');
		}
	});

	it('cuts a long title of a row on the inline axis only, so its descenders still paint', async () => {
		render(<Breadcrumb items={ITEMS} maxVisible={2} testId="bc" />);

		const popup = await openEllipsisPopup();
		const label = popup.querySelector('[data-slot="breadcrumb-ellipsis-row-label"]') as HTMLElement;
		const style = getComputedStyle(label);

		expect(style.overflowX).toBe('clip');
		expect(style.overflowY).toBe('visible');
		expect(style.textOverflow).toBe('ellipsis');
	});

	it('scrolls inside the popup once the list is taller than 20rem', async () => {
		render(<Breadcrumb items={LONG_LIST} maxVisible={2} testId="bc" />);

		const list = content(await openEllipsisPopup());
		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

		expect(getComputedStyle(list).overflowY).toBe('auto');
		expect(list.clientHeight).toBeLessThanOrEqual(20 * rem);
		expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
	});

	it('takes the cap on its height from the page, where the portalled popup inherits from', async () => {
		document.documentElement.style.setProperty(CAP_TOKEN, '8rem');
		render(<Breadcrumb items={LONG_LIST} maxVisible={2} testId="bc" />);

		const list = content(await openEllipsisPopup());
		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

		expect(list.clientHeight).toBe(8 * rem);
		expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
	});

	it('keeps a short list as tall as its rows, with nothing to scroll', async () => {
		render(<Breadcrumb items={ITEMS} maxVisible={2} testId="bc" />);

		const list = content(await openEllipsisPopup());

		expect(list.scrollHeight).toBeLessThanOrEqual(list.clientHeight);
	});
});
