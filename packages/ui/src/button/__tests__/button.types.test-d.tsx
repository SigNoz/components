/**
 * Type-level tests for the props of {@link Button}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that combination. TypeScript
 * reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident
 * fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, which is why it sits inside `assertType(...)`
 * right above the opening `<Button` tag. Keep every prop on that opening tag line: once oxfmt breaks
 * the props one per line, a prop-level error moves off the tag line and the comment stops covering
 * it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Button } from '../button.js';

const icon = <span data-testid="icon" />;
const noop = (): void => {};
const buttonRef = createRef<HTMLButtonElement>();
declare const maybeDisabled: boolean | undefined;

describe('size', () => {
	test('accepts every ButtonSize', () => {
		assertType(
			<Button size="sm" variant="solid" color="primary">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);
	});

	test('is required', () => {
		assertType(
			// @ts-expect-error - `size` has no default, it must be picked explicitly
			<Button variant="solid" color="primary">
				Label
			</Button>,
		);
	});

	test('rejects a size outside the scale', () => {
		assertType(
			// @ts-expect-error - `lg` is not a ButtonSize
			<Button size="lg" variant="solid" color="primary">
				Label
			</Button>,
		);
	});
});

describe('variant and color', () => {
	test('solid and link accept every color', () => {
		assertType(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="danger">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="warning">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="success">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="link" color="secondary">
				Label
			</Button>,
		);
	});

	test('outlined, ghost and dashed accept secondary', () => {
		assertType(
			<Button size="md" variant="outlined" color="secondary">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="ghost" color="secondary">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="dashed" color="secondary">
				Label
			</Button>,
		);
	});

	test('outlined, ghost and dashed reject every other color', () => {
		assertType(
			// @ts-expect-error - `outlined` only has a secondary treatment
			<Button size="md" variant="outlined" color="primary">
				Label
			</Button>,
		);
		assertType(
			// @ts-expect-error - `ghost` only has a secondary treatment
			<Button size="md" variant="ghost" color="danger">
				Label
			</Button>,
		);
		assertType(
			// @ts-expect-error - `dashed` only has a secondary treatment
			<Button size="md" variant="dashed" color="warning">
				Label
			</Button>,
		);
	});

	test('both are required', () => {
		assertType(
			// @ts-expect-error - `variant` has no default
			<Button size="md" color="primary">
				Label
			</Button>,
		);
		assertType(
			// @ts-expect-error - `color` has no default
			<Button size="md" variant="solid">
				Label
			</Button>,
		);
	});

	test('rejects a variant outside the set', () => {
		assertType(
			// @ts-expect-error - `elevated` is not a ButtonVariant
			<Button size="md" variant="elevated" color="primary">
				Label
			</Button>,
		);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip="Why">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary" disabled={false} disabledTooltip="Why">
				Label
			</Button>,
		);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={undefined}>
				Label
			</Button>,
		);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		assertType(
			// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
			<Button size="md" variant="solid" color="primary" disabled={maybeDisabled}>
				Label
			</Button>,
		);
	});

	test('disabled without a reason is rejected', () => {
		assertType(
			// @ts-expect-error - a disabled button must explain itself through `disabledTooltip`
			<Button size="md" variant="solid" color="primary" disabled>
				Label
			</Button>,
		);
	});

	test('a reason without disabled is rejected', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
			<Button size="md" variant="solid" color="primary" disabledTooltip="Why">
				Label
			</Button>,
		);
	});
});

describe('icon mode', () => {
	test('accepts an icon with an accessible name', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" icon aria-label="More actions">
				{icon}
			</Button>,
		);
	});

	test('an icon without an accessible name is rejected', () => {
		assertType(
			// @ts-expect-error - an icon button has no visible text, so `aria-label` is required
			<Button size="md" variant="solid" color="primary" icon>
				{icon}
			</Button>,
		);
	});

	test('prefix and suffix are rejected, the children are the icon', () => {
		assertType(
			// @ts-expect-error - `prefix` has no slot to render into in icon mode
			<Button size="md" variant="solid" color="primary" icon aria-label="M" prefix={icon}>
				{icon}
			</Button>,
		);
		assertType(
			// @ts-expect-error - `suffix` has no slot to render into in icon mode
			<Button size="md" variant="solid" color="primary" icon aria-label="M" suffix={icon}>
				{icon}
			</Button>,
		);
	});

	test('text children are rejected', () => {
		assertType(
			// @ts-expect-error - icon mode renders an element, not a label
			<Button size="md" variant="solid" color="primary" icon aria-label="More">
				Label
			</Button>,
		);
	});

	test('children are required', () => {
		assertType(
			// @ts-expect-error - a button with nothing inside it is not allowed
			<Button size="md" variant="solid" color="primary" icon aria-label="More" />,
		);
	});

	test('icon only accepts true', () => {
		assertType(
			// @ts-expect-error - drop the prop for a text button, `icon={false}` is not a mode
			<Button size="md" variant="solid" color="primary" icon={false}>
				Label
			</Button>,
		);
	});
});

describe('prefix, suffix and children', () => {
	test('accepts either affix', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" prefix={icon}>
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary" suffix={icon}>
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary" prefix={icon} suffix={icon}>
				Label
			</Button>,
		);
	});

	test('children are required', () => {
		assertType(
			// @ts-expect-error - a button with nothing inside it is not allowed
			<Button size="md" variant="solid" color="primary" />,
		);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" testId="submit" data-state="open">
				Label
			</Button>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the button
			<Button size="md" variant="solid" color="primary" data-testid="submit">
				Label
			</Button>,
		);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<Button key="row" ref={buttonRef} size="md" variant="solid" color="primary">
				Label
			</Button>,
		);
	});

	test('accepts the forwarded focus and pointer handlers', () => {
		assertType(
			<Button
				size="md"
				variant="solid"
				color="primary"
				onFocus={noop}
				onBlur={noop}
				onMouseEnter={noop}
				onMouseLeave={noop}
			>
				Label
			</Button>,
		);
	});

	test('rejects a misspelled prop', () => {
		assertType(
			// @ts-expect-error - `onClik` is not a prop, a generic `T extends ButtonProps` alone would let it through
			<Button size="md" variant="solid" color="primary" onClik={noop}>
				Label
			</Button>,
		);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and native ones', () => {
		assertType(
			<Button size="md" variant="solid" color="primary" textOverflow="none" loading>
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary" width="10rem" maxWidth="20rem">
				Label
			</Button>,
		);
		assertType(
			<Button size="md" variant="solid" color="primary" type="submit" aria-describedby="hint">
				Label
			</Button>,
		);
	});

	test('rejects a textOverflow outside the set', () => {
		assertType(
			// @ts-expect-error - `clip` is not a ButtonTextOverflow
			<Button size="md" variant="solid" color="primary" textOverflow="clip">
				Label
			</Button>,
		);
	});
});
