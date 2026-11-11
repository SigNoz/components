/**
 * Type-level tests for the props of {@link Collapse} and `Collapse.Group`.
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
import { Collapse } from '../collapse.js';
import type { CollapseGroupItemType } from '../types.js';

const ITEMS = [
	{ value: 'logs', title: 'Logs', children: 'Logs body' },
	{ value: 'traces', title: 'Traces', children: 'Traces body' },
] as const;
const section = { variant: 'ghost', size: 'sm', title: 'T', children: 'c' } as const;
const open = { ...section, defaultExpanded: true } as const;
const group = { variant: 'ghost', size: 'sm', items: ITEMS, defaultValue: [] } as const;
const noop = (): void => {};
const rootRef = createRef<HTMLDivElement>();
const buttonRef = createRef<HTMLButtonElement>();
declare const maybeExpanded: boolean | undefined;
declare const maybeValue: readonly string[] | undefined;
declare const heading: 2 | 3 | 4 | 5 | 6;

describe('required props', () => {
	test('accepts the minimal section', () => {
		assertType(
			<Collapse variant="outlined" size="sm" title="T" defaultExpanded>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title="T" defaultExpanded={false}>
				c
			</Collapse>,
		);
	});

	test('variant is required', () => {
		assertType(
			// @ts-expect-error - a section without a shape has no box to draw
			<Collapse size="sm" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('size is required', () => {
		assertType(
			// @ts-expect-error - a section without a size has no type scale
			<Collapse variant="ghost" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('title is required', () => {
		assertType(
			// @ts-expect-error - a section without a title has no name
			<Collapse variant="ghost" size="sm" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('children is required', () => {
		// @ts-expect-error - a section without content has nothing to show
		assertType(<Collapse variant="ghost" size="sm" title="T" defaultExpanded />);
	});

	test('accepts a title that is not a string', () => {
		assertType(
			<Collapse variant="ghost" size="sm" title={<b>T</b>} defaultExpanded>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title={null} defaultExpanded>
				c
			</Collapse>,
		);
	});
});

describe('variant, size, textOverflow and headingLevel', () => {
	test('rejects a variant outside the set', () => {
		assertType(
			// @ts-expect-error - `solid` is not a shape of the section
			<Collapse variant="solid" size="sm" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('rejects a size outside the set', () => {
		assertType(
			// @ts-expect-error - the section has sm only
			<Collapse variant="ghost" size="lg" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('rejects md, which the section does not have', () => {
		assertType(
			// @ts-expect-error - md was removed, sm is the only size
			<Collapse variant="ghost" size="md" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('accepts both textOverflow values', () => {
		assertType(
			<Collapse variant="ghost" size="sm" title="T" textOverflow="wrap" defaultExpanded>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title="T" textOverflow="ellipsis" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - a title has no visible overflow, it would paint outside the box
		assertType(<Collapse {...open} textOverflow="clip" />);
	});

	test('accepts the heading levels from 2 to 6', () => {
		assertType(
			<Collapse variant="ghost" size="sm" title="T" headingLevel={2} defaultExpanded>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title="T" headingLevel={6} defaultExpanded>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title="T" headingLevel={heading} defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('rejects heading level 1, the page owns the h1', () => {
		// @ts-expect-error - a section is never the title of the page
		assertType(<Collapse {...open} headingLevel={1} />);
	});

	test('rejects a heading level past 6', () => {
		// @ts-expect-error - HTML has no h7
		assertType(<Collapse {...open} headingLevel={7} />);
	});

	test('accepts keepMounted and noContentPadding', () => {
		assertType(
			<Collapse variant="ghost" size="sm" title="T" keepMounted noContentPadding defaultExpanded>
				c
			</Collapse>,
		);
	});
});

describe('parts', () => {
	test('accepts a description, a prefix and a header suffix', () => {
		assertType(
			<Collapse
				variant="ghost"
				size="sm"
				title="T"
				description="D"
				prefix={<svg />}
				headerSuffix={<button type="button">E</button>}
				defaultExpanded
			>
				c
			</Collapse>,
		);
	});

	test('accepts a description and a header suffix that are not strings', () => {
		assertType(
			<Collapse
				variant="ghost"
				size="sm"
				title="T"
				description={<i>D</i>}
				headerSuffix={null}
				defaultExpanded
			>
				c
			</Collapse>,
		);
	});

	test('rejects a prefix that is not an element', () => {
		// @ts-expect-error - `prefix` is an icon slot, not text
		assertType(<Collapse {...open} prefix="P" />);
	});
});

describe('expanded, defaultExpanded and onExpandedChange', () => {
	test('accepts a controlled section with its callback', () => {
		assertType(
			<Collapse variant="ghost" size="sm" title="T" expanded onExpandedChange={noop}>
				c
			</Collapse>,
		);
		assertType(
			<Collapse variant="ghost" size="sm" title="T" expanded={false} onExpandedChange={noop}>
				c
			</Collapse>,
		);
	});

	test('accepts a controlled section whose expanded may be undefined', () => {
		assertType(
			<Collapse
				variant="ghost"
				size="sm"
				title="T"
				expanded={maybeExpanded}
				onExpandedChange={noop}
			>
				c
			</Collapse>,
		);
	});

	test('accepts an uncontrolled section that reports its changes', () => {
		assertType(<Collapse {...open} onExpandedChange={noop} />);
	});

	test('accepts an onExpandedChange that takes a boolean', () => {
		assertType(<Collapse {...open} onExpandedChange={(next: boolean) => next} />);
	});

	test('rejects an onExpandedChange that cannot take a boolean', () => {
		// @ts-expect-error - the callback receives the new state, a boolean
		assertType(<Collapse {...open} onExpandedChange={(open: string) => open} />);
	});

	test('rejects an expanded that is not a boolean', () => {
		// @ts-expect-error - `expanded` is the open state, a boolean
		assertType(<Collapse {...section} expanded="true" onExpandedChange={noop} />);
	});

	test('rejects a missing defaultExpanded', () => {
		assertType(
			// @ts-expect-error - every section states whether it starts open
			<Collapse variant="ghost" size="sm" title="T">
				c
			</Collapse>,
		);
	});

	test('rejects a missing defaultExpanded even with onExpandedChange', () => {
		assertType(
			// @ts-expect-error - the callback does not say where the section starts
			<Collapse variant="ghost" size="sm" title="T" onExpandedChange={noop}>
				c
			</Collapse>,
		);
	});

	test('rejects expanded without onExpandedChange', () => {
		assertType(
			// @ts-expect-error - a controlled section only changes when its parent hears the press
			<Collapse variant="ghost" size="sm" title="T" expanded>
				c
			</Collapse>,
		);
	});

	test('rejects an expanded that may be undefined without onExpandedChange', () => {
		assertType(
			// @ts-expect-error - `expanded` typed `boolean | undefined` is still controlled
			<Collapse variant="ghost" size="sm" title="T" expanded={maybeExpanded}>
				c
			</Collapse>,
		);
	});

	test('rejects expanded together with defaultExpanded', () => {
		// @ts-expect-error - a section is controlled or uncontrolled, not both
		assertType(<Collapse {...open} expanded onExpandedChange={noop} />);
	});
});

describe('className, style and test ids', () => {
	test('accepts testId, id and data attributes', () => {
		assertType(
			<Collapse
				variant="ghost"
				size="sm"
				title="T"
				testId="c"
				id="c"
				data-state="open"
				defaultExpanded
			>
				c
			</Collapse>,
		);
	});

	test('rejects className', () => {
		// @ts-expect-error - the look comes from variant and size
		assertType(<Collapse {...open} className="x" />);
	});

	test('rejects style', () => {
		// @ts-expect-error - the look comes from variant and size
		assertType(<Collapse {...open} style={{}} />);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, which also names the parts
		assertType(<Collapse {...open} data-testid="c" />);
	});
});

describe('aria attributes', () => {
	test('accepts the aria attributes that land on the header button', () => {
		assertType(
			<Collapse
				variant="ghost"
				size="sm"
				title="T"
				aria-describedby="x"
				aria-keyshortcuts="K"
				defaultExpanded
			>
				c
			</Collapse>,
		);
	});

	test('rejects aria-expanded, the section writes it', () => {
		// @ts-expect-error - the open state is `expanded`
		assertType(<Collapse {...open} aria-expanded />);
	});

	test('rejects aria-controls, the section writes it', () => {
		// @ts-expect-error - the section points at its own panel
		assertType(<Collapse {...open} aria-controls="x" />);
	});

	test('rejects aria-labelledby, the title names the button', () => {
		// @ts-expect-error - the section points at its own title
		assertType(<Collapse {...open} aria-labelledby="x" />);
	});
});

describe('props of the Ant Design collapse', () => {
	test('rejects activeKey, replaced by expanded', () => {
		// @ts-expect-error - use `expanded`
		assertType(<Collapse {...open} activeKey="a" />);
	});

	test('rejects defaultActiveKey, replaced by defaultExpanded', () => {
		// @ts-expect-error - use `defaultExpanded`
		assertType(<Collapse {...open} defaultActiveKey="a" />);
	});

	test('rejects onChange, replaced by onExpandedChange', () => {
		// @ts-expect-error - use `onExpandedChange`, which reports a boolean
		assertType(<Collapse {...open} onChange={noop} />);
	});

	test('rejects items, one section is the Collapse itself', () => {
		// @ts-expect-error - a list of sections is a `Collapse.Group`
		assertType(<Collapse {...open} items={[]} />);
	});

	test('rejects header, renamed to title', () => {
		// @ts-expect-error - use `title`
		assertType(<Collapse {...open} header="H" />);
	});

	test('rejects label, renamed to title', () => {
		// @ts-expect-error - use `title`
		assertType(<Collapse {...open} label="L" />);
	});

	test('rejects extra, renamed to headerSuffix', () => {
		// @ts-expect-error - use `headerSuffix`
		assertType(<Collapse {...open} extra={<i />} />);
	});

	test('rejects accordion, no call site uses it', () => {
		// @ts-expect-error - one section has nothing to be exclusive with
		assertType(<Collapse {...open} accordion />);
	});

	test('rejects bordered, replaced by variant', () => {
		// @ts-expect-error - use `variant`
		assertType(<Collapse {...open} bordered />);
	});

	test('rejects ghost, replaced by variant', () => {
		// @ts-expect-error - use `variant`
		assertType(<Collapse {...open} ghost />);
	});

	test('rejects expandIcon, the chevron is drawn in one place', () => {
		// @ts-expect-error - there is no prop to replace the chevron
		assertType(<Collapse {...open} expandIcon={<i />} />);
	});

	test('rejects expandIconPosition, the chevron is drawn in one place', () => {
		// @ts-expect-error - there is no prop to move the chevron
		assertType(<Collapse {...open} expandIconPosition="end" />);
	});

	test('rejects showArrow, the chevron is drawn in one place', () => {
		// @ts-expect-error - there is no prop to hide the chevron
		assertType(<Collapse {...open} showArrow />);
	});

	test('rejects collapsible, the whole header button toggles', () => {
		// @ts-expect-error - no call site restricts what toggles the section
		assertType(<Collapse {...open} collapsible="header" />);
	});

	test('rejects disabled, a section has no disabled state', () => {
		// @ts-expect-error - a control inside the panel carries its own
		assertType(<Collapse {...open} disabled />);
	});

	test('rejects destroyInactivePanel, replaced by keepMounted', () => {
		// @ts-expect-error - the content unmounts by default
		assertType(<Collapse {...open} destroyInactivePanel />);
	});

	test('rejects destroyOnHidden, replaced by keepMounted', () => {
		// @ts-expect-error - the content unmounts by default
		assertType(<Collapse {...open} destroyOnHidden />);
	});

	test('rejects forceRender, replaced by keepMounted', () => {
		// @ts-expect-error - use `keepMounted`
		assertType(<Collapse {...open} forceRender />);
	});

	test('rejects rootClassName, the parts take no class', () => {
		// @ts-expect-error - same as `className`
		assertType(<Collapse {...open} rootClassName="x" />);
	});

	test('rejects styles, the parts take no style', () => {
		// @ts-expect-error - same as `style`
		assertType(<Collapse {...open} styles={{}} />);
	});

	test('rejects classNames, the parts take no class', () => {
		// @ts-expect-error - same as `className`
		assertType(<Collapse {...open} classNames={{}} />);
	});

	test('rejects motion, the panel does not animate its height', () => {
		// @ts-expect-error - there is no height animation to tune
		assertType(<Collapse {...open} motion={{}} />);
	});
});

describe('unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<Collapse key="c" ref={rootRef} variant="ghost" size="sm" title="T" defaultExpanded>
				c
			</Collapse>,
		);
	});

	test('rejects a ref of another element type', () => {
		// @ts-expect-error - the ref lands on the root div
		assertType(<Collapse {...open} ref={buttonRef} />);
	});

	test('rejects a prop that does not exist', () => {
		// @ts-expect-error - `unknownProp` is not a prop
		assertType(<Collapse {...open} unknownProp />);
	});

	test('rejects a DOM handler, the root is not for events', () => {
		// @ts-expect-error - `onClick` is not a prop
		assertType(<Collapse {...open} onClick={noop} />);
	});
});

describe('Collapse.Group required props', () => {
	test('accepts the minimal group, and a readonly list declared as const', () => {
		assertType(<Collapse.Group variant="ghost" size="sm" items={[]} defaultValue={[]} />);
		assertType(
			<Collapse.Group variant="outlined" size="sm" items={ITEMS} defaultValue={['logs']} />,
		);
	});

	test('variant is required', () => {
		// @ts-expect-error - a group without a shape has no box to draw
		assertType(<Collapse.Group size="sm" items={ITEMS} defaultValue={[]} />);
	});

	test('size is required', () => {
		// @ts-expect-error - a group without a size has no type scale
		assertType(<Collapse.Group variant="ghost" items={ITEMS} defaultValue={[]} />);
	});

	test('items is required', () => {
		// @ts-expect-error - a group renders from its items
		assertType(<Collapse.Group variant="ghost" size="sm" defaultValue={[]} />);
	});

	test('rejects a variant outside the set', () => {
		// @ts-expect-error - `solid` is not a shape of the group
		assertType(<Collapse.Group variant="solid" size="sm" items={ITEMS} defaultValue={[]} />);
	});

	test('rejects a size outside the set', () => {
		// @ts-expect-error - the group has sm only
		assertType(<Collapse.Group variant="ghost" size="lg" items={ITEMS} defaultValue={[]} />);
	});

	test('rejects md, which the group does not have', () => {
		// @ts-expect-error - md was removed, sm is the only size
		assertType(<Collapse.Group variant="ghost" size="md" items={ITEMS} defaultValue={[]} />);
	});

	test('accepts the look props that apply to every item', () => {
		assertType(
			<Collapse.Group
				variant="ghost"
				size="sm"
				items={ITEMS}
				defaultValue={[]}
				keepMounted
				noContentPadding
				textOverflow="wrap"
				headingLevel={4}
			/>,
		);
	});

	test('rejects a heading level outside the range', () => {
		// @ts-expect-error - a section is never the title of the page
		assertType(<Collapse.Group {...group} headingLevel={1} />);
	});

	test('rejects a textOverflow outside the set', () => {
		// @ts-expect-error - a title has no visible overflow, it would paint outside the box
		assertType(<Collapse.Group {...group} textOverflow="clip" />);
	});
});

describe('Collapse.Group items', () => {
	test('accepts every field of an item', () => {
		assertType<CollapseGroupItemType>({
			value: 'logs',
			title: 'Logs',
			description: 'D',
			prefix: <svg />,
			headerSuffix: <button type="button">E</button>,
			children: 'c',
			testId: 'logs',
		});
	});

	test('rejects an item without a value', () => {
		// @ts-expect-error - the value is what lands in `value` and `onChange`
		assertType<CollapseGroupItemType>({ title: 'Logs', children: 'c' });
	});

	test('rejects an item without a title', () => {
		// @ts-expect-error - an item without a title has no name
		assertType<CollapseGroupItemType>({ value: 'logs', children: 'c' });
	});

	test('rejects an item without children', () => {
		// @ts-expect-error - an item without content has nothing to show
		assertType<CollapseGroupItemType>({ value: 'logs', title: 'Logs' });
	});

	test('rejects an item whose prefix is not an element', () => {
		// @ts-expect-error - `prefix` is an icon slot, not text
		assertType<CollapseGroupItemType>({ value: 'logs', title: 'L', children: 'c', prefix: 'P' });
	});

	test('rejects an item whose value is not a string', () => {
		// @ts-expect-error - the values of a group are strings
		assertType<CollapseGroupItemType>({ value: 1, title: 'Logs', children: 'c' });
	});

	test('rejects an item that is missing a field at the call site', () => {
		// @ts-expect-error - the items are checked against the item type
		assertType(<Collapse.Group {...group} items={[{ value: 'a', title: 'A' }]} />);
	});
});

describe('value, defaultValue and onChange', () => {
	test('accepts a controlled value, including the empty one', () => {
		assertType(
			<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={['logs']} onChange={noop} />,
		);
		assertType(
			<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={[]} onChange={noop} />,
		);
	});

	test('accepts a controlled value that is readonly or may be undefined', () => {
		assertType(
			<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={maybeValue} onChange={noop} />,
		);
	});

	test('accepts an uncontrolled group that reports its changes', () => {
		assertType(<Collapse.Group {...group} onChange={noop} />);
	});

	test('accepts an onChange that takes a list of strings', () => {
		assertType(<Collapse.Group {...group} onChange={(open: string[]) => open} />);
	});

	test('rejects an onChange that cannot take a list', () => {
		// @ts-expect-error - the callback receives the list of open values
		assertType(<Collapse.Group {...group} onChange={(open: string) => open} />);
	});

	test('rejects a single value, the group holds a list', () => {
		// @ts-expect-error - several items can be open at once
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} defaultValue="logs" />);
	});

	test('rejects a missing defaultValue', () => {
		// @ts-expect-error - every group states which items start open
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} />);
	});

	test('rejects a missing defaultValue even with onChange', () => {
		// @ts-expect-error - the callback does not say which items start open
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} onChange={noop} />);
	});

	test('rejects value without onChange', () => {
		// @ts-expect-error - a controlled group only changes when its parent hears the press
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={[]} />);
	});

	test('rejects a value that may be undefined without onChange', () => {
		// @ts-expect-error - `value` typed `string[] | undefined` is still controlled
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={maybeValue} />);
	});

	test('rejects value together with defaultValue', () => {
		// @ts-expect-error - a group is controlled or uncontrolled, not both
		assertType(<Collapse.Group {...group} value={[]} onChange={noop} />);
	});
});

describe('Collapse.Group className, style, test ids and aria', () => {
	test('accepts testId, id, data attributes and any aria attribute', () => {
		assertType(
			<Collapse.Group
				variant="ghost"
				size="sm"
				items={ITEMS}
				defaultValue={[]}
				testId="g"
				id="g"
				data-x="y"
				aria-label="FAQ"
			/>,
		);
	});

	test('rejects className', () => {
		// @ts-expect-error - the look comes from variant and size
		assertType(<Collapse.Group {...group} className="x" />);
	});

	test('rejects style', () => {
		// @ts-expect-error - the look comes from variant and size
		assertType(<Collapse.Group {...group} style={{}} />);
	});

	test('rejects a raw data-testid', () => {
		// @ts-expect-error - use `testId`, which also names the items and their parts
		assertType(<Collapse.Group {...group} data-testid="g" />);
	});
});

describe('Collapse.Group props that belong to an item', () => {
	test('rejects expanded, replaced by value', () => {
		// @ts-expect-error - use `value` and `onChange`
		assertType(<Collapse.Group {...group} expanded />);
	});

	test('rejects defaultExpanded, replaced by defaultValue', () => {
		// @ts-expect-error - use `defaultValue`
		assertType(<Collapse.Group {...group} defaultExpanded />);
	});

	test('rejects onExpandedChange, replaced by onChange', () => {
		// @ts-expect-error - use `onChange`, which reports the list of open values
		assertType(<Collapse.Group {...group} onExpandedChange={noop} />);
	});

	test('rejects title, it belongs to each item', () => {
		// @ts-expect-error - put the title in the items
		assertType(<Collapse.Group {...group} title="T" />);
	});

	test('rejects description, it belongs to each item', () => {
		// @ts-expect-error - put the description in the items
		assertType(<Collapse.Group {...group} description="D" />);
	});

	test('rejects prefix, it belongs to each item', () => {
		// @ts-expect-error - put the prefix in the items
		assertType(<Collapse.Group {...group} prefix={<svg />} />);
	});

	test('rejects headerSuffix, it belongs to each item', () => {
		// @ts-expect-error - put the header suffix in the items
		assertType(<Collapse.Group {...group} headerSuffix={<i />} />);
	});

	test('rejects children, the group renders from items', () => {
		assertType(
			// @ts-expect-error - there is no slot to compose into, pass `items` instead
			<Collapse.Group variant="ghost" size="sm" items={ITEMS} defaultValue={[]}>
				<span />
			</Collapse.Group>,
		);
	});

	test('rejects accordion, several items can be open at once', () => {
		// @ts-expect-error - one open item at a time is not a mode of the group
		assertType(<Collapse.Group {...group} accordion />);
	});
});

describe('Collapse.Group unknown props', () => {
	test('accepts key and ref', () => {
		assertType(
			<Collapse.Group
				key="g"
				ref={rootRef}
				variant="ghost"
				size="sm"
				items={ITEMS}
				defaultValue={[]}
			/>,
		);
	});

	test('rejects a prop that does not exist', () => {
		// @ts-expect-error - `unknownProp` is not a prop
		assertType(<Collapse.Group {...group} unknownProp />);
	});
});

describe('inline callbacks with an inferred parameter', () => {
	test('accepts an uncontrolled section, and hands the callback a boolean', () => {
		assertType(<Collapse {...open} onExpandedChange={(next) => assertType<boolean>(next)} />);
	});

	test('accepts a controlled section, and hands the callback a boolean', () => {
		assertType(
			<Collapse {...section} expanded onExpandedChange={(next) => assertType<boolean>(next)} />,
		);
	});

	test('accepts a callback ref', () => {
		assertType(<Collapse {...open} ref={(node) => assertType<HTMLDivElement | null>(node)} />);
	});

	test('accepts a group, and hands the callback a list of strings', () => {
		assertType(<Collapse.Group {...group} onChange={(next) => assertType<string[]>(next)} />);
	});

	test('accepts a controlled group, and hands the callback a list of strings', () => {
		assertType(
			<Collapse.Group
				variant="ghost"
				size="sm"
				items={ITEMS}
				value={[]}
				onChange={(next) => assertType<string[]>(next)}
			/>,
		);
	});

	test('still rejects expanded together with defaultExpanded', () => {
		// @ts-expect-error - a section is controlled or uncontrolled, not both
		assertType(<Collapse {...open} expanded onExpandedChange={(next) => next} />);
	});

	test('still rejects a missing defaultExpanded', () => {
		// @ts-expect-error - every section states whether it starts open
		assertType(<Collapse {...section} onExpandedChange={(next) => next} />);
	});

	test('still rejects expanded without onExpandedChange next to an inline ref', () => {
		// @ts-expect-error - a controlled section only changes when its parent hears the press
		assertType(<Collapse {...section} expanded ref={(node) => void node} />);
	});

	test('still rejects value together with defaultValue', () => {
		// @ts-expect-error - a group is controlled or uncontrolled, not both
		assertType(<Collapse.Group {...group} value={[]} onChange={(next) => next} />);
	});

	test('still rejects a missing defaultValue', () => {
		// @ts-expect-error - every group states which items start open
		assertType(<Collapse.Group variant="ghost" size="sm" items={ITEMS} onChange={(n) => n} />);
	});

	test('still rejects value without onChange next to an inline ref', () => {
		assertType(
			// @ts-expect-error - a controlled group only changes when its parent hears the press
			<Collapse.Group variant="ghost" size="sm" items={ITEMS} value={[]} ref={(n) => n} />,
		);
	});
});
