import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupColorType, RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

const FILL = 'rgb(1, 2, 3)';
const DOT = 'rgb(4, 5, 6)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** The two tokens a theme supplies for one color, so a computed colour is something the test chose. */
function colorTokens(color: string): CSSProperties {
	return {
		[`--radio-group-${color}-background`]: FILL,
		[`--radio-group-${color}-dot`]: DOT,
	} as CSSProperties;
}

function renderChecked(color: RadioGroupColorType): { control: HTMLElement; dot: HTMLElement } {
	render(
		<div style={colorTokens(color)}>
			<RadioGroup color={color} items={ITEMS} defaultValue="staging" />
		</div>,
	);

	const control = screen.getByRole('radio', { name: 'Staging' });
	const dot = control.querySelector<HTMLElement>('[data-slot="radio-group-indicator"]');
	if (dot === null) {
		throw new Error('the checked radio rendered no indicator');
	}

	return { control, dot };
}

describe('RadioGroup colors', () => {
	// The secondary rule is gone from the stylesheet, so a stale call site that forces the value
	// past the types gets an unfilled dial rather than the old neutral one.
	it('no longer reads the secondary tokens', () => {
		const { control, dot } = renderChecked('secondary' as string as RadioGroupColorType);

		expect(getComputedStyle(control).backgroundColor).toBe(TRANSPARENT);
		expect(getComputedStyle(dot).backgroundColor).toBe(TRANSPARENT);
	});
});
