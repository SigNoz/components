import { Collapsible } from '@base-ui/react/collapsible';
import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { RejectedProps } from '../lib/utils.js';
import styles from './collapse.module.scss';
import { CollapseTextOverflow } from './constants.js';
import { CollapseGroup } from './subcomponents/collapse-group.js';
import { CollapseSection } from './subcomponents/collapse-section.js';
import type {
	CollapseGroupProps,
	CollapseProps,
	ValidateCollapseGroupProps,
	ValidateCollapseProps,
} from './types.js';
import { useCollapseState } from './use-collapse-state.js';
import { splitDataAndAria } from './utils.js';

/**
 * A section of a page whose content the user can hide and show from its header, built on the Base
 * UI collapsible. Use `Collapse.Group` for a list of sections that open and close on their own.
 *
 * `id`, `ref` and any `data-*` land on the root. Every `aria-*` lands on the header button, except
 * `aria-expanded`, `aria-controls` and `aria-labelledby`, which the section writes, and an
 * `aria-describedby` is joined with the description. There is no `className` or `style`.
 *
 * Visual values are `--collapse-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The disclosure pattern. The header button is a native `button` inside a heading of
 * `headingLevel`, carries `aria-expanded`, and `aria-controls` while the panel is in the DOM. The
 * title names it and the description describes it. The panel is a `region` named by the title.
 * The chevron and the prefix are hidden from screen readers.
 *
 * `Enter` and `Space` toggle, and focus stays on the header button. When the section closes while
 * focus is inside its panel, focus moves to the header button.
 *
 * ### Header
 *
 * The chevron, the prefix, the title and the description are one button, so a click anywhere on
 * them toggles. `headerSuffix` sits next to it in the same row, outside the button, so a click on
 * its controls does not toggle. The row never wraps: the title is the only part that shrinks.
 *
 * ### Mounting
 *
 * The content mounts when the section opens and unmounts when it closes. With `keepMounted` it
 * stays mounted and is hidden with `hidden="until-found"`, so find in page reaches it and opens the
 * section.
 *
 * ### Empty
 *
 * A title that renders nothing shows `COLLAPSE_EMPTY_TITLE` and content that renders nothing shows
 * `COLLAPSE_EMPTY_CONTENT`. The section never hides.
 *
 * ### Overflow
 *
 * The root fills its parent and has no outer margin. The panel grows with its content and has no
 * scroll of its own, except on the x axis for a wide element that cannot wrap.
 *
 * ### Asserting on it
 *
 * `testId` lands on the root as `data-testid`. The root carries `data-variant`, `data-size`,
 * `data-text-overflow`, and `data-expanded` only while open.
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `collapse` | the root, carries `testId` |
 * | `collapse-header` | the header row |
 * | `collapse-toggle` | the header button, `{testId}-toggle` |
 * | `collapse-chevron` | the chevron |
 * | `collapse-prefix` | the prefix, `{testId}-prefix` |
 * | `collapse-title` | the title, `{testId}-title`, `data-truncated` while cut, `data-empty-title` while empty |
 * | `collapse-description` | the description, `{testId}-description` |
 * | `collapse-header-suffix` | the controls after the button, `{testId}-header-suffix` |
 * | `collapse-panel` | the panel, `{testId}-panel`, only while in the DOM |
 *
 * @example
 * ```tsx
 * <Collapse variant="outlined" size="sm" title="Advanced options" defaultExpanded={false}>
 *   <AdvancedOptionsForm />
 * </Collapse>
 * ```
 *
 * @example
 * ```tsx
 * <Collapse
 *   variant="ghost"
 *   size="sm"
 *   title="All attributes"
 *   headerSuffix={
 *     <Button variant="ghost" color="secondary" size="sm" icon aria-label="Copy attributes">
 *       <Copy />
 *     </Button>
 *   }
 *   expanded={expanded}
 *   onExpandedChange={setExpanded}
 *   noContentPadding
 * >
 *   <AttributesTable />
 * </Collapse>
 * ```
 */
const CollapseRoot = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
	{
		testId,
		id,
		variant,
		size,
		keepMounted = false,
		noContentPadding = false,
		textOverflow = CollapseTextOverflow.Ellipsis,
		headingLevel,
		title,
		description,
		prefix,
		headerSuffix,
		children,
		expanded,
		defaultExpanded,
		onExpandedChange,
		className: _className,
		style: _style,
		...rest
	}: CollapseProps & RejectedProps,
	ref,
) {
	const [open, setOpen] = useCollapseState({
		component: 'Collapse',
		prop: 'expanded',
		value: expanded,
		defaultValue: defaultExpanded,
		empty: false,
	});
	const { dataProps, ariaProps } = splitDataAndAria(rest);

	return (
		<Collapsible.Root
			{...dataProps}
			ref={ref}
			id={id}
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				onExpandedChange?.(next);
			}}
			data-slot="collapse"
			data-testid={testId}
			data-variant={variant}
			data-size={size}
			data-text-overflow={textOverflow}
			data-expanded={open || undefined}
			className={styles['collapse']}
		>
			<CollapseSection
				kind="collapsible"
				open={open}
				testId={testId}
				keepMounted={keepMounted}
				noContentPadding={noContentPadding}
				textOverflow={textOverflow}
				headingLevel={headingLevel}
				isRegion
				toggleAria={ariaProps}
				title={title}
				description={description}
				prefix={prefix}
				headerSuffix={headerSuffix}
			>
				{children}
			</CollapseSection>
		</Collapsible.Root>
	);
});

// `T` is inferred from the call site, so `T extends CollapseProps` alone never runs excess property
// checks. Every key outside the props is pinned to `never` instead.
export const Collapse = Object.assign(CollapseRoot, { Group: CollapseGroup }) as (<
	T extends CollapseProps,
>(
	props: T &
		ValidateCollapseProps<T> &
		Record<Exclude<keyof T, keyof CollapseProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement) & {
	Group: <T extends CollapseGroupProps>(
		props: T &
			ValidateCollapseGroupProps<T> &
			Record<
				Exclude<keyof T, keyof CollapseGroupProps | keyof RefAttributes<HTMLDivElement>>,
				never
			> &
			RefAttributes<HTMLDivElement>,
	) => ReactElement;
};
