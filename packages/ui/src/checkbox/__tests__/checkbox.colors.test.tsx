import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../checkbox.js';
import type { CheckboxColorType } from '../types.js';

const FILL = 'rgb(1, 2, 3)';
const GLYPH = 'rgb(4, 5, 6)';
const INHERITED = 'rgb(7, 8, 9)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** The two tokens a theme supplies for one color, so a computed colour is something the test chose. */
function colorTokens(color: string): CSSProperties {
	return {
		color: INHERITED,
		[`--checkbox-${color}-background`]: FILL,
		[`--checkbox-${color}-foreground`]: GLYPH,
	} as CSSProperties;
}

function renderChecked(color: CheckboxColorType): { box: HTMLElement; glyph: HTMLElement } {
	render(
		<div style={colorTokens(color)}>
			<Checkbox color={color} testId="checkbox" aria-label="Accept the terms" defaultValue />
		</div>,
	);

	const root = screen.getByTestId('checkbox');
	const box = root.querySelector<HTMLElement>('[data-slot="checkbox-box"]');
	const glyph = root.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]');
	if (box === null || glyph === null) {
		throw new Error('the checked checkbox rendered no box or no indicator');
	}

	return { box, glyph };
}

describe('Checkbox colors', () => {
	// The secondary rule is gone from the stylesheet, so a stale call site that forces the value
	// past the types gets an unfilled box and an inherited glyph rather than the old neutral fill.
	it('no longer reads the secondary tokens', () => {
		const { box, glyph } = renderChecked('secondary' as string as CheckboxColorType);

		expect(getComputedStyle(box).backgroundColor).toBe(TRANSPARENT);
		expect(getComputedStyle(glyph).color).toBe(INHERITED);
	});
});
