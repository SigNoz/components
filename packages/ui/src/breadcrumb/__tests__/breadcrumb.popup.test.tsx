import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import { ellipsis, renderInFrame } from './breadcrumb.test-utils.js';

const MENU_TOKEN = '--breadcrumb-menu-max-width';
const TOOLTIP_TOKEN = '--breadcrumb-tooltip-max-width';

const LONG_TITLE =
	'Checkout service in the production cluster of the east region with the new payment gateway';

/** Five crumbs whose titles run well past any cap, so a popup is as wide as its cap lets it be. */
const LONG_TRAIL: BreadcrumbItemType[] = [
	{ title: `Dashboards ${LONG_TITLE}`, href: '/dashboards' },
	{ title: `Payments ${LONG_TITLE}`, href: '/payments' },
	{ title: `Services ${LONG_TITLE}`, href: '/services' },
	{ title: `Checkout ${LONG_TITLE}`, href: '/checkout' },
	{ title: `prod-east ${LONG_TITLE}` },
];

function rem(count: number): number {
	return count * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * Both popups are portalled to the body, outside the trail, so a custom property reaches them only
 * from the page. An element around the trail is not an ancestor of the popup.
 */
function setOnPage(token: string, value: string): void {
	document.documentElement.style.setProperty(token, value);
}

afterEach(() => {
	document.documentElement.style.removeProperty(MENU_TOKEN);
	document.documentElement.style.removeProperty(TOOLTIP_TOKEN);
});

async function openMenu(): Promise<HTMLElement> {
	const user = userEvent.setup();
	renderInFrame(<Breadcrumb items={LONG_TRAIL} testId="bc" />, 400);

	const trigger = ellipsis();
	if (trigger === null) {
		throw new Error('the trail did not collapse');
	}
	await user.click(trigger);

	return waitFor(() => {
		const popup = document.querySelector<HTMLElement>('[data-slot="dropdown-popup"]');
		if (popup === null) {
			throw new Error('the menu is not open');
		}
		return popup;
	});
}

async function openTooltip(): Promise<HTMLElement> {
	const user = userEvent.setup();
	render(
		<div style={{ width: 150 }}>
			<Breadcrumb
				items={[{ title: 'Services', href: '/services' }, { title: LONG_TITLE }]}
				testId="bc"
			/>
		</div>,
	);

	const cut = await waitFor(() => {
		const crumb = document.querySelector<HTMLElement>('[data-truncated="true"]');
		if (crumb === null) {
			throw new Error('no crumb is cut');
		}
		return crumb;
	});
	await user.hover(cut);

	return waitFor(() => {
		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveTextContent(LONG_TITLE);
		return tooltip;
	});
}

describe('Breadcrumb menu of the `...` crumb', () => {
	it('is no wider than 20rem', async () => {
		const popup = await openMenu();

		expect(getComputedStyle(popup).maxInlineSize).toBe(`${rem(20)}px`);
		expect(popup.getBoundingClientRect().width).toBe(rem(20));
	});

	it('takes its cap from the page, where the portalled menu inherits from', async () => {
		setOnPage(MENU_TOKEN, '28rem');

		const popup = await openMenu();

		expect(getComputedStyle(popup).maxInlineSize).toBe(`${rem(28)}px`);
		expect(popup.getBoundingClientRect().width).toBe(rem(28));
	});
});

describe('Breadcrumb tooltip of a cut crumb', () => {
	it('is no wider than 20rem, whatever the Tooltip allows by default', async () => {
		const tooltip = await openTooltip();

		expect(getComputedStyle(tooltip).maxWidth).toBe(`${rem(20)}px`);
		expect(tooltip.getBoundingClientRect().width).toBe(rem(20));
	});

	it('takes its cap from the page, where the portalled tooltip inherits from', async () => {
		setOnPage(TOOLTIP_TOKEN, '12rem');

		const tooltip = await openTooltip();

		expect(getComputedStyle(tooltip).maxWidth).toBe(`${rem(12)}px`);
		expect(tooltip.getBoundingClientRect().width).toBe(rem(12));
	});
});
