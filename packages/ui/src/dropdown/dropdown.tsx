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
	useMemo,
	useRef,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { cn } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { DROPDOWN_ROW_SELECTOR, DROPDOWN_SIDE_OFFSET } from './constants.js';
import { type DropdownContextValue, DropdownProvider } from './dropdown-context.js';
import styles from './dropdown.module.scss';
import { DropdownItems } from './subcomponents/dropdown-items.js';
import { DropdownLoading } from './subcomponents/dropdown-loading.js';
import { DropdownSearch } from './subcomponents/dropdown-search.js';
import { DropdownViewport } from './subcomponents/dropdown-viewport.js';
import type { DropdownProps, ValidateDropdownProps } from './types.js';
import { filterDropdownItems } from './utils.js';

const ARIA_PREFIX = 'aria-';

const DropdownImpl = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown(
	{
		items,
		children,
		align,
		side,
		contentMaxWidth,
		contentMaxHeight,
		container,
		loading = false,
		loadingContent,
		searchInputProps,
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
	const [pendingValue, setPendingValue] = useState<string | null>(null);

	// `aria-*` lands on the popup and `data-*` on the trigger. The trigger is the consumer's own
	// node, so they can write anything on it directly; the popup is portalled and is the part they
	// cannot reach. An icon-only trigger is the case that needs it: Base UI names the popup from
	// the trigger, and an icon button with no text leaves the menu unnamed.
	const [ariaProps, dataProps] = useMemo(() => {
		const aria: Record<string, unknown> = {};
		const data: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(props)) {
			if (key.startsWith(ARIA_PREFIX)) {
				aria[key] = value;
			} else {
				data[key] = value;
			}
		}

		return [aria, data];
	}, [props]);

	const isFiltering = searchInputProps !== undefined && searchInputProps.filter !== false;
	const visibleItems = useMemo(
		() => filterDropdownItems(items, isFiltering ? query : ''),
		[items, query, isFiltering],
	);

	// An empty `items` is a consumer bug rather than a state, unlike a query that matches nothing,
	// which is why only this path warns.
	useEffect(() => {
		if (items.length === 0) {
			console.warn('Dropdown: `items` is empty, showing the empty row.');
		}
	}, [items.length]);

	const close = useCallback((): void => {
		actionsRef.current?.close();
	}, []);

	// The props compose with the tokens instead of overwriting `style.maxWidth`, the way
	// `ToggleGroup`'s `width` and `maxWidth` do.
	const popupStyle = useMemo(
		() =>
			({
				...(contentMaxWidth != null && {
					'--dropdown-internal-max-inline-size': toCssLength(contentMaxWidth),
				}),
				...(contentMaxHeight != null && {
					'--dropdown-internal-max-block-size': toCssLength(contentMaxHeight),
				}),
			}) as CSSProperties,
		[contentMaxWidth, contentMaxHeight],
	);

	const contextValue = useMemo(
		(): DropdownContextValue => ({
			testId,
			close,
			pendingValue,
			setPendingValue,
			container,
			popupStyle,
		}),
		[testId, close, pendingValue, container, popupStyle],
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

	return (
		<Menu.Root
			actionsRef={actionsRef}
			modal={false}
			loopFocus
			highlightItemOnHover
			orientation="vertical"
			onOpenChange={(open) => {
				if (!open) {
					setQuery('');
					setPendingValue(null);
				}
			}}
		>
			<Menu.Trigger
				ref={ref}
				data-slot="dropdown-trigger"
				{...dataProps}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
				{...(isValidElement(children) ? { render: children } : { children })}
			/>
			<Menu.Portal container={container}>
				<Menu.Positioner
					side={side}
					align={align}
					sideOffset={DROPDOWN_SIDE_OFFSET}
					data-slot="dropdown-positioner"
					className={styles['dropdown__positioner']}
				>
					<Menu.Popup
						ref={popupRef}
						id={id}
						data-slot="dropdown-popup"
						className={cn(styles['dropdown'], className)}
						style={{ ...style, ...popupStyle }}
						onKeyDownCapture={handlePopupKeyDown}
						{...ariaProps}
					>
						<DropdownProvider value={contextValue}>
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
										<DropdownItems items={visibleItems} side="left" />
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
 * The menu owns its markup: there are no subcomponents to import and nothing to compose. Every
 * `data-*` lands on the trigger, and every `aria-*` on the popup.
 *
 * Visual values are `--dropdown-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### The trigger
 *
 * `children` is rendered as the element you pass, with the menu's own props merged into it. So a
 * `Button`, a `Badge` or an `Input` keeps its type, its `disabled` and its tooltip, and there is no
 * second button wrapped around it.
 *
 * There is no `disabled` on the menu, and no `disabledTooltip`. Gating is the trigger's job, and
 * every trigger candidate already carries the pair. A second gate here would be a third way to
 * express the same state, and it would have to agree with the trigger's own.
 *
 * ### Naming the menu
 *
 * `aria-*` goes to the popup, not to the trigger. The trigger is your node, so you can write on it
 * directly; the popup is portalled and is the part you cannot reach.
 *
 * An icon-only trigger is the case that needs it. Base UI names the popup from the trigger, so an
 * icon button with no text leaves the menu unnamed: pass `aria-label` to `Dropdown` and it lands
 * where it is needed.
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
 * Six kinds, told apart by a required `type`: `item`, `checkbox`, `radio-group`, `submenu`,
 * `group` and `separator`. `value` is the identity of each one: it keys the list and names the
 * row's `data-testid`.
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
 * `<No content>` and logs a warning. That is a consumer bug rather than a state, which is why there
 * is no `emptyContent` prop.
 *
 * A query that matches nothing renders the same row and logs nothing. That one is a state.
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
 * another separator is dropped.
 *
 * `filter: false` turns the filtering off for a menu whose rows arrive already filtered from a
 * server. The query still reaches `onChange`, and `loading` on the search row swaps its glyph for a
 * spinner while the request is out.
 *
 * The query clears when the menu closes.
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
 * A rejection keeps the menu open, clears the row and raises a `toast.error` carrying the error's
 * message. That needs a `<Toaster />` mounted somewhere in the app; without one the failure is
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
 * `` `${testId}-radio-group-${value}` ``, and the search row, the loading row and the empty row are
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
 * | `dropdown-viewport` | always, the scrolling part |
 * | `dropdown-search` | only with `searchInputProps`, a sibling of the viewport so it stays pinned |
 * | `dropdown-item` | one per `item` row, `data-destructive`, `data-disabled`, `data-loading` and `data-pending` as they apply |
 * | `dropdown-checkbox-item`, `dropdown-radio-item` | one per row of that kind |
 * | `dropdown-submenu-trigger` | one per `submenu` row |
 * | `dropdown-item-prefix`, `dropdown-item-suffix` | only when the row has one, the prefix also while a spinner is in it |
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
 *   side="bottom"
 *   align="start"
 *   items={[
 *     { type: 'item', value: 'rename', label: 'Rename' },
 *     { type: 'separator', value: 'after-rename' },
 *     { type: 'item', value: 'delete', label: 'Delete', destructive: true },
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
 *   side="bottom"
 *   align="end"
 *   testId="row-actions"
 *   searchInputProps={{ placeholder: 'Find an action' }}
 *   items={[
 *     { type: 'group', value: 'edit', label: 'Edit', items: [
 *       { type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil /> },
 *       { type: 'item', value: 'archive', label: 'Archive', onClick: () => archive(id) },
 *     ] },
 *     { type: 'checkbox', value: 'pinned', label: 'Pinned', checked: pinned, onChange: setPinned },
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
