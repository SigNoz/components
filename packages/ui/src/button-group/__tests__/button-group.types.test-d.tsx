/**
 * Type-level tests for the props of {@link ButtonGroup}.
 *
 * Run by `vitest --typecheck` and, because the file lives under `src`, also by `pnpm type-check`.
 * Each case either compiles, or is marked `@ts-expect-error` because we refuse that combination.
 * Keep every prop on the opening tag line, so the comment above it covers a prop-level error.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type {
	ButtonGroupActionItemType,
	ButtonGroupItemType,
	ButtonGroupLinkItemType,
} from '../index.js';

const noop = (): void => {};

const ITEMS: ButtonGroupItemType[] = [
	{ value: 'day', label: 'Day', onClick: noop },
	{ value: 'week', label: 'Week', onClick: noop },
];

/** The appearance and items, spread so a case still fits on the opening tag line. */
const BASE = { variant: 'outlined', color: 'secondary', size: 'md', items: ITEMS } as const;
const groupRef = createRef<HTMLDivElement>();

describe('appearance', () => {
	test('accepts outlined secondary in both sizes', () => {
		assertType(<ButtonGroup {...BASE} />);
		assertType(<ButtonGroup variant="outlined" color="secondary" size="sm" items={ITEMS} />);
	});

	test('rejects any other variant', () => {
		// @ts-expect-error - a group is built from the outlined variant only
		assertType(<ButtonGroup variant="solid" color="secondary" size="md" items={ITEMS} />);
	});

	test('rejects any other color', () => {
		// @ts-expect-error - secondary is the only colour drawn today
		assertType(<ButtonGroup variant="outlined" color="primary" size="md" items={ITEMS} />);
	});

	test('requires a size', () => {
		// @ts-expect-error - sizes never mix, so the group states its own
		assertType(<ButtonGroup variant="outlined" color="secondary" items={ITEMS} />);
	});
});

describe('items', () => {
	test('are required', () => {
		// @ts-expect-error - a group with nothing to show is not allowed
		assertType(<ButtonGroup variant="outlined" color="secondary" size="md" />);
	});

	test('take no children', () => {
		assertType(
			// @ts-expect-error - members come from `items`
			<ButtonGroup {...BASE} children={<span />} />, // eslint-disable-line react/no-children-prop -- passing `children` is the case under test
		);
	});

	test('accept a text member with its icons and handler', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			prefix: <svg />,
			suffix: <svg />,
			onClick: noop,
		});
	});

	test('accept an icon member with its name', () => {
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			ariaLabel: 'Next page',
			onClick: noop,
		});
	});

	test('reject an icon member without a name', () => {
		// @ts-expect-error - an icon has no text for a screen reader to announce
		assertType<ButtonGroupItemType>({ value: 'next', icon: <svg />, onClick: noop });
	});

	test('reject an icon member with a label', () => {
		// @ts-expect-error - an icon member has no label
		assertType<ButtonGroupItemType>({
			value: 'next',
			icon: <svg />,
			ariaLabel: 'Next',
			label: 'Next',
		});
	});

	test('accept a link member', () => {
		// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
		assertType<ButtonGroupItemType>({ value: 'docs', label: 'Docs', render: <a href="/docs" /> });
	});

	test('accept a link member with a prefix and a suffix', () => {
		assertType<ButtonGroupItemType>({
			value: 'docs',
			label: 'Docs',
			prefix: <svg />,
			suffix: <svg />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
			render: <a href="/docs" />,
		});
	});

	test('reject a button member without an onClick', () => {
		// @ts-expect-error - a member that is not a link must do something when pressed
		assertType<ButtonGroupItemType>({ value: 'day', label: 'Day' });
	});

	test('reject a link member with an onClick', () => {
		// @ts-expect-error - the handler goes on the rendered element
		assertType<ButtonGroupItemType>({
			value: 'docs',
			label: 'Docs',
			// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
			render: <a href="/docs" />,
			onClick: noop,
		});
	});

	test('reject a tooltip on a member', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			// @ts-expect-error - members carry reasons, not a free tooltip
			tooltip: 'Last 24 hours',
		});
	});

	test('reject an item without a value', () => {
		// @ts-expect-error - `value` keys the member and names its testId
		assertType<ButtonGroupItemType>({ label: 'Day', onClick: noop });
	});

	test('pair disabled with its reason', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			disabled: true,
			disabledTooltip: 'Why',
		});
		// @ts-expect-error - a disabled member has to say why
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			disabled: true,
		});
	});

	test('pair loading with its reason', () => {
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			loading: true,
			loadingTooltip: undefined,
		});
		// @ts-expect-error - `loadingTooltip` travels with `loading`
		assertType<ButtonGroupItemType>({
			value: 'day',
			label: 'Day',
			onClick: noop,
			loadingTooltip: 'Saving',
		});
	});
});

describe('disabled', () => {
	test('accepts disabled with its reason', () => {
		assertType(<ButtonGroup {...BASE} disabled disabledTooltip="Read only" />);
	});

	test('rejects disabled without a reason', () => {
		assertType(
			// @ts-expect-error - a disabled group has to say why
			<ButtonGroup {...BASE} disabled />,
		);
	});

	test('rejects a reason without disabled', () => {
		assertType(
			// @ts-expect-error - the reason only renders while disabled
			<ButtonGroup {...BASE} disabledTooltip="Read only" />,
		);
	});
});

describe('attributes', () => {
	test('forwards data-*, aria-* and the ref', () => {
		assertType(<ButtonGroup {...BASE} data-owner="alerts" aria-label="Range" ref={groupRef} />);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - written as `testId`, which also names every member
			<ButtonGroup {...BASE} data-testid="range" />,
		);
	});

	test('rejects an attribute the group does not forward', () => {
		assertType(
			// @ts-expect-error - onClick belongs to the members
			<ButtonGroup {...BASE} onClick={noop} />,
		);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		// @ts-expect-error - `className` is not a prop
		assertType(<ButtonGroup {...BASE} className="x" />);
		// @ts-expect-error - `style` is not a prop
		assertType(<ButtonGroup {...BASE} style={{}} />);
	});
});

describe('ButtonGroup entry point types', () => {
	test('exports every part of the item type', () => {
		assertType<ButtonGroupActionItemType>({ onClick: noop });
		// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
		assertType<ButtonGroupLinkItemType>({ render: <a href="/docs" /> });
	});
});
