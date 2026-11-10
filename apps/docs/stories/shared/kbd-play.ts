import { expect } from 'storybook/test';

/**
 * Whether `Mod` is `⌘` here, read the way `Kbd` reads it.
 */
export function isMac(): boolean {
	const platform =
		(navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
		navigator.platform;

	return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * The word `Mod` is read as on this platform.
 */
export function modWord(): 'Command' | 'Control' {
	return isMac() ? 'Command' : 'Control';
}

export function expectPressed(key: HTMLElement): void {
	expect(key).toHaveAttribute('data-pressed');
}

export function expectAtRest(key: HTMLElement): void {
	expect(key).not.toHaveAttribute('data-pressed');
}

/**
 * A key inside a control takes the control's cursor, so a click on it reads as a click on the
 * control, and a blocked control shows its blocked cursor over the key too.
 */
export function expectCursorOf(key: HTMLElement, host: HTMLElement): void {
	expect(getComputedStyle(key).cursor).toBe(getComputedStyle(host).cursor);
}

/**
 * A row holding a shortcut is as tall as a row that holds none, so the key never pushes the list
 * apart. Within half a pixel, which is under any growth of the row that the eye would notice and
 * over the rounding of a fractional layout.
 */
export function expectSameHeight(row: HTMLElement, reference: HTMLElement): void {
	expect(row.getBoundingClientRect().height).toBeCloseTo(
		reference.getBoundingClientRect().height,
		0,
	);
}

/**
 * The first key a row holds, whether it holds one key or a shortcut.
 */
export function keyOf(row: HTMLElement): HTMLElement {
	const key = row.querySelector<HTMLElement>('[data-slot="kbd"]');

	if (key === null) {
		throw new Error('keyOf: the row holds no key.');
	}

	return key;
}

export function shortcutOf(row: HTMLElement): HTMLElement {
	const shortcut = row.querySelector<HTMLElement>('[data-slot="kbd-shortcut"]');

	if (shortcut === null) {
		throw new Error('shortcutOf: the row holds no shortcut.');
	}

	return shortcut;
}
