import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Dropdown } from '../index.js';
import { openDropdown } from './dropdown.test-utils.js';

/**
 * The semantic tokens live in `@signozhq/design-tokens` and are not loaded here, so every colour
 * would otherwise compute to its initial value and the assertions below would pass on a blank
 * stylesheet. Declaring them in the test keeps the subject where it belongs: the rules in
 * `dropdown.module.scss`, not the values the token package happens to ship.
 */
const HOVER_FILL = 'rgb(10, 20, 30)';
const LABEL_HOVER = 'rgb(255, 255, 255)';
const LABEL = 'rgb(200, 200, 200)';
const LABEL_DISABLED = 'rgb(100, 100, 100)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--dropdown-item-background: transparent;
		--dropdown-item-background-hover: ${HOVER_FILL};
		--dropdown-item-label: ${LABEL};
		--dropdown-item-label-hover: ${LABEL_HOVER};
		--dropdown-item-label-disabled: ${LABEL_DISABLED};
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function renderInertMenu() {
	return render(
		<Dropdown
			nativeButton
			side="bottom"
			align="start"
			testId="menu"
			items={[
				{ type: 'item', value: 'a', label: 'Alpha' },
				{ type: 'item', value: 'b', label: 'Bravo', disabled: true, disabledTooltip: 'No access' },
				{ type: 'item', value: 'c', label: 'Charlie', loading: true, loadingTooltip: 'Saving' },
			]}
		>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

describe('Dropdown hover on an inert row', () => {
	it('paints the hover fill on a row that can actually be used', async () => {
		renderInertMenu();
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Alpha' });
		await userEvent.hover(row);

		// Guards every assertion below: if the fill did not land here, the tokens above never
		// reached the stylesheet and a "no fill" result elsewhere would mean nothing.
		expect(getComputedStyle(row).backgroundColor).toBe(HOVER_FILL);
		expect(getComputedStyle(row).color).toBe(LABEL_HOVER);
	});

	it('leaves a disabled row unpainted, so hover never offers what the row cannot do', async () => {
		renderInertMenu();
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Bravo' });
		await userEvent.hover(row);

		expect(getComputedStyle(row).backgroundColor).toBe(TRANSPARENT);
		expect(getComputedStyle(row).color).toBe(LABEL_DISABLED);
	});

	it('leaves a loading row unpainted and keeps it dimmed', async () => {
		renderInertMenu();
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Charlie' });
		await userEvent.hover(row);

		expect(getComputedStyle(row).backgroundColor).toBe(TRANSPARENT);
		expect(getComputedStyle(row).color).toBe(LABEL);
		expect(getComputedStyle(row).opacity).toBe('0.8');
	});

	it('leaves every other row unpainted while one row is pending', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				testId="menu"
				items={[
					{ type: 'item', value: 'a', label: 'Alpha', onClick: () => new Promise(() => {}) },
					{ type: 'item', value: 'b', label: 'Bravo' },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Alpha' }));

		const other = screen.getByRole('menuitem', { name: 'Bravo' });
		await userEvent.hover(other);

		expect(getComputedStyle(other).backgroundColor).toBe(TRANSPARENT);
	});
});
