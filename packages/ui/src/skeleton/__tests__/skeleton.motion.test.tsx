import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';

import { Skeleton } from '../skeleton.js';

async function emulateReducedMotion(reduce: boolean): Promise<void> {
	await cdp().send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }],
	});
}

afterEach(async () => {
	await emulateReducedMotion(false);
});

const parts: [string, (active?: boolean) => ReactElement][] = [
	['Skeleton', (active) => <Skeleton active={active} testId="part" />],
	['Skeleton.Input', (active) => <Skeleton.Input active={active} size="md" testId="part" />],
	['Skeleton.Button', (active) => <Skeleton.Button active={active} size="md" testId="part" />],
	['Skeleton.Avatar', (active) => <Skeleton.Avatar active={active} size="md" testId="part" />],
];

function shimmers(): CSSAnimation[] {
	return screen
		.getByTestId('part')
		.getAnimations({ subtree: true })
		.filter((a): a is CSSAnimation => a instanceof CSSAnimation);
}

function animatedProperties(animations: CSSAnimation[]): string[] {
	const ignored = new Set(['offset', 'computedOffset', 'easing', 'composite']);
	const properties = animations.flatMap((a) =>
		(a.effect as KeyframeEffect)
			.getKeyframes()
			.flatMap((frame) => Object.keys(frame).filter((key) => !ignored.has(key))),
	);
	return [...new Set(properties)];
}

describe('Skeleton motion', () => {
	it.each(parts)('%s plays the shimmer by default', (_, ui) => {
		render(ui());

		expect(shimmers().length).toBeGreaterThan(0);
	});

	it.each(parts)('%s plays no animation with active false', (_, ui) => {
		render(ui(false));

		expect(shimmers()).toHaveLength(0);
	});

	// Any other property, such as background-position, repaints every bar on every frame.
	it.each(parts)('%s animates only transform while active', (_, ui) => {
		render(ui(true));

		expect(shimmers().length).toBeGreaterThan(0);
		expect(animatedProperties(shimmers())).toEqual(['transform']);
	});

	it('plays the shimmer on the title and every row of a Skeleton', () => {
		render(<Skeleton paragraph={{ rows: 2 }} testId="part" />);

		expect(shimmers()).toHaveLength(3);
	});

	it('keeps the shimmer layer four bars wide from the left edge, the shape the keyframes need', () => {
		render(
			<div
				style={
					{
						'--skeleton-active-shimmer-width': '300%',
						'--skeleton-active-shimmer-left': '10px',
					} as CSSProperties
				}
			>
				<Skeleton.Button size="md" testId="part" />
			</div>,
		);
		const layer = getComputedStyle(screen.getByTestId('part'), '::after');

		expect(layer.width).toBe('256px');
		expect(layer.left).toBe('0px');
	});

	it.each(parts)('%s plays no shimmer under prefers-reduced-motion', async (_, ui) => {
		await emulateReducedMotion(true);
		render(ui(true));

		expect(shimmers()).toHaveLength(0);
	});
});
