import { render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { Button } from '../../button/index.js';
import { Kbd } from '../index.js';

/**
 * The design tokens are not loaded here, so the values the key reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships. The colors are made up, to tell them apart.
 */
let tokens: HTMLStyleElement;

beforeAll(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-10: 20px;
		--radius-1-5: 3px;
		--code-small-500-font-size: 11px;
		--code-small-500-line-height: 1;
		--secondary-border: rgb(44, 48, 58);
		--secondary-background: rgb(35, 38, 46);
		--secondary-background-hover: rgb(50, 54, 64);
		--secondary-foreground: rgb(173, 180, 194);
		--button-primary-background: rgb(78, 116, 248);
		--button-primary-label: rgb(236, 238, 242);
		--kbd-transition-duration: 0s;
	}`;
	document.head.append(tokens);
});

afterAll(() => {
	tokens.remove();
});

afterEach(async () => {
	await page.viewport(414, 896);
});

function face(testId: string): HTMLElement {
	return screen.getByTestId(testId).firstElementChild as HTMLElement;
}

describe('Kbd layout', () => {
	it('is a 20 by 20 key in a slot one pixel taller', async () => {
		await page.viewport(1280, 800);
		render(<Kbd value="K" testId="key" />);

		const slot = screen.getByTestId('key').getBoundingClientRect();
		const box = face('key').getBoundingClientRect();

		expect([slot.width, slot.height]).toEqual([20, 21]);
		expect([box.width, box.height]).toEqual([20, 20]);
		expect(getComputedStyle(face('key')).borderBottomWidth).toBe('2px');
	});

	it('keeps the chord gap at 2px and the sequence gap at 4px', async () => {
		await page.viewport(1280, 800);
		render(
			<>
				<Kbd.Shortcut keys={['Mod', 'Shift', 'K']} testId="chord" />
				<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="sequence" />
			</>,
		);

		expect(screen.getByTestId('chord').getBoundingClientRect().width).toBe(64);
		expect(screen.getByTestId('sequence').getBoundingClientRect().width).toBe(44);
	});

	it('moves the face down inside the slot on a press, so nothing around it shifts', async () => {
		await page.viewport(1280, 800);
		const { rerender } = render(<Kbd value="K" testId="key" />);

		const slotBefore = screen.getByTestId('key').getBoundingClientRect();
		rerender(<Kbd value="K" testId="key" pressed />);

		const style = getComputedStyle(face('key'));
		expect(style.transform).toBe('matrix(1, 0, 0, 1, 0, 1)');
		expect(style.borderBottomWidth).toBe('1px');
		expect(screen.getByTestId('key').getBoundingClientRect()).toEqual(slotBefore);
	});

	it('takes the label color inside a solid primary Button, and the Button cursor', async () => {
		await page.viewport(1280, 800);
		render(
			<Button variant="solid" color="primary" suffix={<Kbd value="D" testId="key" />}>
				Download
			</Button>,
		);

		const style = getComputedStyle(face('key'));
		expect(style.color).toBe('rgb(236, 238, 242)');
		expect(style.borderTopColor).not.toBe('rgb(44, 48, 58)');
		expect(getComputedStyle(screen.getByTestId('key')).cursor).toBe('pointer');
	});

	it('keeps the default arrow outside an interactive parent', async () => {
		await page.viewport(1280, 800);
		render(<Kbd value="P" testId="key" />);

		expect(getComputedStyle(screen.getByTestId('key')).cursor).toBe('default');
	});

	it('sits in the line by default and on a line of its own as a block', async () => {
		await page.viewport(1280, 800);
		render(
			<div>
				Press <Kbd value="K" testId="inline" /> now
				<Kbd value="K" testId="block" display="block" marginTop={4} marginLeft="auto" />
				<Kbd.Shortcut keys={['Mod', 'K']} testId="shortcut" display="block" margin={4} />
			</div>,
		);

		const inline = getComputedStyle(screen.getByTestId('inline'));
		const block = getComputedStyle(screen.getByTestId('block'));
		const shortcut = getComputedStyle(screen.getByTestId('shortcut'));
		expect(inline.display).toBe('inline-flex');
		expect(inline.margin).toBe('0px');
		expect(block.display).toBe('flex');
		expect(block.marginTop).toBe('8px');
		expect(block.marginBottom).toBe('0px');
		expect(screen.getByTestId('block').getBoundingClientRect().width).toBe(20);
		expect(shortcut.display).toBe('flex');
		expect(shortcut.margin).toBe('8px');
	});

	it('is not rendered below 640px', async () => {
		await page.viewport(639, 800);
		render(
			<>
				<Kbd value="K" testId="key" />
				<Kbd.Shortcut keys={['Mod', 'K']} testId="shortcut" />
			</>,
		);

		expect(getComputedStyle(screen.getByTestId('key')).display).toBe('none');
		expect(getComputedStyle(screen.getByTestId('shortcut')).display).toBe('none');
	});
});
