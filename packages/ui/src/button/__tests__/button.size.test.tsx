import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Button } from '../button.js';

/**
 * The design tokens are not loaded here, so the spacing steps the sizes read are declared in the
 * test, with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function Icon() {
	return <svg aria-hidden="true" viewBox="0 0 16 16" />;
}

function slot(name: string): Element {
	const element = document.querySelector(`[data-slot="${name}"]`);
	if (!element) {
		throw new Error(`No ${name} slot rendered`);
	}
	return element;
}

function rectOf(name: string): DOMRect {
	return slot(name).getBoundingClientRect();
}

/** Space between the prefix wrapper and the label, which is where the button's gap lands. */
function prefixToLabel(): number {
	return rectOf('button-label').left - rectOf('button-prefix-wrapper').right;
}

/** Space between the button's border box and its label. */
function edgeToLabel(): number {
	return rectOf('button-label').left - screen.getByRole('button').getBoundingClientRect().left;
}

describe('Button height', () => {
	it('is 24px for an sm link, which has no padding', () => {
		render(
			<Button size="sm" variant="link" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button').getBoundingClientRect().height).toBe(24);
	});

	it('holds an md link icon at 24px in a flex column shorter than it', () => {
		render(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: 10,
					['--button-flex-shrink' as string]: 1,
				}}
			>
				<Button size="md" variant="link" color="primary" icon aria-label="Star">
					<Icon />
				</Button>
			</div>,
		);

		expect(screen.getByRole('button').getBoundingClientRect().height).toBe(24);
	});

	it('still takes --button-height on an md link', () => {
		render(
			<div style={{ ['--button-height' as string]: '40px' }}>
				<Button size="md" variant="link" color="primary">
					Label
				</Button>
			</div>,
		);

		expect(screen.getByRole('button').getBoundingClientRect().height).toBe(40);
	});
});

describe('Button icon-to-label gap', () => {
	it('stays 6px for an sm link', () => {
		render(
			<Button size="sm" variant="link" color="primary" prefix={<Icon />}>
				Label
			</Button>,
		);

		expect(getComputedStyle(screen.getByRole('button')).columnGap).toBe('6px');
		expect(prefixToLabel()).toBeCloseTo(6, 1);
	});

	it('still takes --button-gap', () => {
		render(
			<div style={{ ['--button-gap' as string]: '2px' }}>
				<Button size="md" variant="solid" color="primary" prefix={<Icon />}>
					Label
				</Button>
			</div>,
		);

		expect(prefixToLabel()).toBeCloseTo(2, 1);
	});
});

describe('Button collapsed prefix', () => {
	it('gives the md link gap back, so the label sits on the content edge', () => {
		render(
			<Button size="md" variant="link" color="primary">
				Label
			</Button>,
		);

		// A link sets no padding of its own, so the content edge is wherever the host page's button
		// reset leaves it (Chromium's UA padding here).
		const padding = Number.parseFloat(getComputedStyle(screen.getByRole('button')).paddingLeft);

		expect(getComputedStyle(slot('button-prefix-wrapper')).marginInlineEnd).toBe('-6px');
		expect(edgeToLabel()).toBeCloseTo(padding, 1);
	});

	it('gives back the gap --button-gap sets, not the size default', () => {
		render(
			<div style={{ ['--button-gap' as string]: '2px' }}>
				<Button size="md" variant="solid" color="primary">
					Label
				</Button>
			</div>,
		);

		const padding = Number.parseFloat(getComputedStyle(screen.getByRole('button')).paddingLeft);

		expect(getComputedStyle(slot('button-prefix-wrapper')).marginInlineEnd).toBe('-2px');
		expect(edgeToLabel()).toBeCloseTo(padding, 1);
	});
});
