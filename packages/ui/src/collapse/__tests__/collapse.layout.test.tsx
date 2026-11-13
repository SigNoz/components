import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Collapse } from '../collapse.js';

// The design tokens are not loaded in the unit tests, so the ones the header reads are set here.
const TOKENS = {
	'--spacing-16': '32px',
	'--spacing-4': '8px',
	'--spacing-7': '14px',
	'--label-base-500-font-size': '14px',
	'--label-base-500-line-height': '1',
} as Record<string, string>;

describe('Collapse header box', () => {
	it('centres the first line by the title font size a call site sets', () => {
		render(
			<div style={{ ...TOKENS, '--collapse-title-font-size': '24px' } as Record<string, string>}>
				<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
					Body
				</Collapse>
			</div>,
		);

		const toggle = screen.getByTestId('c-toggle');
		const chevron = toggle.querySelector<HTMLElement>('[data-slot="collapse-chevron"]');

		expect(getComputedStyle(toggle).paddingTop).toBe('4px');
		expect(chevron === null ? '' : getComputedStyle(chevron).blockSize).toBe('24px');
	});

	it('keeps the header at its min height with the token font size', () => {
		render(
			<div style={TOKENS}>
				<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
					Body
				</Collapse>
			</div>,
		);

		expect(getComputedStyle(screen.getByTestId('c-toggle')).paddingTop).toBe('9px');
	});
});
