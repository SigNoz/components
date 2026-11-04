/**
 * Type-level tests for the props of {@link Kbd} and `Kbd.Shortcut`.
 *
 * Run by `vitest --typecheck` and by `pnpm type-check`. Each case either compiles or is marked
 * `@ts-expect-error`. Keep every prop on the opening tag line, so the directive covers the error.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Kbd } from '../kbd.js';
import type { KbdDisplayType, KbdKey } from '../types.js';

const ref = createRef<HTMLElement>();
declare const dynamicKey: string;
declare const keys: KbdKey[];
declare const dynamicDisplay: KbdDisplayType;

describe('value', () => {
	test('accepts a named key, Mod and one character', () => {
		assertType(<Kbd value="Escape" />);
		assertType(<Kbd value="Mod" />);
		assertType(<Kbd value="K" />);
		assertType(<Kbd value="/" />);
		assertType(<Kbd value="+" />);
		assertType(<Kbd value="[" />);
		assertType(<Kbd.Shortcut keys={['Mod', '-']} />);
		assertType(<Kbd value={dynamicKey} ref={ref} />);
	});

	test('is required', () => {
		// @ts-expect-error - value is required
		assertType(<Kbd />);
	});

	test('rejects a word', () => {
		// @ts-expect-error - a key holds one character
		assertType(<Kbd value="esc" />);
	});

	test('rejects a space', () => {
		// @ts-expect-error - a key holds one visible character
		assertType(<Kbd value=" " />);
	});
});

describe('pressed', () => {
	test('accepts a boolean on a key and on a shortcut', () => {
		assertType(<Kbd value="K" pressed />);
		assertType(<Kbd value="K" pressed={false} disabled />);
		assertType(<Kbd.Shortcut keys={['Mod', 'K']} pressed />);
		assertType(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" pressed={false} disabled />);
	});

	test('rejects anything but a boolean', () => {
		// @ts-expect-error - a key takes pressed as a boolean
		assertType(<Kbd value="K" pressed="yes" />);
		// @ts-expect-error - a shortcut takes pressed as a boolean
		assertType(<Kbd.Shortcut keys={['Mod', 'K']} pressed="yes" />);
	});
});

describe('rejected props', () => {
	test('rejects children', () => {
		// @ts-expect-error - the key comes from value
		assertType(<Kbd value="Escape">esc</Kbd>);
	});

	test('rejects className and style', () => {
		// @ts-expect-error - className is not a prop
		assertType(<Kbd value="K" className="x" />);
		// @ts-expect-error - style is not a prop
		assertType(<Kbd value="K" style={{}} />);
	});

	test('rejects size, active and asChild', () => {
		// @ts-expect-error - size is gone
		assertType(<Kbd value="K" size="sm" />);
		// @ts-expect-error - active is gone
		assertType(<Kbd value="K" active />);
		// @ts-expect-error - asChild is gone
		assertType(<Kbd value="K" asChild />);
	});

	test('rejects data-testid', () => {
		// @ts-expect-error - data-testid is written as testId
		assertType(<Kbd value="K" data-testid="key" />);
	});

	test('accepts aria-* and other data-*', () => {
		assertType(<Kbd value="K" aria-hidden data-origin="footer" testId="key" disabled />);
	});
});

describe('display and margin', () => {
	test('accepts a margin on a block key', () => {
		assertType(<Kbd value="K" display="block" margin={2} marginBottom="auto" />);
		assertType(<Kbd value="K" display="block" marginX={4} marginY={0} marginLeft={64} />);
		assertType(<Kbd value="K" display="inline" />);
	});

	test('rejects a margin on an inline key', () => {
		// @ts-expect-error - a key is inline by default
		assertType(<Kbd value="K" margin={2} />);
		// @ts-expect-error - an inline key has no margin
		assertType(<Kbd value="K" display="inline" marginTop={2} />);
	});

	test('accepts a margin when display may be block', () => {
		assertType(<Kbd value="K" display={dynamicDisplay} margin={2} />);
	});

	test('rejects a margin off the spacing scale', () => {
		// @ts-expect-error - 9 is not a step of the scale
		assertType(<Kbd value="K" display="block" margin={9} />);
		// @ts-expect-error - a margin is a step, never a length
		assertType(<Kbd value="K" display="block" margin="8px" />);
	});

	test('rejects an unknown display', () => {
		// @ts-expect-error - display is inline or block
		assertType(<Kbd value="K" display="flex" />);
	});

	test('takes the same rule on a shortcut', () => {
		assertType(<Kbd.Shortcut keys={['Mod', 'K']} display="block" marginTop={4} />);
		// @ts-expect-error - an inline shortcut has no margin
		assertType(<Kbd.Shortcut keys={['Mod', 'K']} marginTop={4} />);
	});
});

describe('Kbd.Shortcut', () => {
	test('accepts keys and a mode', () => {
		assertType(<Kbd.Shortcut keys={['Mod', 'K']} />);
		assertType(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" />);
		assertType(<Kbd.Shortcut keys={keys} ref={ref} disabled testId="open" />);
	});

	test('rejects a word among the keys', () => {
		// @ts-expect-error - a key holds one character
		assertType(<Kbd.Shortcut keys={['Mod', 'enter']} />);
	});

	test('rejects an unknown mode', () => {
		// @ts-expect-error - mode is chord or sequence
		assertType(<Kbd.Shortcut keys={['G', 'D']} mode="then" />);
	});

	test('rejects className, style and data-testid', () => {
		// @ts-expect-error - className is not a prop
		assertType(<Kbd.Shortcut keys={['K']} className="x" />);
		// @ts-expect-error - style is not a prop
		assertType(<Kbd.Shortcut keys={['K']} style={{}} />);
		// @ts-expect-error - data-testid is written as testId
		assertType(<Kbd.Shortcut keys={['K']} data-testid="x" />);
	});
});
