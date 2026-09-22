import { Menu, type MenuRootActions } from '@base-ui/react/menu';
import {
	type CSSProperties,
	forwardRef,
	isValidElement,
	type KeyboardEvent,
	type ReactElement,
	type RefAttributes,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { cn } from '../lib/utils.js';
import { TooltipContent } from '../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../tooltip/subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../tooltip/subcomponents/tooltip-trigger.js';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';
import { useTooltipHandle } from '../tooltip/tooltip-handle.js';
import { DROPDOWN_ROW_SELECTOR, DROPDOWN_SIDE_OFFSET } from './constants.js';
import { type DropdownContextValue, DropdownProvider } from './dropdown-context.js';
import styles from './dropdown.module.scss';
import { DropdownItems } from './subcomponents/dropdown-items.js';
import { DropdownLoading } from './subcomponents/dropdown-loading.js';
import { DropdownSearch } from './subcomponents/dropdown-search.js';
import { DropdownViewport } from './subcomponents/dropdown-viewport.js';
import type { DropdownProps, ValidateDropdownProps } from './types.js';
import { filterDropdownItems, reportDropdownActionError } from './utils.js';

const DropdownImpl = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown(
	{
		items,
		children,
		disabled = false,
		disabledTooltip,
		align,
		side,
		contentMaxWidth,
		contentMaxHeight,
		container,
		loading = false,
		loadingContent,
		noContent,
		searchInputProps,
		onOpenChange,
		nativeButton,
		testId,
		id,
		className,
		style,
		...props
	},
	ref,
) {
	const actionsRef = useRef<MenuRootActions | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');
	const [pendingRowKey, setPendingRowKey] = useState<string | null>(null);
	const [rememberedSelections, setRememberedSelections] = useState<
		Readonly<Record<string, boolean | string>>
	>({});
	// Counts openings and closings, so an action can tell whether the menu it started in is still
	// the one on screen when it settles.
	const sessionRef = useRef(0);

	const isFiltering = searchInputProps !== undefined && searchInputProps.filter !== false;
	const visibleItems = useMemo(
		() => filterDropdownItems(items, isFiltering ? query : ''),
		[items, query, isFiltering],
	);

	// Warns on an empty `items` only. A query that matches nothing is a state, not a bug, and so
	// is a list still loading, one a server filtered down to nothing, or one the consumer wrote
	// `noContent` for.
	const isServerFiltered = searchInputProps !== undefined && searchInputProps.filter === false;
	const isEmptyByMistake =
		items.length === 0 && !loading && !isServerFiltered && noContent === undefined;

	useEffect(() => {
		if (isEmptyByMistake) {
			console.warn('Dropdown: `items` is empty, showing the empty row.');
		}
	}, [isEmptyByMistake]);

	const close = useCallback((): void => {
		actionsRef.current?.close();
	}, []);

	useEffect(() => {
		if (disabled) {
			close();
		}
	}, [disabled, close]);

	const tooltipHandle = useTooltipHandle();
	const tooltipContentId = useId();
	const hasDisabledTooltip = disabled && hasTooltipContent(disabledTooltip);

	const trackPendingAction = useCallback(
		(rowKey: string, action: Promise<boolean | void>): void => {
			const session = sessionRef.current;
			setPendingRowKey(rowKey);

			action.then(
				(resolved) => {
					if (sessionRef.current !== session) {
						return;
					}

					setPendingRowKey(null);

					if (resolved !== false) {
						close();
					}
				},
				(error: unknown) => {
					// The failure is still worth reporting after the menu has closed: the user
					// started it, and nothing else will tell them.
					reportDropdownActionError(error);

					if (sessionRef.current === session) {
						setPendingRowKey(null);
					}
				},
			);
		},
		[close],
	);

	const rememberSelection = useCallback((rowKey: string, selection: boolean | string): void => {
		setRememberedSelections((current) => ({ ...current, [rowKey]: selection }));
	}, []);

	// The size props compose with the tokens instead of overwriting `style.maxWidth`, the way
	// `ToggleGroup`'s `width` and `maxWidth` do. The consumer's own `style` travels with them, so
	// a submenu popup is declared the same way the root one is.
	const popupStyle = useMemo(
		() =>
			({
				...style,
				...(contentMaxWidth != null && {
					'--dropdown-internal-max-inline-size': toCssLength(contentMaxWidth),
				}),
				...(contentMaxHeight != null && {
					'--dropdown-internal-max-block-size': toCssLength(contentMaxHeight),
				}),
			}) as CSSProperties,
		[style, contentMaxWidth, contentMaxHeight],
	);

	const contextValue = useMemo(
		(): DropdownContextValue => ({
			testId,
			close,
			pendingRowKey,
			trackPendingAction,
			rememberedSelections,
			rememberSelection,
			container,
			popupStyle,
			popupClassName: className,
		}),
		[
			testId,
			close,
			pendingRowKey,
			trackPendingAction,
			rememberedSelections,
			rememberSelection,
			container,
			popupStyle,
			className,
		],
	);

	// `ArrowDown` in the search field hands the highlight to the first row; this hands it back.
	//
	// On the capture phase: Base UI's own list navigation moves focus in the row's handler, so a
	// bubbling one would read the row it had already left.
	function handlePopupKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (event.key !== 'ArrowUp' || inputRef.current === null) {
			return;
		}

		const firstRow = popupRef.current?.querySelector<HTMLElement>(DROPDOWN_ROW_SELECTOR);

		if (firstRow !== null && firstRow === document.activeElement) {
			event.preventDefault();
			event.stopPropagation();
			inputRef.current.focus();
		}
	}

	const trigger = (
		<Menu.Trigger
			ref={ref}
			data-slot="dropdown-trigger"
			nativeButton={nativeButton}
			aria-disabled={disabled || undefined}
			data-disabled={disabled || undefined}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
			{...(isValidElement(children) ? { render: children } : { children })}
		/>
	);

	return (
		<Menu.Root
			actionsRef={actionsRef}
			modal={false}
			loopFocus
			highlightItemOnHover
			orientation="vertical"
			onOpenChange={(open, eventDetails) => {
				// Not Base UI's own `disabled`: that sets the native attribute on a `<button>`
				// trigger, which takes hover and focus away and with them the reason.
				if (open && disabled) {
					eventDetails.cancel();
					return;
				}

				sessionRef.current += 1;

				if (!open) {
					setPendingRowKey(null);

					if (query !== '') {
						setQuery('');
						// A server-filtered menu would otherwise keep the rows of a query the
						// field no longer shows.
						searchInputProps?.onChange?.('');
					}
				}

				onOpenChange?.(open);
			}}
		>
			{disabledTooltip == null ? (
				trigger
			) : (
				// Wrapped whenever a reason is passed, not only while it shows, so toggling
				// `disabled` does not remount the trigger and drop its focus.
				<TooltipProviderIfMissing>
					<TooltipTrigger
						handle={tooltipHandle}
						contentId={hasDisabledTooltip ? tooltipContentId : null}
					>
						{trigger}
					</TooltipTrigger>
					{hasDisabledTooltip && (
						<TooltipRoot handle={tooltipHandle}>
							<TooltipContent id={tooltipContentId}>{disabledTooltip}</TooltipContent>
						</TooltipRoot>
					)}
				</TooltipProviderIfMissing>
			)}
			<Menu.Portal container={container}>
				<Menu.Positioner
					side={side}
					align={align}
					sideOffset={DROPDOWN_SIDE_OFFSET}
					data-slot="dropdown-positioner"
					className={styles['dropdown__positioner']}
				>
					<Menu.Popup
						{...props}
						ref={popupRef}
						id={id}
						data-slot="dropdown-popup"
						className={cn(styles['dropdown'], className)}
						style={popupStyle}
						onKeyDownCapture={handlePopupKeyDown}
					>
						<DropdownProvider value={contextValue}>
							{/* TODO: mount a `<Toaster />` when the app has none, the way
							    `TooltipProviderIfMissing` does for tooltips. A rejected `onClick`
							    raises `toast.error`, which is silent without one. */}
							<TooltipProviderIfMissing>
								{searchInputProps !== undefined && (
									<DropdownSearch
										searchInputProps={searchInputProps}
										query={query}
										onQueryChange={setQuery}
										popupRef={popupRef}
										inputRef={inputRef}
									/>
								)}
								<DropdownViewport>
									{loading ? (
										<DropdownLoading content={loadingContent} />
									) : (
										<DropdownItems items={visibleItems} side="left" noContent={noContent} />
									)}
								</DropdownViewport>
							</TooltipProviderIfMissing>
						</DropdownProvider>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
});

/**
 * Renders a menu from `items`, hung off a trigger you provide (Base UI `Menu`).
 *
 * The menu owns its markup: there are no subcomponents to import and nothing to compose. Every prop
 * you write on it describes the popup: `aria-*`, `data-*`, `className` and `style` all land there.
 * `testId` is the exception, because it names the trigger.
 *
 * Visual values are `--dropdown-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### The trigger
 *
 * `children` is rendered as the element you pass, with the menu's own props merged into it. So a
 * `Button` or a `Badge` keeps its `disabled` and its tooltip, and there is no second button wrapped
 * around it.
 *
 * `nativeButton` says whether the trigger renders a native `<button>`. Leave it on for `Button` or
 * a plain `<button>`: the browser already gives those their role, focus and `Enter` and `Space`
 * activation. Set it to `false` for anything else, such as `Badge`, and Base UI adds
 * `role="button"`, `tabIndex`, `aria-disabled` and the key handlers itself. The value has to match
 * the element, so it cannot be `false` everywhere: Base UI logs an error on a mismatch in either
 * direction. The menu cannot work it out alone, because the element is only known after mount.
 *
 * `disabled` + `disabledTooltip` gate the menu: it does not open, and the reason shows in a tooltip
 * on the trigger. The trigger carries `aria-disabled` and `data-disabled`, not the native
 * `disabled`, so it stays hoverable and focusable and the reason stays reachable. A `Button`
 * trigger paints itself disabled from `aria-disabled`. Leave the trigger's own `disabled` off: a
 * native `disabled` button takes no pointer events, so the tooltip would never open.
 *
 * ### What lands on the popup
 *
 * `aria-*`, `data-*`, `className` and `style` go to the popup, not to the trigger. The trigger is
 * your node, so anything meant for it goes on it directly; the popup is portalled and is the part
 * you cannot reach.
 *
 * An icon-only trigger is the case that needs `aria-label`: Base UI names the popup from the
 * trigger, so an icon button with no text leaves the menu unnamed. An outside-click guard reading
 * `closest()` is the case that needs `data-*`: the popup is not inside the element the guard
 * watches, so it has to be able to mark itself.
 *
 * `className` and `style` reach every submenu popup too. A submenu is portalled beside the menu
 * rather than nested inside it, so no selector of yours would otherwise span the two.
 *
 * ### Opening and closing
 *
 * The menu owns its open state: there is no `open` and no `defaultOpen`. `onOpenChange` reports it,
 * for the state a trigger cannot read off itself. A purely visual rule does not need it, because
 * Base UI marks the trigger `data-popup-open` while the menu is open.
 *
 * ### Placement
 *
 * `side` and `align` are required. A menu's placement is never incidental, and reading the answer
 * off a default is how a menu ends up overhanging its trigger.
 *
 * The gap is a fixed 4px. Base UI takes it as a number on the positioner, so a token could only
 * reach it by reading computed style on every open.
 *
 * The popup flips to the opposite side and shifts along its alignment axis to stay in view, and
 * shrinks rather than overflowing the viewport.
 *
 * ### Items
 *
 * Seven kinds, told apart by a required `type`: `item`, `link`, `checkbox`, `radio-group`,
 * `submenu`, `group` and `separator`. `value` is the identity of each one: it keys the list and
 * names the row's `data-testid`. A `checkbox` and a `radio-group` are the exceptions: their
 * identity is `name`, because `value` is their selection, the way it is on `Checkbox` and
 * `RadioGroup`.
 *
 * A `link` row is an `item` that navigates: it has no `onClick`, it has `render`, and it renders as
 * whatever you hand over, a router `Link` in practice. So the row is a real anchor, with middle
 * click, "open in new tab" and the URL in the status bar. It takes no `href` of its own, because a
 * link component takes a `to`, a `href`, a `params` object or nothing at all. An inert row drops
 * `render` and falls back to the plain row: an anchor is still followed by a middle click, so the
 * only way to block one is not to render it.
 *
 * A row can block itself with `disabled` + `disabledTooltip`, or say it is waiting with `loading` +
 * `loadingTooltip`. `loading` outranks `disabled`, the way it does on `Button`. Neither takes the
 * row out of the keyboard walk, which is what keeps the reason reachable.
 *
 * A label that renders nothing falls back to the text `<No label>` and marks the row
 * `data-empty-label`.
 *
 * Selection controls are never passed in: a `checkbox` row owns its checkbox and a `radio-group`
 * owns its radios, which is what holds the rule that a row carries at most one of them and never a
 * selection control plus a disclosure.
 *
 * A submenu goes one level deep, and the type is what holds that: `items` on a submenu will not
 * take another submenu. A group is a heading rather than a nesting level, so a submenu inside one
 * is still depth 1.
 *
 * ### Nothing to show
 *
 * An empty `items`, at the root or on a submenu, renders one non-interactive row reading
 * `<No content>` and logs a warning.
 *
 * A query that matches nothing renders the same row and logs nothing. That one is a state, and so
 * is an empty `items` while `loading` is true or while `searchInputProps.filter` is `false`.
 *
 * `noContent` replaces the text of the root's row, and passing it declares an empty `items` a
 * state, so the warning goes. A submenu keeps `<No content>` and its warning: a submenu with
 * nothing in it is still a consumer bug.
 *
 * ### Search
 *
 * Passing `searchInputProps` renders the pinned search row, and the menu filters `items` itself:
 * case-insensitive substring, against each row's label when it renders to text and against its
 * `searchMetadata`. An icon-only row is findable through `searchMetadata` alone.
 *
 * A group survives when any of its rows match and renders with only those. A submenu survives on
 * its own label or on anything under it, and keeps every one of its rows: once you are inside, the
 * query that got you there is behind you. A separator that would end up first, last, or next to
 * another separator is dropped, at every level and with or without a query.
 *
 * `filter: false` turns the filtering off for a menu whose rows arrive already filtered from a
 * server. The query still reaches `onChange`, and `loading` on the search row swaps its glyph for a
 * spinner while the request is out.
 *
 * The query clears when the menu closes, and a non-empty one is reported to `onChange` as `''`.
 *
 * ### Keyboard
 *
 * Arrow keys walk the rows and wrap at both ends. `Escape` closes one level, so a submenu closes
 * before its parent does.
 *
 * The search field takes every printable key, so Base UI's typeahead does not race what is being
 * typed. `ArrowDown` from the field moves to the first row, and `ArrowUp` from the first row
 * returns to the field.
 *
 * `Enter` in the search field does nothing. A search field that fires an action on `Enter` fires it
 * against whichever row the highlight happens to be on, which is rarely the one the user was
 * reading. Arrow into the list first.
 *
 * ### Closing, and async actions
 *
 * Every row renders with Base UI's `closeOnClick` off, so `onClick` decides:
 *
 * | It returns | What happens |
 * |---|---|
 * | `undefined` or `true` | The menu closes at once |
 * | `false` | The menu stays open |
 * | a promise | The row goes `data-pending`, the rest of the list goes inert, and the menu closes when it resolves, unless it resolves `false` |
 *
 * A rejection, or an error thrown before any promise exists, keeps the menu open, clears the row and
 * raises a `toast.error` carrying the error's message. That needs a `<Toaster />` mounted somewhere in the app; without one the failure is
 * silent. A handler that wants its own copy catches its own error and resolves `false`.
 *
 * ### Tooltips
 *
 * A row's reason and the full text of a truncated label share one popup, reason first. Truncation
 * is always on: every label behaves the way `ellipsis` does on `RadioGroup` and `ToggleGroup`, so
 * the row pitch stays constant.
 *
 * A tooltip opens to the left of a row in the menu and to the right of a row in a submenu, away
 * from the rows it would otherwise cover.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and it names everything else: a row is
 * `` `${testId}-item-${value}` ``, a group `` `${testId}-group-${value}` ``, a radio group
 * `` `${testId}-radio-group-${name}` ``, and the search row, the loading row and the empty row are
 * `` `${testId}-search` ``, `` `${testId}-loading` `` and `` `${testId}-empty` ``. A row's own
 * `testId` wins. Otherwise use the data attributes, never the hashed class names.
 *
 * | popup attribute | value |
 * |---|---|
 * | `data-slot` | `"dropdown-popup"` |
 * | `data-submenu` | present on a submenu's popup |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `dropdown-trigger` | always, merged into the element you passed as `children` |
 * | `dropdown-positioner` | always, the box the popup is placed in |
 * | `dropdown-viewport` | always, the scrolling part, `data-scroll-start` and `data-scroll-end` while that edge clips a row |
 * | `dropdown-search` | only with `searchInputProps`, a sibling of the viewport so it stays pinned |
 * | `dropdown-search-input`, `dropdown-search-prefix` | inside the search row |
 * | `dropdown-search-suffix` | inside the search row, only when `searchInputProps.suffix` is set |
 * | `dropdown-item` | one per `item` row, `data-danger`, `data-disabled`, `data-loading` and `data-pending` as they apply |
 * | `dropdown-link` | one per `link` row, `data-disabled` and `data-loading` as they apply |
 * | `dropdown-checkbox-item`, `dropdown-radio-item` | one per row of that kind |
 * | `dropdown-radio-group` | one per `radio-group` row, `data-disabled` while the whole group is |
 * | `dropdown-submenu-trigger` | one per `submenu` row |
 * | `dropdown-submenu-chevron` | the trailing glyph of a `submenu` row |
 * | `dropdown-item-prefix`, `dropdown-item-suffix` | only when the row has one, the prefix also while a spinner is in it, the suffix always on a checkbox or radio row |
 * | `dropdown-item-label` | the measured element, `data-truncated` while it does not fit, `data-empty-label` while it is the fallback |
 * | `dropdown-item-indicator` | inside a checkbox or radio row, `data-checked` while it is selected |
 * | `dropdown-group`, `dropdown-group-label` | one per `group` row |
 * | `dropdown-separator` | one per `separator` row that survived the cleanup |
 * | `dropdown-loading` | only while `loading` |
 * | `dropdown-empty` | only when there is nothing to show |
 *
 * @example
 * ```tsx
 * <Dropdown
 *   nativeButton
 *   side="bottom"
 *   align="start"
 *   items={[
 *     { type: 'item', value: 'rename', label: 'Rename' },
 *     { type: 'separator', value: 'after-rename' },
 *     { type: 'link', value: 'docs', label: 'Documentation', render: <Link to="/docs" /> },
 *     { type: 'item', value: 'delete', label: 'Delete', danger: true },
 *   ]}
 * >
 *   <Button variant="outlined">Actions</Button>
 * </Dropdown>
 * ```
 *
 * @example
 * ```tsx
 * // Searchable, and one row waits on the server before the menu closes
 * <Dropdown
 *   nativeButton
 *   side="bottom"
 *   align="end"
 *   testId="row-actions"
 *   searchInputProps={{ placeholder: 'Find an action' }}
 *   items={[
 *     { type: 'group', value: 'edit', label: 'Edit', items: [
 *       { type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil /> },
 *       { type: 'item', value: 'archive', label: 'Archive', onClick: () => archive(id) },
 *     ] },
 *     { type: 'checkbox', name: 'pinned', label: 'Pinned', value: pinned, onChange: setPinned },
 *   ]}
 * >
 *   <Button variant="outlined" aria-label="Row actions" prefix={<Ellipsis />} />
 * </Dropdown>
 * ```
 *
 * @example
 * ```tsx
 * // An icon-only trigger, named through the menu so the popup is named too
 * <Dropdown
 *   nativeButton
 *   side="bottom"
 *   align="end"
 *   aria-label="Column options"
 *   items={columnItems}
 * >
 *   <Button variant="ghost" prefix={<Ellipsis />} aria-label="Column options" />
 * </Dropdown>
 * ```
 */
export const Dropdown = DropdownImpl as <T extends DropdownProps>(
	props: T &
		ValidateDropdownProps<T> &
		// `T` is inferred from the call site, so `T extends DropdownProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof DropdownProps | keyof RefAttributes<HTMLButtonElement>>, never> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
