import '@testing-library/jest-dom/vitest';
import { beforeAll } from 'vitest';
import { cdp } from 'vitest/browser';

// Tests that hover through Playwright move the real mouse, and it stays where the last one left
// it. Chromium sends a mouse move to whatever renders under it next, so a toast stack or a
// tooltip trigger in a later file opens as hovered. Park the mouse outside the page before each
// file. Not before each test: the input event lets frames run between two tests, and the Tab test
// in `select.interaction.test.tsx` fails once a frame runs after a test that left a Select open.
beforeAll(async () => {
	await cdp().send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: -1, y: -1 });
});

// jsdom ships neither of these. A real browser has both, so these shims install
// only when the API is genuinely missing and browser mode exercises the real
// implementations instead.
if (typeof globalThis.ResizeObserver === 'undefined') {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

if (typeof Element !== 'undefined' && typeof Element.prototype.scrollIntoView !== 'function') {
	Element.prototype.scrollIntoView = () => {};
}
