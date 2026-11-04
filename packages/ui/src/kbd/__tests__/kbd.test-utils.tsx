import { fireEvent } from '@testing-library/react';
import { afterAll, beforeAll, vi } from 'vitest';
import { page } from 'vitest/browser';

/**
 * A key going down on `target`, the document by default. `code` follows the US layout for letters
 * and digits so the event looks like one a browser sends.
 */
export function keyDown(key: string, init: KeyboardEventInit = {}, target: EventTarget = document) {
	fireEvent.keyDown(target, { key, code: codeFor(key), ...init });
}

export function keyUp(key: string, init: KeyboardEventInit = {}, target: EventTarget = document) {
	fireEvent.keyUp(target, { key, code: codeFor(key), ...init });
}

/** Pretends the browser runs on macOS, for `Mod` and the `Alt` word. */
export function mockPlatform(platform: string): void {
	vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);

	if ('userAgentData' in navigator) {
		vi.spyOn(
			navigator as Navigator & { userAgentData: unknown },
			'userAgentData',
			'get',
		).mockReturnValue({ platform });
	}
}

/**
 * The test viewport is 414px wide, where every key is hidden. Widens it for the file.
 */
export function withDesktopViewport(): void {
	beforeAll(async () => {
		await page.viewport(1280, 800);
	});

	afterAll(async () => {
		await page.viewport(414, 896);
	});
}

function codeFor(key: string): string {
	if (/^[a-z]$/i.test(key)) {
		return `Key${key.toUpperCase()}`;
	}

	if (/^[0-9]$/.test(key)) {
		return `Digit${key}`;
	}

	return key === 'Meta' || key === 'Control' || key === 'Shift' || key === 'Alt'
		? `${key}Left`
		: key;
}
