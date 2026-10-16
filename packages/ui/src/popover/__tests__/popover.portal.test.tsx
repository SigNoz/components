import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover portal', () => {
	it('portals the popup to the body by default', async () => {
		const { container } = renderPopover();
		await openPopover();

		expect(container.querySelector('[data-slot="popover-popup"]')).toBeNull();
		expect(document.body.contains(screen.getByRole('dialog'))).toBe(true);
	});

	it('portals the popup into the container it is given', async () => {
		const target = document.createElement('div');
		document.body.appendChild(target);
		renderPopover({ container: target });
		await openPopover();

		expect(target.contains(screen.getByRole('dialog'))).toBe(true);
		target.remove();
	});

	it('takes the container as a ref', async () => {
		const target = document.createElement('div');
		document.body.appendChild(target);
		const targetRef = createRef<HTMLElement>();
		targetRef.current = target;
		renderPopover({ container: targetRef });
		await openPopover();

		expect(target.contains(screen.getByRole('dialog'))).toBe(true);
		target.remove();
	});
});
