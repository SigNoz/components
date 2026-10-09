import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Info } from '@signozhq/icons';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { CommandItemType } from '../types.js';
import { highlightedOption, renderOpenCommand } from './command.test-utils.js';

/**
 * The spacing and type tokens live in `@signozhq/design-tokens` and are not loaded here, so they
 * are declared in the test to keep the subject on the rules in `command.module.scss`.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-5: 10px;
		--spacing-6: 12px;
		--spacing-10: 20px;
		--periscope-font-size-base: 13px;
		--line-height-18: 18px;
		--line-height-20: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function rows(count: number): CommandItemType[] {
	return Array.from({ length: count }, (_, index) => ({
		type: 'item' as const,
		value: `row-${index}`,
		label: `Row ${index}`,
		onClick: () => {},
	}));
}

function required<T>(element: T | null): T {
	if (element === null) {
		throw new Error('Not rendered');
	}

	return element;
}

function centerY(element: Element): number {
	const { top, height } = element.getBoundingClientRect();

	return top + height / 2;
}

describe('Command styling', () => {
	it('runs the rows square to the panel edge, with no space below the last one', async () => {
		await renderOpenCommand({ items: rows(3) });
		const panel = screen.getByTestId('command').getBoundingClientRect();
		const last = screen.getByRole('option', { name: 'Row 2' });

		expect(getComputedStyle(last).borderRadius).toBe('0px');
		// The panel's 1px border is the only thing below the last row.
		expect(panel.bottom - last.getBoundingClientRect().bottom).toBe(1);
	});

	it('keeps the icon and the shortcut on the first line of a wrapped label', async () => {
		await renderOpenCommand({
			contentMaxWidth: 220,
			items: [
				{
					type: 'item',
					value: 'long',
					label: 'Open the service map for every service in the current environment',
					prefix: <Info />,
					shortcut: 'Shift+M',
					onClick: () => {},
				},
			],
		});
		const label = required(document.querySelector('[data-slot="command-item-label"]'));
		const prefix = required(screen.getByTestId('command-item-long-prefix').querySelector('svg'));
		const shortcut = required(document.querySelector('[data-slot="command-item-suffix"] kbd'));
		const firstLine = label.getBoundingClientRect().top + 18 / 2;

		// Guards the subject: a label on one line would centre the affixes either way.
		expect(label.getBoundingClientRect().height).toBeGreaterThan(18);
		expect(centerY(prefix)).toBe(firstLine);
		expect(Math.abs(centerY(shortcut) - firstLine)).toBeLessThanOrEqual(0.5);
	});

	it('scrolls the row the keyboard reaches clear of the bottom fade', async () => {
		await renderOpenCommand({ items: rows(30), contentMaxHeight: 160 });
		const viewport = required(
			document.querySelector<HTMLElement>('[data-slot="command-viewport"]'),
		);

		// Past the rows that fit, so every step scrolls.
		for (let step = 0; step < 10; step += 1) {
			await userEvent.keyboard('{ArrowDown}');
		}

		const row = required(highlightedOption()).getBoundingClientRect();

		expect(viewport).toHaveAttribute('data-scroll-end');
		expect(viewport.getBoundingClientRect().bottom - row.bottom).toBeGreaterThanOrEqual(20);
	});
});
