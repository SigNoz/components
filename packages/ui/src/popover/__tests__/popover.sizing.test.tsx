import { describe, expect, it } from 'vitest';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover sizing', () => {
	it('writes the size props as the internal custom properties, numbers as px', async () => {
		renderPopover({ width: 320, maxWidth: '37.5rem', maxHeight: 254 });
		const popup = await openPopover();

		expect(popup.style.getPropertyValue('--popover-internal-inline-size')).toBe('320px');
		expect(popup.style.getPropertyValue('--popover-internal-max-inline-size')).toBe('37.5rem');
		expect(popup.style.getPropertyValue('--popover-internal-max-block-size')).toBe('254px');
	});

	it('writes none of them by default', async () => {
		renderPopover();
		const popup = await openPopover();

		expect(popup.style.getPropertyValue('--popover-internal-inline-size')).toBe('');
		expect(popup.style.getPropertyValue('--popover-internal-max-inline-size')).toBe('');
		expect(popup.style.getPropertyValue('--popover-internal-max-block-size')).toBe('');
	});
});
