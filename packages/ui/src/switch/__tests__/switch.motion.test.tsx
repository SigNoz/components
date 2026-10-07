import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';

import { Switch } from '../switch.js';

async function emulateReducedMotion(reduce: boolean): Promise<void> {
	await cdp().send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }],
	});
}

afterEach(async () => {
	await emulateReducedMotion(false);
});

function renderSwitch(): { track: HTMLElement; thumb: HTMLElement } {
	render(<Switch color="primary" textPlacement="right" aria-label="Wrap text" testId="switch" />);
	const track = screen.getByTestId('switch');
	const thumb = track.querySelector<HTMLElement>('[data-slot="switch-thumb"]');
	if (!thumb) throw new Error('no thumb');
	return { track, thumb };
}

// Storybook's `motion: 'still'` default freezes every transition, which is what made the switch
// read as abrupt there. These pin the library side: the motion exists, and it yields to the OS.
describe('Switch motion', () => {
	it('fades the track and slides the knob', () => {
		const { track, thumb } = renderSwitch();

		expect(getComputedStyle(track).transitionProperty).toBe('background-color');
		expect(getComputedStyle(track).transitionDuration).toBe('0.15s');
		expect(getComputedStyle(thumb).transitionProperty).toBe('translate, inline-size');
		expect(getComputedStyle(thumb).transitionDuration).toBe('0.15s, 0.15s');
	});

	it('drops both transitions under prefers-reduced-motion', async () => {
		await emulateReducedMotion(true);
		const { track, thumb } = renderSwitch();

		expect(getComputedStyle(track).transitionDuration).toBe('0s');
		expect(getComputedStyle(thumb).transitionDuration).toBe('0s');
	});
});
