/**
 * Type-level tests for the props of {@link Popover}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it
 * either compiles, or it is marked `@ts-expect-error` because we refuse that combination.
 * TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening a
 * constraint by accident fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits *inside* the `assertType(...)`
 * call, right above its argument. That keeps the argument on a line of its own whatever oxfmt does
 * with the call, which the same comment above the `assertType` line would not: once the props are
 * broken one per line, the error moves off the line the comment covers.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { PopupHandle } from '../../lib/popup-handle.js';
import { Popover } from '../popover.js';

const body = <p>Body</p>;
const btn = <button type="button">Open</button>;
const ref = createRef<HTMLButtonElement>();
const virtualAnchor = { getBoundingClientRect: () => new DOMRect(0, 0, 0, 0) };
const handle = new PopupHandle<string>();

describe('root props', () => {
	test('accepts the required props, plus a ref', () => {
		assertType(
			<Popover nativeButton side="bottom" align="start" trigger={btn} ref={ref}>
				{body}
			</Popover>,
		);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Popover nativeButton side="bottom" align="start" trigger={btn} className="x">
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Popover nativeButton side="bottom" align="start" trigger={btn} style={{}}>
				{body}
			</Popover>,
		);
	});

	test('rejects a popover with no side or no align', () => {
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states it
			<Popover nativeButton align="start" trigger={btn}>
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - placement is never incidental, the call site states it
			<Popover nativeButton side="bottom" trigger={btn}>
				{body}
			</Popover>,
		);
	});

	test('rejects a popover with no trigger and no handle', () => {
		assertType(
			// @ts-expect-error - nothing could ever open it
			<Popover nativeButton side="bottom" align="start">
				{body}
			</Popover>,
		);
	});

	test('rejects a popover that does not say whether its trigger is a button', () => {
		assertType(
			// @ts-expect-error - `nativeButton` has to match the trigger, so it has no default
			<Popover side="bottom" align="start" trigger={btn}>
				{body}
			</Popover>,
		);
	});

	test('rejects `nativeButton` on a popover with no trigger to describe', () => {
		const plain = new PopupHandle();

		assertType(
			// @ts-expect-error - `nativeButton` describes the trigger, and there is none
			<Popover nativeButton side="bottom" align="start" handle={plain}>
				{body}
			</Popover>,
		);
	});

	test('rejects the logical sides', () => {
		assertType(
			// @ts-expect-error - only the four physical sides are exposed
			<Popover nativeButton side="inline-start" align="start" trigger={btn}>
				{body}
			</Popover>,
		);
	});

	test('rejects the props of the parts it owns', () => {
		assertType(
			// @ts-expect-error - a popover traps nothing; a flow that needs a trap is a Dialog
			<Popover nativeButton side="bottom" align="start" trigger={btn} modal>
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - the design has no arrow
			<Popover nativeButton side="bottom" align="start" trigger={btn} arrow>
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - Base UI flips and shifts by default
			<Popover nativeButton side="bottom" align="start" trigger={btn} collisionPadding={8}>
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - always portalled; `container` chooses where
			<Popover nativeButton side="bottom" align="start" trigger={btn} withPortal={false}>
				{body}
			</Popover>,
		);
		assertType(
			// @ts-expect-error - the popup unmounts on close
			<Popover nativeButton side="bottom" align="start" trigger={btn} keepMounted>
				{body}
			</Popover>,
		);
	});

	test('writes data-testid as testId', () => {
		assertType(
			// @ts-expect-error - `data-testid` is written as the `testId` prop
			<Popover nativeButton side="bottom" align="start" trigger={btn} data-testid="x">
				{body}
			</Popover>,
		);
	});

	test('accepts the focus props', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				initialFocus={false}
				finalFocus={false}
			>
				{body}
			</Popover>,
		);
	});
});

describe('hover mode', () => {
	test('accepts the hover delays with openOnHover', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				openOnHover
				delay={0}
				closeDelay={100}
			>
				{body}
			</Popover>,
		);
	});

	test('rejects a hover delay without openOnHover', () => {
		assertType(
			// @ts-expect-error - `delay` describes the hover timing
			<Popover nativeButton side="bottom" align="start" trigger={btn} delay={0}>
				{body}
			</Popover>,
		);
	});

	test('rejects a hover close delay without openOnHover', () => {
		assertType(
			// @ts-expect-error - `closeDelay` describes the hover timing
			<Popover nativeButton side="bottom" align="start" trigger={btn} closeDelay={100}>
				{body}
			</Popover>,
		);
	});

	test('rejects an openOn mode', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - a surface that opens on hover is a tooltip
				openOn="hover"
			>
				{body}
			</Popover>,
		);
	});

	test('rejects the old content prop', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - `children` is the popup content
				content={body}
			>
				{body}
			</Popover>,
		);
	});

	test('rejects a controlled open', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - visibility the app owns is driven by a handle
				open
			>
				{body}
			</Popover>,
		);
	});

	test('rejects defaultOpen', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - no call site starts open
				defaultOpen
			>
				{body}
			</Popover>,
		);
	});

	test('rejects the offset knobs', () => {
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - the gap is a fixed 4px
				sideOffset={8}
			>
				{body}
			</Popover>,
		);
		assertType(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={btn}
				// @ts-expect-error - the alignment offset is fixed at 0
				alignOffset={4}
			>
				{body}
			</Popover>,
		);
	});
});

describe('anchor', () => {
	test('accepts an anchor next to a trigger', () => {
		assertType(
			<Popover nativeButton side="bottom" align="start" trigger={btn} anchor={virtualAnchor}>
				{body}
			</Popover>,
		);
	});

	test('rejects a popover with neither a trigger nor a handle', () => {
		assertType(
			// @ts-expect-error - nothing could ever open it
			<Popover nativeButton side="bottom" align="start" anchor={virtualAnchor}>
				{body}
			</Popover>,
		);
	});

	test('accepts a handle instead of a trigger', () => {
		assertType(
			<Popover side="bottom" align="start" handle={handle}>
				{(payload: string | undefined) => <p>{payload}</p>}
			</Popover>,
		);
	});

	test('accepts a handle that carries no payload', () => {
		const plain = new PopupHandle();

		assertType(
			<Popover side="bottom" align="start" handle={plain} initialFocus={false}>
				{body}
			</Popover>,
		);
	});

	test('accepts a handle alongside the focus, size and open-change props', () => {
		const plain = new PopupHandle();

		assertType(
			<Popover
				side="bottom"
				align="start"
				handle={plain}
				initialFocus={false}
				finalFocus={false}
				width="var(--anchor-width)"
				maxHeight={300}
				aria-label="Insert a variable"
				onOpenChange={(open, eventDetails): void => {
					if (!open) {
						eventDetails.cancel();
					}
				}}
			>
				{body}
			</Popover>,
		);
	});
});
