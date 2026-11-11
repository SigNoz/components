import { setTokens } from '../../__tests__/test-utils.js';

const SPACING_STEPS: Record<number, number> = {
	0: 0,
	1: 2,
	2: 4,
	3: 6,
	4: 8,
	5: 10,
	6: 12,
	7: 14,
	8: 16,
	10: 20,
	12: 24,
	16: 32,
	20: 40,
	24: 48,
	32: 64,
	40: 80,
	48: 96,
	56: 112,
	64: 128,
};

/**
 * Declares the spacing scale, the radius and the line heights on `:root` for the current test, so
 * the layout of the card can be measured. The design tokens are not loaded in a unit test.
 */
export function setCardTokens(): void {
	const spacing = Object.entries(SPACING_STEPS)
		.map(([step, px]) => `--spacing-${step}: ${px}px;`)
		.join('\n');

	setTokens(`
		${spacing}
		--radius-2: 4px;
		--paragraph-base-400-line-height: 20px;
		--paragraph-base-500-line-height: 20px;
	`);
}

/**
 * The value of a `--card-internal-*` custom property written on the root.
 */
export function internal(root: HTMLElement, name: string): string {
	return root.style.getPropertyValue(`--card-internal-${name}`);
}

/**
 * The `data-slot` of each element child of `element`, in order.
 */
export function slotsOf(element: Element): Array<string | undefined> {
	return Array.from(element.children).map((child) => (child as HTMLElement).dataset['slot']);
}
