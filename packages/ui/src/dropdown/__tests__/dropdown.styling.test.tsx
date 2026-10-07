import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Dropdown } from '../index.js';
import type { DropdownItemType, DropdownProps } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

/**
 * The semantic tokens are not loaded here, so the colours the rules read are declared in the test,
 * the same way `dropdown.inert-hover.test.tsx` does.
 */
const LABEL_DISABLED = 'rgb(100, 100, 100)';
const DANGER = 'rgb(255, 0, 0)';
const TRANSLUCENT_FADE = 'rgba(1, 2, 3, 0.6)';

let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--dropdown-item-label-disabled: ${LABEL_DISABLED};
		--dropdown-item-danger-label: ${DANGER};
		--dropdown-scroll-fade: ${TRANSLUCENT_FADE};
		--dropdown-scroll-fade-size: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function renderDropdown(
	items: DropdownItemType[],
	props: Pick<DropdownProps, 'contentMaxWidth' | 'contentMaxHeight' | 'searchInputProps'> = {},
) {
	return render(
		<Dropdown nativeButton side="bottom" align="start" items={items} testId="menu" {...props}>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

describe('Dropdown styling', () => {
	it('paints a disabled danger row in the disabled colour', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'delete',
				label: 'Delete',
				danger: true,
				disabled: true,
				disabledTooltip: 'Read only',
			},
		]);
		await openDropdown();

		expect(getComputedStyle(screen.getByTestId('menu-item-delete')).color).toBe(LABEL_DISABLED);
	});

	it('keeps the rows between the fades opaque, whatever alpha the fade token carries', async () => {
		renderDropdown(
			Array.from({ length: 20 }, (_, index) => ({
				type: 'item' as const,
				value: `row-${index}`,
				label: `Row ${index}`,
			})),
			{ contentMaxHeight: 120 },
		);
		const popup = await openDropdown();
		const viewport = popup.querySelector<HTMLElement>('[data-slot="dropdown-viewport"]');

		expect(viewport).toHaveAttribute('data-scroll-end');
		const mask = getComputedStyle(viewport as HTMLElement).maskImage;
		expect(mask).toContain('linear-gradient');
		expect(mask).not.toContain('0.6)');
	});

	it('moves the fades to the edges that clip rows as the list scrolls', async () => {
		renderDropdown(
			Array.from({ length: 20 }, (_, index) => ({
				type: 'item' as const,
				value: `row-${index}`,
				label: `Row ${index}`,
			})),
			{ contentMaxHeight: 120 },
		);
		const popup = await openDropdown();
		const viewport = popup.querySelector<HTMLElement>(
			'[data-slot="dropdown-viewport"]',
		) as HTMLElement;

		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-scroll-end');
		});
		expect(viewport).not.toHaveAttribute('data-scroll-start');

		viewport.scrollTop = 40;
		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-scroll-start');
		});
		expect(viewport).toHaveAttribute('data-scroll-end');

		viewport.scrollTop = viewport.scrollHeight;
		await waitFor(() => {
			expect(viewport).not.toHaveAttribute('data-scroll-end');
		});
		expect(viewport).toHaveAttribute('data-scroll-start');
	});

	it('scrolls the row the keyboard reaches clear of the bottom fade', async () => {
		renderDropdown(
			Array.from({ length: 20 }, (_, index) => ({
				type: 'item' as const,
				value: `row-${index}`,
				label: `Row ${index}`,
			})),
			{ contentMaxHeight: 120 },
		);
		const popup = await openDropdown();
		const viewport = popup.querySelector<HTMLElement>(
			'[data-slot="dropdown-viewport"]',
		) as HTMLElement;

		// Past the rows that fit, so every step scrolls.
		for (let step = 0; step < 8; step += 1) {
			await userEvent.keyboard('{ArrowDown}');
		}

		const row = popup.querySelector('[data-slot="dropdown-item"][data-highlighted]') as HTMLElement;

		// Guards the subject: a row that fits from the start needs no scroll at all.
		expect(row).toHaveTextContent('Row 7');
		expect(viewport).toHaveAttribute('data-scroll-end');
		expect(
			viewport.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom,
		).toBeGreaterThanOrEqual(20);
	});

	it('draws the checkbox tick at its own size, not the icon size', async () => {
		renderDropdown([{ type: 'checkbox', name: 'pinned', label: 'Pinned', defaultValue: true }]);
		await openDropdown();

		const tick = screen
			.getByRole('menuitemcheckbox', { name: 'Pinned' })
			.querySelector('[data-slot="dropdown-item-indicator"] svg');

		expect((tick as SVGElement).getBoundingClientRect().width).toBe(12);
	});

	it('honours a contentMaxWidth below the default floor', async () => {
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }], { contentMaxWidth: 150 });
		const popup = await openDropdown();

		expect(popup.getBoundingClientRect().width).toBe(150);
	});

	it('still opens no narrower than 12rem by default', async () => {
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }]);
		const popup = await openDropdown();

		expect(popup.getBoundingClientRect().width).toBe(192);
	});
});

describe('Dropdown row size', () => {
	/**
	 * The spacing and line-height tokens the rows read, with the numbers `@signozhq/design-tokens`
	 * ships. Without them every padding computes to zero.
	 */
	let sizes: HTMLStyleElement;

	beforeEach(() => {
		sizes = document.createElement('style');
		sizes.textContent = `:root {
			--spacing-2: 4px;
			--spacing-4: 8px;
			--spacing-6: 12px;
			--line-height-18: 18px;
			--periscope-font-size-base: 13px;
		}`;
		document.head.append(sizes);
	});

	afterEach(() => {
		sizes.remove();
	});

	it('still takes --dropdown-item-padding and --dropdown-item-line-height from the call site', async () => {
		sizes.textContent += `:root {
			--dropdown-item-padding: 10px 12px;
			--dropdown-item-line-height: 20px;
		}`;
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }]);
		await openDropdown();

		expect(screen.getByRole('menuitem', { name: 'Rename' }).getBoundingClientRect().height).toBe(
			40,
		);
	});

	it('starts the rows at the popup edge and spaces a separator by the row gap', async () => {
		renderDropdown([
			{ type: 'item', value: 'rename', label: 'Rename' },
			{ type: 'item', value: 'copy', label: 'Copy' },
			{ type: 'separator', value: 'danger' },
			{ type: 'item', value: 'delete', label: 'Delete' },
		]);
		const popup = (await openDropdown()).getBoundingClientRect();

		const rename = screen.getByRole('menuitem', { name: 'Rename' }).getBoundingClientRect();
		const copy = screen.getByRole('menuitem', { name: 'Copy' }).getBoundingClientRect();
		const separator = screen.getByRole('separator').getBoundingClientRect();
		const remove = screen.getByRole('menuitem', { name: 'Delete' }).getBoundingClientRect();

		// The popup's 1px border is the only thing above the first row and below the last.
		expect(rename.top - popup.top).toBe(1);
		expect(popup.bottom - remove.bottom).toBe(1);
		expect(copy.top - rename.bottom).toBe(4);
		expect(separator.top - copy.bottom).toBe(4);
		expect(remove.top - separator.bottom).toBe(4);
	});

	// The search row's height is not settled by the rows, so a row line height leaves it alone.
	it('keeps the search field on its own line height', async () => {
		sizes.textContent += `:root {
			--line-height-20: 20px;
			--dropdown-item-line-height: 16px;
		}`;
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }], {
			searchInputProps: { placeholder: 'Find' },
		});
		await openDropdown();

		const search = screen.getByTestId('menu-search');

		expect(getComputedStyle(search).lineHeight).toBe('20px');

		sizes.textContent += `:root { --dropdown-search-input-line-height: 24px; }`;

		expect(getComputedStyle(search).lineHeight).toBe('24px');
	});
});
