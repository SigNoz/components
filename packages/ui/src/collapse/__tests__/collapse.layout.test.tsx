import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { Collapse } from '../collapse.js';

// The design tokens are not loaded in the unit tests, so the ones the header reads are set here.
const TOKENS = {
	'--spacing-16': '32px',
	'--spacing-4': '8px',
	'--spacing-7': '14px',
	'--label-base-500-font-size': '14px',
	'--label-base-500-line-height': '1',
	'--paragraph-base-400-line-height': '20px',
	'--paragraph-base-500-font-size': '14px',
	'--paragraph-base-500-line-height': '20px',
	'--spacing-1': '2px',
	'--spacing-2': '4px',
	'--spacing-3': '6px',
} as Record<string, string>;

function centreY(element: Element | null): number {
	if (element === null) {
		throw new Error('The element is not rendered');
	}

	const rect = element.getBoundingClientRect();

	return rect.top + rect.height / 2;
}

function chevronOf(testId: string): Element | null {
	return screen.getByTestId(`${testId}-toggle`).querySelector('[data-slot="collapse-chevron"]');
}

function control(height: number): ReactElement {
	return <span data-testid="control" style={{ display: 'block', width: 20, height }} />;
}

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

	it('centres a one line title against a suffix taller than the header', () => {
		render(
			<div style={TOKENS}>
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					title="Advanced"
					headerSuffix={control(40)}
				>
					Body
				</Collapse>
			</div>,
		);

		expect(centreY(screen.getByTestId('control'))).toBeCloseTo(centreY(chevronOf('c')), 0);
	});

	it('lines the suffix up with the title, not the description', () => {
		render(
			<div style={{ ...TOKENS, width: 240 }}>
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					title="Google OAuth"
					description="The client ID and the secret from the Google Cloud console, used to sign in."
					headerSuffix={control(20)}
				>
					Body
				</Collapse>
			</div>,
		);

		expect(centreY(screen.getByTestId('control'))).toBeCloseTo(centreY(chevronOf('c')), 0);
	});

	it('lines the suffix up with the first line of a wrapped title', () => {
		render(
			<div style={{ ...TOKENS, width: 200 }}>
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					textOverflow="wrap"
					title="A section title long enough to take three lines"
					headerSuffix={control(20)}
				>
					Body
				</Collapse>
			</div>,
		);

		expect(centreY(screen.getByTestId('control'))).toBeCloseTo(centreY(chevronOf('c')), 0);
	});

	it('sets a wrapped title in one paragraph style, all six properties', () => {
		const label = {
			'--label-base-500-font-family': 'monospace',
			'--label-base-500-font-weight': '400',
			'--label-base-500-letter-spacing': '1px',
			'--label-base-500-text-transform': 'uppercase',
		};
		const paragraph = {
			'--paragraph-base-500-font-family': 'serif',
			'--paragraph-base-500-font-size': '15px',
			'--paragraph-base-500-font-weight': '600',
			'--paragraph-base-500-line-height': '22px',
			'--paragraph-base-500-letter-spacing': '2px',
			'--paragraph-base-500-text-transform': 'lowercase',
		};

		render(
			<div style={{ ...TOKENS, ...label, ...paragraph } as Record<string, string>}>
				<Collapse variant="outlined" size="sm" testId="c" textOverflow="wrap" title="Advanced">
					Body
				</Collapse>
			</div>,
		);

		const title = screen.getByTestId('c-toggle').querySelector('[data-slot="collapse-title"]');
		const style = title === null ? null : getComputedStyle(title);

		expect({
			fontFamily: style?.fontFamily,
			fontSize: style?.fontSize,
			fontWeight: style?.fontWeight,
			lineHeight: style?.lineHeight,
			letterSpacing: style?.letterSpacing,
			textTransform: style?.textTransform,
		}).toEqual({
			fontFamily: 'serif',
			fontSize: '15px',
			fontWeight: '600',
			lineHeight: '22px',
			letterSpacing: '2px',
			textTransform: 'lowercase',
		});
	});
});
