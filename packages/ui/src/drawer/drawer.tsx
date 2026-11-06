import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import {
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useMemo,
	useRef,
	useState,
} from 'react';
import { DialogLayer } from '../dialog/subcomponents/dialog-layer.js';
import { DialogPayload } from '../dialog/subcomponents/dialog-payload.js';
import { DialogPortal } from '../dialog/subcomponents/dialog-portal.js';
import type { NoHandle } from '../dialog/types.js';
import { useCloseHandleOnUnmount } from '../dialog/use-close-handle-on-unmount.js';
import { useDialogHandleState } from '../dialog/use-dialog-handle-state.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { PopupContainer } from '../lib/popup-container.js';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import { Skeleton } from '../skeleton/index.js';
import styles from './drawer.module.scss';
import { DrawerFooter } from './subcomponents/drawer-footer.js';
import { DrawerHeader } from './subcomponents/drawer-header.js';
import type {
	DrawerCloseReasonType,
	DrawerHandleType,
	DrawerProps,
	ValidateDrawerProps,
} from './types.js';
import { useFocusFallback } from './use-focus-fallback.js';
import { toDrawerCloseReason } from './utils.js';

const DrawerImpl = forwardRef<HTMLDivElement, DrawerProps & RejectedProps>(function Drawer(
	{
		type,
		open,
		handle,
		container,
		onClose,
		title,
		headerPrefix,
		titlePrefix,
		titleSuffix,
		headerSuffix,
		description,
		children,
		initialFocus,
		finalFocus,
		footerPrefix,
		footerSuffix,
		loading = false,
		loadingContent,
		width = 'base',
		testId,
		className: _className,
		style: _style,
		...props
	},
	ref,
) {
	const popupRef = useRef<HTMLDivElement | null>(null);
	const [panel, setPanel] = useState<HTMLDivElement | null>(null);
	const mergedRef = useMemo(() => mergeRefs(ref, popupRef, setPanel), [ref]);
	useFocusFallback(panel);
	// With a handle the handle owns the open state, and the drawer closes itself on a request.
	const handleState = useDialogHandleState(handle);
	useCloseHandleOnUnmount(handle);
	const isOpen = handle ? handleState.open : (open ?? false);
	// A type the types reject, such as `undefined` from a wrapper, renders an inspector, the drawer
	// that leaves the page usable, rather than a viewport that takes the pointer with no backdrop.
	const resolvedType = type === 'task' ? 'task' : 'inspector';
	const isTask = resolvedType === 'task';

	const requestClose = (reason: DrawerCloseReasonType): void => {
		if (handle) {
			handle.close();
		} else {
			onClose?.(reason);
		}
	};

	return (
		<DrawerPrimitive.Root
			open={isOpen}
			// An inspector leaves the page usable: no focus trap, no scroll lock, and neither a press
			// outside nor the focus moving out of it closes it.
			modal={isTask}
			disablePointerDismissal={!isTask}
			swipeDirection="right"
			onOpenChange={(nextOpen, eventDetails) => {
				const reason = toDrawerCloseReason(eventDetails.reason);
				if (!nextOpen && reason) {
					requestClose(reason);
				}
			}}
		>
			<DialogPortal container={container}>
				<DialogLayer
					className={styles['drawer__layer']}
					slot="drawer-layer"
					zIndex="var(--drawer-z-index, 50)"
				>
					{isTask ? (
						<DrawerPrimitive.Backdrop
							className={styles['drawer__backdrop']}
							data-slot="drawer-backdrop"
							data-testid={partTestId(testId, 'backdrop')}
						/>
					) : null}
					<DrawerPrimitive.Viewport className={styles['drawer__viewport']} data-type={resolvedType}>
						<DrawerPrimitive.Popup
							ref={mergedRef}
							// Base UI's default is the first tabbable element of the panel, which is the
							// first button of the header. The panel itself takes it, so a screen reader
							// reads the title first.
							initialFocus={initialFocus ?? popupRef}
							finalFocus={finalFocus}
							className={styles['drawer']}
							aria-busy={loading || undefined}
							{...props}
							// After the spread: a `data-*` from the call site may not take the slot, the
							// state or the test id the component is found and styled by, and an `aria-*`
							// may not undo the modal.
							aria-modal={isTask ? 'true' : undefined}
							data-testid={testId}
							data-type={resolvedType}
							data-width={width}
							data-loading={loading || undefined}
							data-slot="drawer-popup"
						>
							<PopupContainer>
								<DrawerPrimitive.Content className={styles['drawer__content']}>
									<DrawerHeader
										title={title}
										headerPrefix={headerPrefix}
										titlePrefix={titlePrefix}
										titleSuffix={titleSuffix}
										headerSuffix={headerSuffix}
										// The type and the runtime agree: an inspector drops what its type
										// rejects.
										description={isTask ? description : undefined}
										loading={loading}
										testId={testId}
										popupRef={popupRef}
										onClosePress={() => {
											requestClose('close-press');
										}}
									/>
									<div
										className={styles['drawer__body']}
										data-slot="drawer-body"
										data-testid={partTestId(testId, 'body')}
									>
										{loading ? (
											(loadingContent ?? <Skeleton testId={partTestId(testId, 'body-skeleton')} />)
										) : (
											<DialogPayload payload={handleState.payload}>{children}</DialogPayload>
										)}
									</div>
									{isTask ? (
										<DrawerFooter
											footerPrefix={footerPrefix}
											footerSuffix={footerSuffix}
											loading={loading}
											testId={testId}
										/>
									) : null}
								</DrawerPrimitive.Content>
							</PopupContainer>
						</DrawerPrimitive.Popup>
					</DrawerPrimitive.Viewport>
				</DialogLayer>
			</DialogPortal>
		</DrawerPrimitive.Root>
	);
});

/**
 * Renders a panel that slides in from the right edge of the page, with a header, a body that
 * scrolls and, on a `task`, a footer (Base UI Drawer).
 *
 * `type` sets how it treats the page: an `inspector` shows one record to read and leaves the page
 * usable, a `task` is one job to finish behind a backdrop. A yes or no confirmation is an
 * `AlertDialog`, a short form that does not need the page beside it is a `Dialog`.
 *
 * `id`, `ref`, `aria-*` and `data-*` land on the panel. `className` and `style` are not
 * forwarded.
 *
 * Visual values are `--drawer-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts). The colours come from the `--drawer-background`, `--drawer-border`,
 * `--drawer-shadow` and `--drawer-backdrop` design tokens.
 *
 * The panel is a `role="dialog"` named by `title`, and described by `description` on a `task`. A
 * `task` panel is `aria-modal="true"`. The close button is labelled `Close`.
 *
 * ### Inspector or task
 *
 * An `inspector` has no backdrop, traps no focus and locks no scroll, so the list behind it stays
 * usable. A press outside it does not close it. It has no footer and no description.
 *
 * A `task` is modal: focus is trapped in the panel, the page behind the backdrop does not scroll
 * and is hidden from assistive technology, and a press on the backdrop asks to close. Its footer
 * holds the actions.
 *
 * ### Controlled, or from a handle
 *
 * With `open`, the drawer never opens or closes itself. `onClose` reports the request with its
 * reason, and the drawer stays open until `open` becomes `false`. A `task` with unsaved edits opens
 * a nested `AlertDialog` from its `onClose` and its Cancel instead of closing.
 *
 * With a `handle` from `useDrawerHandle()`, `handle.open(payload)` shows the drawer from anywhere,
 * such as a row of a table, and `children` may be a function of that payload. Calling it again
 * swaps the payload in place. The drawer closes itself on every close request, so `open` and
 * `onClose` are not passed.
 *
 * Either way, a closed drawer unmounts its content and keeps no state. A drawer on a handle that
 * unmounts while open closes its handle.
 *
 * ### Loading
 *
 * With `loading`, the drawer opens before its content is ready. The title, the `titlePrefix` and
 * the `description` show a skeleton, the `titleSuffix` is hidden, and the `headerPrefix` and
 * `headerSuffix` stay on screen but take no input. The body shows `loadingContent`, or a default
 * skeleton, and the footer slots show a skeleton. The close button and `Esc` keep working. The
 * panel is `aria-busy` and still named by `title`. Focus on a part that goes inert or unmounts moves
 * to the panel.
 *
 * ### Focus and keyboard
 *
 * Focus starts on the panel, so a screen reader reads the title, and goes back on close to the
 * element that had it when the drawer opened. `Esc` closes only the top layer: a popup open inside
 * the panel first, then the drawer. A swipe towards the right edge on a touch screen asks to close
 * with the `swipe` reason. The drawer adds no `Enter` or arrow key handler of its own.
 *
 * ### Layering
 *
 * The drawer renders in `document.body`, or in `container`. It shares one layer with `Dialog` and
 * `AlertDialog`, in open order: a dialog opened from a drawer covers it, and a drawer opened from a
 * dialog covers the dialog, with no `zIndex`. Tooltips, dropdowns, selects, popovers and toasts
 * opened inside it portal into the panel and render above it.
 *
 * ### Asserting on it
 *
 * `testId` lands on the panel and names every part. Use these, never the hashed class names.
 *
 * | Data attribute | On | Values |
 * | --- | --- | --- |
 * | `data-type` | panel | `inspector`, `task` |
 * | `data-width` | panel | `narrow`, `base`, `wide`, `extra-wide`, `entity` |
 * | `data-open` / `data-closed` | panel | present while open / while the exit runs |
 * | `data-loading` | panel, `drawer-header-prefix`, `drawer-header-suffix`, `drawer-title-prefix` | present while `loading` |
 * | `data-swiping` | panel | present while a swipe drags it |
 *
 * | `data-slot` | Rendered |
 * | --- | --- |
 * | `drawer-backdrop` | on a `task` |
 * | `drawer-popup` | always, the panel |
 * | `drawer-header` | always |
 * | `drawer-header-prefix` | when `headerPrefix` renders something |
 * | `drawer-title-prefix` | when `titlePrefix` renders something |
 * | `drawer-title` | always |
 * | `drawer-title-suffix` | when `titleSuffix` renders something, and not while `loading` |
 * | `drawer-description` | on a `task`, when `description` renders something |
 * | `drawer-header-suffix` | when `headerSuffix` renders something |
 * | `drawer-close` | always |
 * | `drawer-title-skeleton` | while `loading`, the box around the title skeleton |
 * | `drawer-description-skeleton` | while `loading` and `description` renders something |
 * | `drawer-body` | always |
 * | `drawer-footer` | on a `task`, when `footerSuffix` renders something |
 * | `drawer-footer-prefix` | when `footerPrefix` and `footerSuffix` both render something |
 * | `drawer-footer-suffix` | on a `task`, when `footerSuffix` renders something |
 *
 * @example
 * ```tsx
 * // A record opened from a list, stepping through its rows. `open` is kept apart from the row, so
 * // the record stays on screen while the drawer slides out.
 * <Drawer
 *   type="inspector"
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title={selected.name}
 *   width="extra-wide"
 *   headerPrefix={
 *     <>
 *       <Button variant="ghost" color="secondary" size="sm" icon aria-label="Previous span"
 *         disabled={isFirst} disabledTooltip="This is the first span" onClick={selectPrevious}>
 *         <ChevronUp />
 *       </Button>
 *       <Button variant="ghost" color="secondary" size="sm" icon aria-label="Next span"
 *         disabled={isLast} disabledTooltip="This is the last span" onClick={selectNext}>
 *         <ChevronDown />
 *       </Button>
 *     </>
 *   }
 * >
 *   <SpanDetails span={selected} />
 * </Drawer>
 * ```
 *
 * @example
 * ```tsx
 * // An edit form with a destructive action apart from the actions
 * <Drawer
 *   type="task"
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit member"
 *   width="wide"
 *   footerPrefix={<Button variant="solid" color="danger" size="md" onClick={confirmDelete}>Delete</Button>}
 *   footerSuffix={
 *     <>
 *       <Button variant="outlined" color="secondary" size="md" onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </Button>
 *       <Button variant="solid" color="primary" size="md" type="submit" form="edit-member">
 *         Save changes
 *       </Button>
 *     </>
 *   }
 * >
 *   <form id="edit-member" onSubmit={save}>…</form>
 * </Drawer>
 * ```
 *
 * @example
 * ```tsx
 * // One drawer for every row of the table, opened from the row
 * const logDetails = useDrawerHandle<LogRow>();
 *
 * <Drawer handle={logDetails} type="inspector" title="Log details" width="extra-wide">
 *   {(log) => <LogDetails log={log} />}
 * </Drawer>
 *
 * <TableRow onClick={() => logDetails.open(row)} />
 * ```
 */
export const Drawer = DrawerImpl as <
	Payload = NoHandle,
	T extends Omit<DrawerProps<Payload>, 'children'> = Omit<DrawerProps<Payload>, 'children'>,
>(
	// The same signature as `Dialog`, which explains each part: excess keys pinned to `never`,
	// `handle` restated so `Payload` is inferred from it, and `children` read through `NoInfer` so
	// an unannotated `(row) => …` is typed from the handle alone.
	props: T & { handle?: DrawerHandleType<Payload> } & {
		children: DrawerProps<NoInfer<Payload>>['children'];
	} & ValidateDrawerProps<T, NoInfer<Payload>> &
		Record<
			Exclude<keyof T, keyof DrawerProps<Payload> | keyof RefAttributes<HTMLDivElement>>,
			never
		> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
