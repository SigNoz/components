/// <reference types="vite/client" />

import '@testing-library/jest-dom/vitest';

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

// React logs "not wrapped in act(...)" for any update after a test stops waiting,
// such as popup positioning. A failed test stops early, so these bury its error.
// Run with SHOW_ACT_WARNINGS=1 to see them.
if (!import.meta.env.SHOW_ACT_WARNINGS) {
	const originalConsoleError = console.error;
	console.error = (...args: unknown[]): void => {
		if (typeof args[0] === 'string' && args[0].includes('not wrapped in act(')) {
			return;
		}
		originalConsoleError(...args);
	};
}
