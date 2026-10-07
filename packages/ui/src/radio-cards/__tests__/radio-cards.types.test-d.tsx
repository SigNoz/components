/**
 * Type-level tests for the props of {@link RadioCards} and `RadioCards.Multiple`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and by `pnpm type-check`.
 *
 * Each case either compiles, or is marked `@ts-expect-error` because we refuse that combination.
 * TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening a constraint
 * by accident fails the build. Keep every prop on the opening tag line: once oxfmt breaks the props
 * one per line, a prop-level error moves off the tag line and the comment stops covering it.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';

const ITEMS: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs' },
	{ label: 'Traces', value: 'traces' },
];
const noop = (): void => {};
const groupRef = createRef<HTMLDivElement>();
declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;
declare const maybeClear: boolean;
declare const pick: (value: string) => void;
declare const pickOrClear: (value: string | null) => void;

describe('the group name', () => {
	test('accepts aria-label or aria-labelledby', () => {
		assertType(<RadioCards aria-label="Signal" items={ITEMS} />);
		assertType(<RadioCards aria-labelledby="question" items={ITEMS} />);
		assertType(<RadioCards.Multiple aria-label="Tools" items={ITEMS} />);
	});

	test('is required', () => {
		// @ts-expect-error - a group without a name reads a list of answers to a question nobody asked
		assertType(<RadioCards items={ITEMS} />);
	});

	test('is required on Multiple too', () => {
		// @ts-expect-error - the Multiple group needs a name as much as the single one
		assertType(<RadioCards.Multiple items={ITEMS} />);
	});
});

describe('items', () => {
	test('is required', () => {
		// @ts-expect-error - a group with nothing to pick from is not allowed
		assertType(<RadioCards aria-label="Signal" />);
	});

	test('accepts a readonly list, such as one declared `as const`', () => {
		const signals = [
			{ label: 'Logs', value: 'logs' },
			{ label: 'Traces', value: 'traces', disabled: true, disabledTooltip: 'Soon' },
		] as const;
		const checked: readonly string[] = ['logs'];

		assertType(<RadioCards aria-label="Signal" items={signals} />);
		assertType(
			<RadioCards.Multiple aria-label="Tools" items={signals} value={checked} onChange={noop} />,
		);
		assertType(<RadioCards.Multiple aria-label="Tools" items={signals} defaultValue={checked} />);
	});

	test('accepts a label, a value, an icon and a testId', () => {
		assertType<RadioCardsItemType>({
			label: 'Logs',
			value: 'logs',
			prefix: <svg />,
			testId: 'logs',
		});
	});

	test('rejects an icon that is not an element', () => {
		// @ts-expect-error - `prefix` is an icon slot, not text
		assertType<RadioCardsItemType>({ label: 'Logs', value: 'logs', prefix: 'L' });
	});

	test('rejects a disabled card without a reason', () => {
		// @ts-expect-error - a disabled card has to tell the user why it cannot be picked
		assertType<RadioCardsItemType>({ label: 'Logs', value: 'logs', disabled: true });
	});

	test('rejects a card reason without a disabled card', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType<RadioCardsItemType>({ label: 'Logs', value: 'logs', disabledTooltip: 'Why' });
	});

	test('rejects a suffix', () => {
		// @ts-expect-error - the slot after the label holds the check
		assertType<RadioCardsItemType>({ label: 'Logs', value: 'logs', suffix: <svg /> });
	});

	test('rejects a suffix written at the call site', () => {
		// @ts-expect-error - the props are inferred, so only the item type catches it
		assertType(<RadioCards aria-label="S" items={[{ label: 'L', value: 'l', suffix: <svg /> }]} />);
	});
});

describe('disabled and disabledTooltip', () => {
	test('accepts the pair, and an explicit undefined reason', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} disabled disabledTooltip="Why" />);
		assertType(<RadioCards aria-label="S" items={ITEMS} disabled disabledTooltip={undefined} />);
	});

	test('a possibly undefined disabled still needs a reason', () => {
		// @ts-expect-error - `disabled` typed `boolean | undefined` is still `disabled`
		assertType(<RadioCards aria-label="S" items={ITEMS} disabled={maybeDisabled} />);
	});

	test('disabled without a reason is rejected', () => {
		// @ts-expect-error - a disabled group must explain itself through `disabledTooltip`
		assertType(<RadioCards aria-label="S" items={ITEMS} disabled />);
	});

	test('a reason without disabled is rejected', () => {
		// @ts-expect-error - `disabledTooltip` never renders unless `disabled` is set
		assertType(<RadioCards aria-label="S" items={ITEMS} disabledTooltip="Why" />);
	});

	test('the pairing holds on Multiple', () => {
		// @ts-expect-error - a disabled Multiple group must explain itself too
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} disabled />);
	});
});

describe('readOnly and readOnlyTooltip', () => {
	test('accepts the pair, and an explicit undefined reason', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} readOnly readOnlyTooltip="Saving" />);
		assertType(<RadioCards aria-label="S" items={ITEMS} readOnly readOnlyTooltip={undefined} />);
	});

	test('a possibly undefined readOnly still needs a reason', () => {
		// @ts-expect-error - `readOnly` typed `boolean | undefined` is still `readOnly`
		assertType(<RadioCards aria-label="S" items={ITEMS} readOnly={maybeReadOnly} />);
	});

	test('readOnly without a reason is rejected', () => {
		// @ts-expect-error - a locked group must explain itself through `readOnlyTooltip`
		assertType(<RadioCards aria-label="S" items={ITEMS} readOnly />);
	});

	test('a reason without readOnly is rejected', () => {
		// @ts-expect-error - `readOnlyTooltip` never renders unless `readOnly` is set
		assertType(<RadioCards aria-label="S" items={ITEMS} readOnlyTooltip="Saving" />);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value, including the empty one', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} value="logs" onChange={noop} />);
		assertType(<RadioCards aria-label="S" items={ITEMS} value={null} onChange={noop} />);
	});

	test('hands onChange the checked value', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} onChange={(v: string) => v} />);
	});

	test('rejects a list on the single group', () => {
		// @ts-expect-error - the single group holds one value, use `RadioCards.Multiple` for several
		assertType(<RadioCards aria-label="S" items={ITEMS} defaultValue={['logs']} />);
	});

	test('takes a list on Multiple', () => {
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} value={[]} onChange={noop} />);
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} onChange={(v: string[]) => v} />);
	});

	test('rejects a single value on Multiple', () => {
		// @ts-expect-error - `RadioCards.Multiple` holds the list of checked values
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} defaultValue="logs" />);
	});
});

describe('allowClear', () => {
	test('hands a string to an inline onChange', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} onChange={(v) => assertType<string>(v)} />);
	});

	test('hands null to an inline onChange of a group that can be emptied', () => {
		// @ts-expect-error - `v` is `string | null`, so it has no `length` until the call site checks
		assertType(<RadioCards aria-label="S" items={ITEMS} allowClear onChange={(v) => v.length} />);
	});

	test('hands null to an onChange that takes it', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} allowClear onChange={pickOrClear} />);
		assertType(<RadioCards aria-label="S" items={ITEMS} allowClear={false} onChange={pick} />);
		assertType(
			<RadioCards aria-label="S" items={ITEMS} allowClear={maybeClear} onChange={pickOrClear} />,
		);
	});

	test('rejects an onChange that cannot take null', () => {
		// @ts-expect-error - a group that can be emptied reports `null`
		assertType(<RadioCards aria-label="S" items={ITEMS} allowClear onChange={pick} />);
	});

	test('rejects an onChange that cannot take null when allowClear is decided at run time', () => {
		// @ts-expect-error - `allowClear` typed `boolean` may empty the group
		assertType(<RadioCards aria-label="S" items={ITEMS} allowClear={maybeClear} onChange={pick} />);
	});

	test('keeps the list on Multiple', () => {
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} allowClear onChange={noop} />);
	});
});

describe('test ids', () => {
	test('accepts testId and arbitrary data attributes', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} testId="signal" data-state="open" />);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, it survives the tooltip trigger cloning the group
		assertType(<RadioCards aria-label="S" items={ITEMS} data-testid="signal" />);
	});
});

describe('remaining props', () => {
	test('accepts the layout and form ones', () => {
		assertType(<RadioCards aria-label="S" items={ITEMS} columns={2} textOverflow="wrap" />);
		assertType(<RadioCards aria-label="S" items={ITEMS} name="s" form="f" required id="s" />);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - a card has no `visible` overflow, the label would paint outside the border
		assertType(<RadioCards aria-label="S" items={ITEMS} textOverflow="visible" />);
	});

	test('rejects color, a checked card always uses primary', () => {
		// @ts-expect-error - `color` is not a prop
		assertType(<RadioCards aria-label="S" items={ITEMS} color="primary" />);
	});

	test('rejects onValueChange, the input callback is onChange', () => {
		// @ts-expect-error - `onValueChange` is not a prop
		assertType(<RadioCards aria-label="S" items={ITEMS} onValueChange={noop} />);
	});

	test('rejects allValues on Multiple', () => {
		// @ts-expect-error - `allValues` is not a prop, there is no parent checkbox
		assertType(<RadioCards.Multiple aria-label="T" items={ITEMS} allValues={[]} />);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(<RadioCards key="s" ref={groupRef} aria-label="S" items={ITEMS} />);
		assertType(<RadioCards.Multiple ref={groupRef} aria-label="T" items={ITEMS} />);
	});

	test('rejects children, the group renders from items', () => {
		assertType(
			// @ts-expect-error - there is no slot to compose into, pass `items` instead
			<RadioCards aria-label="S" items={ITEMS}>
				<span />
			</RadioCards>,
		);
	});

	test('rejects className and style, the layout comes from columns and the parent', () => {
		// @ts-expect-error - `className` is not a prop
		assertType(<RadioCards aria-label="S" items={ITEMS} className="x" />);
		// @ts-expect-error - `style` is not a prop
		assertType(<RadioCards aria-label="S" items={ITEMS} style={{}} />);
	});
});
