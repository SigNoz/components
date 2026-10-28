import { Info } from '@signozhq/icons';
import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';

import { PinList } from './index.js';

/** The spacing steps and the label line height the section label height is built from. */
const TOKENS = {
	'--spacing-1': '2px',
	'--spacing-8': '16px',
	'--uppercase-small-600-line-height': '1',
} as CSSProperties;

const ITEMS = [
	{ key: '1', itemKey: '1', label: 'Logs', icon: <Info />, isPinned: true, isEnabled: true },
	{ key: '2', itemKey: '2', label: 'Traces', icon: <Info />, isPinned: false, isEnabled: true },
];

describe('PinList styling', () => {
	it('keeps both section labels 18px tall', () => {
		render(
			<div style={TOKENS}>
				<PinList items={ITEMS} shortcutsLabel="Shortcuts" moreLabel="More" />
			</div>,
		);

		for (const text of ['Shortcuts', 'More']) {
			const label = screen.getByText(text).parentElement?.closest('p, button') as HTMLElement;

			expect(label.getBoundingClientRect().height).toBe(18);
		}
	});
});
