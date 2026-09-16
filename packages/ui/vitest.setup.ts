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
