import { Dialog } from '@base-ui/react/dialog';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useRef,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import type { RejectedProps } from '../lib/utils.js';
import styles from './command.module.scss';
import { CommandLayer } from './subcomponents/command-layer.js';
import { CommandPanel } from './subcomponents/command-panel.js';
import type { CommandProps, ValidateCommandProps } from './types.js';
import { runThenClose } from './utils.js';

const CommandImpl = forwardRef<HTMLDivElement, CommandProps & RejectedProps>(
	function Command(props, ref) {
		const {
			items,
			label,
			open,
			onOpenChange,
			searchInputProps,
			noContent,
			contentMaxWidth,
			contentMaxHeight,
			testId,
			className: _className,
			style: _style,
			...popupProps
		} = props;

		const inputRef = useRef<HTMLInputElement>(null);

		const panelStyle = {
			...(contentMaxWidth != null && {
				'--command-internal-max-inline-size': toCssLength(contentMaxWidth),
			}),
			...(contentMaxHeight != null && {
				'--command-internal-max-block-size': toCssLength(contentMaxHeight),
			}),
		} as CSSProperties;

		return (
			<Dialog.Root
				open={open}
				// Only the open state: Base UI's event details are not part of `onOpenChange`.
				onOpenChange={(nextOpen) => {
					onOpenChange(nextOpen);
				}}
			>
				<Dialog.Portal>
					<CommandLayer>
						<Dialog.Backdrop
							// With a backdrop mounted, Base UI reports only a press on the backdrop as outside,
							// so a press on a toast leaves the palette open.
							data-slot="command-backdrop"
							className={styles['command__backdrop']}
						/>
						<Dialog.Popup
							ref={ref}
							// On close, Base UI returns the focus to the element that had it before the open.
							initialFocus={inputRef}
							{...popupProps}
							data-slot="command"
							className={styles['command']}
							style={panelStyle}
							{...(testId === undefined ? {} : { 'data-testid': testId })}
						>
							<Dialog.Title className={styles['command__visually-hidden']}>{label}</Dialog.Title>
							<CommandPanel
								items={items}
								label={label}
								searchInputProps={searchInputProps}
								noContent={noContent}
								onPick={(item) => {
									runThenClose(item, onOpenChange);
								}}
								testId={testId}
								inputRef={inputRef}
							/>
						</Dialog.Popup>
					</CommandLayer>
				</Dialog.Portal>
			</Dialog.Root>
		);
	},
);

/**
 * The command palette: a modal dialog with a search field over a list of actions (Base UI
 * `Autocomplete` inside Base UI `Dialog`). The user types, the list narrows and ranks, and `Enter`
 * or a click runs the highlighted row.
 *
 * The ref, `id`, `aria-*` and `data-*` land on the dialog panel.
 *
 * Visual values are `--command-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The panel is a `dialog` named by `label`, and the field is a `combobox` named by the same
 * `label`. The highlighted row carries `aria-selected="true"`, and the field points at it with
 * `aria-activedescendant`.
 *
 * ### Opening and closing
 *
 * The palette has no trigger, so the app holds `open` and binds `⌘K` or `Ctrl+K` itself. It opens
 * 110px below the top of the viewport and grows downward, so the field stays still while the list
 * changes height. It stops short of the bottom of the viewport, and the list scrolls in what is
 * left. The focus moves to the field on open and returns where it was on close.
 *
 * Inside the palette `Ctrl+K` moves the highlight up and calls `preventDefault()`. A listener
 * that toggles the palette skips an event with `defaultPrevented`, or that key closes it.
 *
 * The backdrop and the panel share one stacking layer, `--command-z-index`. The palette stacks
 * above the layer the focus was in when it opened, such as a modal from another library.
 *
 * Picking a row runs its `onClick`, then calls `onOpenChange(false)`, also when `onClick` throws.
 * `Esc` and a click outside call `onOpenChange(false)` too.
 *
 * ### Search
 *
 * The query letters must appear in order and may skip characters: `dshb` finds `Dashboards`. A row
 * matches on its label, when the label renders to text, and on `searchMetadata`. As in cmdk, the
 * rows outside any group come first, best first, wherever they sit in `items`. The groups follow,
 * sorted by their best row, with their rows best first. A group with no match disappears, heading
 * included.
 *
 * Every change to the query reaches `searchInputProps.onChange`. The query clears when the palette
 * closes, and a non-empty one is reported as `''`. `searchInputProps.filter: false` turns the
 * filtering and the ranking off for rows a server already filtered. `noContent={null}` shows
 * nothing when no row matches.
 *
 * ### Keyboard
 *
 * The focus never leaves the field, and the keys are cmdk's. `ArrowDown` and `ArrowUp` move the
 * highlight and wrap, and so do `Ctrl+N` or `Ctrl+J` and `Ctrl+P` or `Ctrl+K`. `Home` and `End`, or
 * `Meta` with an arrow, go to the first and the last row. With a modifier, `Home` and `End` stay
 * the field's, so `Shift+Home` selects the query. `Alt` with an arrow goes to the first row of the
 * next or the previous group. `Enter` runs the highlighted row, with or without a modifier. The
 * first row is highlighted on open and after every change to the query.
 *
 * A row with a `shortcut` keeps its label as its name and carries the shortcut as its description.
 *
 * ### Blocked and waiting rows
 *
 * A row blocks itself with `disabled` + `disabledTooltip`, and says it is waiting with `loading` +
 * `loadingTooltip`. `loading` outranks `disabled`, as on `Button`. Neither row runs its `onClick`
 * on a click or on `Enter`, with or without a modifier, and the palette stays open. Both carry
 * `aria-disabled` and stay in the arrow walk, so their reason stays reachable.
 *
 * The reason opens in a tooltip beside the row while the row is highlighted, from the keyboard as
 * from the pointer, and a screen reader reads it as the row's description, before the shortcut.
 *
 * A loading row swaps its prefix for a spinner. A row without a prefix shows the spinner in the
 * trailing slot instead, in place of its suffix or its shortcut, so the label stays where it is.
 *
 * ### Asserting on it
 *
 * `testId` lands on the panel and names every part below as `` `${testId}-${part}` ``. A row or a
 * group with its own `testId` keeps it.
 *
 * | Attribute | On | When |
 * | --- | --- | --- |
 * | `data-highlighted` | `command-item` | The row `Enter` runs |
 * | `data-disabled` | `command-item` | The row is `disabled` and not `loading` |
 * | `data-loading` | `command-item` | The row is `loading` |
 * | `data-loading` | `command-item-prefix`, `command-item-suffix` | The slot shows the row's spinner |
 * | `data-empty-label` | `command-item-label` | The label renders nothing and shows `<No label>` |
 * | `data-loading` | `command-search-prefix` | `searchInputProps.loading` is true |
 * | `data-scroll-start` | `command-viewport` | The list is scrolled down from its top |
 * | `data-scroll-end` | `command-viewport` | The list has more rows below what shows |
 *
 * | `data-slot` | Rendered | Test ID |
 * | --- | --- | --- |
 * | `command-layer` | Always, around the backdrop and the panel | |
 * | `command-backdrop` | Always | |
 * | `command` | Always, the panel | `{testId}` |
 * | `command-search` | Always | |
 * | `command-search-prefix` | Always | `{testId}-search-prefix` |
 * | `command-search-input` | Always | `{testId}-search` |
 * | `command-search-suffix` | With `searchInputProps.suffix` | `{testId}-search-suffix` |
 * | `command-viewport` | Always, the part that scrolls, around the list | |
 * | `command-list` | Always | |
 * | `command-empty` | When no row shows and `noContent` renders | `{testId}-empty` |
 * | `command-group` | Per group with a row to show | `{testId}-group-{value}` |
 * | `command-group-label` | Per group | |
 * | `command-item` | Per row | `{testId}-item-{value}` |
 * | `command-item-prefix` | With `prefix` | `{testId}-item-{value}-prefix` |
 * | `command-item-label` | Per row | |
 * | `command-item-suffix` | With `suffix` or `shortcut`, or `loading` without `prefix` | `{testId}-item-{value}-suffix` |
 *
 * Use these, never the hashed class names.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Command
 *   label="Command palette"
 *   open={open}
 *   onOpenChange={setOpen}
 *   searchInputProps={{ placeholder: 'Search…' }}
 *   items={[
 *     {
 *       type: 'group',
 *       value: 'navigation',
 *       label: 'Navigation',
 *       items: [
 *         { type: 'item', value: 'home', label: 'Go to Home', prefix: <Home />, shortcut: 'Shift+H', onClick: goHome },
 *         { type: 'item', value: 'logs', label: 'Logs Explorer', searchMetadata: 'search query', onClick: goLogs },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Rows a server filters: report the query, show the wait, keep the order
 * <Command
 *   label="Search everything"
 *   open={open}
 *   onOpenChange={setOpen}
 *   searchInputProps={{ placeholder: 'Search…', filter: false, loading: isFetching, onChange: setQuery }}
 *   items={results}
 * />
 * ```
 */
export const Command = CommandImpl as <T extends CommandProps>(
	props: T &
		ValidateCommandProps<T> &
		// `T` is inferred from the call site, so `T extends CommandProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof CommandProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
