import type { AriaAttributes, ReactElement, ReactNode } from 'react';
import type { CollapseSize, CollapseTextOverflow, CollapseVariant } from './constants.js';

export type CollapseVariantType = (typeof CollapseVariant)[keyof typeof CollapseVariant];
export type CollapseSizeType = (typeof CollapseSize)[keyof typeof CollapseSize];
export type CollapseTextOverflowType =
	(typeof CollapseTextOverflow)[keyof typeof CollapseTextOverflow];
export type CollapseHeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * The `aria-*` fields the component writes on the header button itself.
 */
type CollapseOwnAria = 'aria-expanded' | 'aria-controls' | 'aria-labelledby';

/**
 * The look and behaviour shared by `Collapse` and every item of `Collapse.Group`.
 */
export type CollapseSharedProps = {
	/**
	 * Forwarded to the root as `data-testid`. The parts derive theirs from it, as
	 * `{testId}-toggle`, `{testId}-prefix`, `{testId}-title`, `{testId}-description`,
	 * `{testId}-header-suffix` and `{testId}-panel`.
	 */
	testId?: string;
	/**
	 * Forwarded to the root.
	 */
	id?: string;
	/**
	 * The shape of the section. `outlined` draws a box around the header and the panel. `ghost`
	 * has no box, for a section that sits inside a card or a form.
	 */
	variant: CollapseVariantType;
	/**
	 * The type scale and the height of the header.
	 */
	size: CollapseSizeType;
	/**
	 * Keeps the content mounted while collapsed, hidden with `hidden="until-found"`, so form fields
	 * keep their state and find in page reaches the text. Find in page opens the section, which
	 * reports the change.
	 *
	 * Without it, the content mounts when the section opens and unmounts when it closes, so heavy
	 * content costs nothing while closed and its local state resets on the next open.
	 *
	 * @default false
	 */
	keepMounted?: boolean;
	/**
	 * Removes the padding of the panel, for a table or a chart that runs to the edges of the
	 * section.
	 *
	 * @default false
	 */
	noContentPadding?: boolean;
	/**
	 * What a title longer than its row does. `ellipsis` keeps it on one line, cuts it at the end
	 * and shows the whole title in a tooltip while it is cut. `wrap` takes as many lines as it
	 * needs, for a title that is a question.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: CollapseTextOverflowType;
	/**
	 * The level of the heading that wraps the header button, so the section fits the outline of
	 * the page.
	 *
	 * @default 3
	 */
	headingLevel?: CollapseHeadingLevel;
	/**
	 * Any `data-*` prop is accepted and forwarded to the root.
	 */
	[key: `data-${string}`]: unknown;
};

/**
 * The header and the content of one section, on `Collapse` and on each item of `Collapse.Group`.
 */
export type CollapseSectionProps = {
	/**
	 * The heading of the section. It sits in the header button, stays visible while collapsed, and
	 * names the button and the panel.
	 *
	 * @note Expected to be a string. The ellipsis and the tooltip only work with a string. Text and
	 * inline formatting only: a control inside the header button cannot be reached by a screen
	 * reader and toggles the section on every click. Put controls in `headerSuffix`.
	 *
	 * @note A title that renders nothing shows `<No title>`, exported as `COLLAPSE_EMPTY_TITLE`,
	 * and the title carries `data-empty-title`.
	 */
	title: ReactNode;
	/**
	 * One or two lines under the title that say what the section holds. It wraps, and it
	 * describes the header button without being part of its name.
	 */
	description?: ReactNode;
	/**
	 * An icon before the title. Decorative and hidden from screen readers, so when the icon is the
	 * only thing that tells two sections apart, its meaning goes in `title`.
	 *
	 * @note The section sets the icon size.
	 */
	prefix?: ReactElement;
	/**
	 * Controls at the end of the header row, outside the header button, such as icon buttons, a
	 * switch or an indicator with a tooltip. A click on them does not toggle the
	 * section, so the call site needs no `stopPropagation`.
	 *
	 * @note It keeps its width, so on a narrow parent the title truncates first.
	 */
	headerSuffix?: ReactNode;
	/**
	 * The content of the section, rendered in the panel. It grows with its content, and a wide
	 * element that cannot wrap scrolls on the x axis inside the panel.
	 *
	 * @note Content that renders nothing shows `<No content>` in the open panel, exported as
	 * `COLLAPSE_EMPTY_CONTENT`.
	 */
	children: ReactNode;
};

type CollapseControlProps = {
	/**
	 * The controlled open state.
	 *
	 * @note Use with `onExpandedChange`. For a section that keeps its own state use
	 * `defaultExpanded` instead.
	 *
	 * @note `undefined` on the first render leaves the section uncontrolled. An `expanded` that
	 * arrives later is followed, with a warning, and once controlled `undefined` is collapsed. The
	 * same rule as `value` on every value control.
	 */
	expanded?: boolean;
	/**
	 * Whether the section is open on mount, for a section that keeps its own state. The state does
	 * not survive a reload or a remount.
	 *
	 * @note Required when `expanded` is not set, so every call site states the initial state.
	 */
	defaultExpanded?: boolean;
	/**
	 * Called with the new state when the user presses the header button, or when find in page opens
	 * a `keepMounted` section. Not called when `expanded` changes from the outside.
	 */
	onExpandedChange?: (expanded: boolean) => void;
};

export type CollapseProps = CollapseSharedProps &
	CollapseSectionProps &
	CollapseControlProps &
	Omit<AriaAttributes, CollapseOwnAria>;

/**
 * One section of `Collapse.Group`. Each field means the same as the prop of the same name on
 * `Collapse`.
 */
export type CollapseGroupItemType = CollapseSectionProps & {
	/**
	 * What lands in `value` and `onChange` while the item is open.
	 *
	 * @note Unique within the group. Of two items with the same `value`, only the first renders,
	 * and the group logs a warning.
	 */
	value: string;
	/**
	 * Forwarded to the item as `data-testid`, and names its parts (`${testId}-toggle`).
	 *
	 * @note Optional because the group names its items for you: with a `testId` on the group, an
	 * item with none of its own is `` `${groupTestId}-item-${value}` ``. Write this only to give
	 * one item a name of its own, which then wins.
	 */
	testId?: string;
};

type CollapseGroupControlProps = {
	/**
	 * The controlled value, the `value` of every open item. `[]` is the group with every item
	 * collapsed.
	 *
	 * @note Use with `onChange`. For a group that keeps its own state use `defaultValue` instead.
	 *
	 * @note Decided on the first render, the same rule as `expanded` on `Collapse`.
	 */
	value?: readonly string[];
	/**
	 * The items open on mount, for a group that keeps its own state.
	 *
	 * @note Required when `value` is not set, the same rule as `defaultExpanded` on `Collapse`.
	 */
	defaultValue?: readonly string[];
	/**
	 * Called with the new list of open values when the user presses a header button, or when find
	 * in page opens a `keepMounted` item. Not called when `value` changes from the outside.
	 *
	 * @note The list follows the order of `items`, not the order of the clicks. A value that
	 * matches no item keeps its place after them.
	 */
	onChange?: (value: string[]) => void;
};

export type CollapseGroupProps = CollapseSharedProps &
	CollapseGroupControlProps &
	AriaAttributes & {
		/**
		 * The sections, in the order they are rendered. Any number of them can be open at once.
		 *
		 * @note An empty array renders an empty root with no warning: the items come from data,
		 * and the call site owns the empty state.
		 */
		items: readonly CollapseGroupItemType[];
	};

/**
 * The rules below are the ones a union cannot express without blowing up the props into a cross
 * product. Each is an object whose single required key is the sentence the compiler should print,
 * so a violation reads as `Property '<the sentence>' is missing ... but required in type '<the rule
 * name>'` instead of pointing at an unrelated prop.
 */
interface ACollapseStatesItsInitialState {
	'`defaultExpanded` is required when `expanded` is not set, every section states whether it starts open': never;
}

interface AControlledCollapseNeedsItsCallback {
	'`expanded` needs `onExpandedChange`, a controlled section only changes when its parent hears the press': never;
}

interface AControlledCollapseTakesNoDefault {
	'`expanded` and `defaultExpanded` cannot be set together, pick controlled or uncontrolled': never;
}

interface ACollapseGroupStatesItsInitialState {
	'`defaultValue` is required when `value` is not set, every group states which items start open': never;
}

interface AControlledCollapseGroupNeedsItsCallback {
	'`value` needs `onChange`, a controlled group only changes when its parent hears the press': never;
}

interface AControlledCollapseGroupTakesNoDefault {
	'`value` and `defaultValue` cannot be set together, pick controlled or uncontrolled': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names the parts': never;
}

/**
 * Extra constraints layered on top of {@link CollapseProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not. The rules look at which props the call site writes, not at their
 * values.
 *
 * The clash between `expanded` and `defaultExpanded` matches on a required key, not on `keyof T`:
 * while an inline callback is still untyped, TypeScript checks the call once with `T` as the props
 * type itself, where every optional key is in `keyof T`.
 *
 * @note A wrapper that forwards the whole props type is not checked: every key is then written, so
 * every rule passes. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateCollapseProps<T> = ('expanded' extends keyof T
	? ('onExpandedChange' extends keyof T ? unknown : AControlledCollapseNeedsItsCallback) &
			(T extends { defaultExpanded: unknown } ? AControlledCollapseTakesNoDefault : unknown)
	: 'defaultExpanded' extends keyof T
		? unknown
		: ACollapseStatesItsInitialState) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * Extra constraints layered on top of {@link CollapseGroupProps} at the call site, the same rules
 * as {@link ValidateCollapseProps} for `value`, `defaultValue` and `onChange`.
 */
export type ValidateCollapseGroupProps<T> = ('value' extends keyof T
	? ('onChange' extends keyof T ? unknown : AControlledCollapseGroupNeedsItsCallback) &
			(T extends { defaultValue: unknown } ? AControlledCollapseGroupTakesNoDefault : unknown)
	: 'defaultValue' extends keyof T
		? unknown
		: ACollapseGroupStatesItsInitialState) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);
