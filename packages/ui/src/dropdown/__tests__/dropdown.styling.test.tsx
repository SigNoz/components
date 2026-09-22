import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
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
	props: { contentMaxWidth?: number; contentMaxHeight?: number } = {},
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
