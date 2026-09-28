/**
 * Type-level tests for the props of {@link RadioGroup}.
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
 * right above the opening `<RadioGroup` tag. Keep every prop on that opening tag line: once oxfmt
 * breaks the props one per line, a prop-level error moves off the tag line and the comment stops
 * covering it. The same holds for the item cases, where the object literal has to open on the
 * `assertType` line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];
const noop = (): void => {};
const groupRef = createRef<HTMLDivElement>();
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;

describe('items', () => {
	test('is required', () => {
		// @ts-expect-error - a radio group with nothing to pick from is not allowed
		assertType(<RadioGroup color="primary" />);
	});

	test('accepts a label, a value and a testId', () => {
		assertType<RadioGroupItemType>({ label: 'Staging', value: 'staging', testId: 'staging' });
	});

	test('rejects an item without a value', () => {
		// @ts-expect-error - `value` is what `onChange` reports, it cannot be left out
		assertType<RadioGroupItemType>({ label: 'Staging' });
	});

	test('accepts a disabled item with its reason', () => {
		assertType<RadioGroupItemType>({
			label: 'Staging',
			value: 'staging',
			disabled: true,
			disabledTooltip: 'Ask an admin',
		});
	});

	test('rejects a disabled item without a reason', () => {
		// @ts-expect-error - a disabled item has to tell the user why it cannot be picked
		assertType<RadioGroupItemType>({ label: 'Staging', value: 'staging', disabled: true });
	});

	test('rejects an item reason without a disabled item', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType<RadioGroupItemType>({ label: 'S', value: 's', disabledTooltip: 'Why' });
	});
});

describe('color', () => {
	test('accepts every RadioGroupColor', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} />);
		assertType(<RadioGroup color="secondary" items={ITEMS} />);
		assertType(<RadioGroup color="danger" items={ITEMS} />);
		assertType(<RadioGroup color="warning" items={ITEMS} />);
		assertType(<RadioGroup color="success" items={ITEMS} />);
		assertType(<RadioGroup color="info" items={ITEMS} />);
		assertType(<RadioGroup color="archive" items={ITEMS} />);
		assertType(<RadioGroup color="highlight-danger" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - `color` has no default, it must be picked explicitly
		assertType(<RadioGroup items={ITEMS} />);
	});

	test('rejects a color outside the palette', () => {
		// @ts-expect-error - `forest` is not a RadioGroupColor
		assertType(<RadioGroup color="forest" items={ITEMS} />);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} disabled disabledTooltip="Why" />);
		assertType(<RadioGroup color="primary" items={ITEMS} disabled={false} disabledTooltip="Why" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} disabled disabledTooltip={undefined} />);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
		assertType(<RadioGroup color="primary" items={ITEMS} disabled={maybeDisabled} />);
	});

	test('disabled without a reason is rejected', () => {
		// @ts-expect-error - a disabled group must explain itself through `disabledTooltip`
		assertType(<RadioGroup color="primary" items={ITEMS} disabled />);
	});

	test('a reason without disabled is rejected', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<RadioGroup color="primary" items={ITEMS} disabledTooltip="Why" />);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} readOnly readOnlyTooltip="Saving" />);
	});

	test('accepts an explicit undefined reason as the opt-out', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} readOnly readOnlyTooltip={undefined} />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<RadioGroup color="primary" items={ITEMS} readOnly={maybeReadOnly} />);
	});

	test('readOnly without a reason is rejected', () => {
		// @ts-expect-error - a locked group must explain itself through `readOnlyTooltip`
		assertType(<RadioGroup color="primary" items={ITEMS} readOnly />);
	});

	test('a reason without readOnly is rejected', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<RadioGroup color="primary" items={ITEMS} readOnlyTooltip="Saving" />);
	});

	test('both pairs live together', () => {
		assertType(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip="Why"
				readOnly
				readOnlyTooltip="Saving"
			/>,
		);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value, including the empty one', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} value="staging" onChange={noop} />);
		assertType(<RadioGroup color="primary" items={ITEMS} value={null} onChange={noop} />);
	});

	test('accepts an uncontrolled default', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} defaultValue="staging" />);
	});

	test('rejects a null default, an uncontrolled group starts empty on its own', () => {
		// @ts-expect-error - drop `defaultValue` for an empty group
		assertType(<RadioGroup color="primary" items={ITEMS} defaultValue={null} />);
	});

	test('hands onChange the picked value, never the empty one', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} onChange={(v: string) => v} />);
	});

	test('accepts a handler that also takes the empty value, it is simply never called with it', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} onChange={(v: string | null) => v} />);
	});
});

describe('children', () => {
	test('are rejected, the group renders from items', () => {
		assertType(
			// @ts-expect-error - there is no slot to compose into, pass `items` instead
			<RadioGroup color="primary" items={ITEMS}>
				<span />
			</RadioGroup>,
		);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} testId="env" data-state="open" />);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the group
		assertType(<RadioGroup color="primary" items={ITEMS} data-testid="env" />);
	});
});

describe('remaining props', () => {
	test('accepts the presentational and native ones', () => {
		assertType(<RadioGroup color="primary" items={ITEMS} textOverflow="wrap" name="env" />);
		assertType(<RadioGroup color="primary" items={ITEMS} textOverflow="hidden" required />);
		assertType(<RadioGroup color="primary" items={ITEMS} textOverflow="visible" />);
		assertType(<RadioGroup color="primary" items={ITEMS} id="env" aria-label="Environment" />);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - `clip` is not a RadioGroupTextOverflow
		assertType(<RadioGroup color="primary" items={ITEMS} textOverflow="clip" />);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(<RadioGroup key="row" ref={groupRef} color="primary" items={ITEMS} />);
	});

	test('rejects a misspelled prop', () => {
		// @ts-expect-error - `onChage` is not a prop, a generic `T extends RadioGroupProps` would let it through
		assertType(<RadioGroup color="primary" items={ITEMS} onChage={noop} />);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		// @ts-expect-error - `className` is not a prop
		assertType(<RadioGroup color="primary" items={ITEMS} className="x" />);
		// @ts-expect-error - `style` is not a prop
		assertType(<RadioGroup color="primary" items={ITEMS} style={{}} />);
	});
});
