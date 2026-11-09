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
import { DrawerStackProvider } from './drawer-stack-context.js';
import { DrawerFooter } from './subcomponents/drawer-footer.js';
import { DrawerHeader } from './subcomponents/drawer-header.js';
import { DrawerTrail } from './subcomponents/drawer-trail.js';
import type {
	DrawerCloseReasonType,
	DrawerHandleType,
	DrawerProps,
	DrawerTrailStepType,
	ValidateDrawerProps,
} from './types.js';
import { useDrawerStack } from './use-drawer-stack.js';
import { useFocusFallback } from './use-focus-fallback.js';
import { toDrawerCloseReason } from './utils.js';

const NO_STEPS: readonly DrawerTrailStepType[] = [];

const DrawerImpl = forwardRef<HTMLDivElement, DrawerProps & RejectedProps>(function Drawer(
	{
		type,
		stack,
		crumb,
		trailEllipsis,
		trail: steps = NO_STEPS,
		onTrailSelect,
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

	const {
		isNested,
		nestedIn,
		inTrail,
		layerType,
		covered,
		style: stackStyle,
		value: stackValue,
		requestCloseFromPanel,
	} = useDrawerStack({
		stack,
		type: resolvedType,
		title,
		crumb,
		steps,
		onTrailSelect,
		trailEllipsis,
		isOpen,
		panel,
		popupRef,
		requestClose,
	});
	const isModal = layerType === 'task';

	return (
		<DrawerPrimitive.Root
			open={isOpen}
			// An inspector leaves the page usable: no focus trap, no scroll lock, and neither a press
			// outside nor the focus moving out of it closes it.
			modal={isModal}
			disablePointerDismissal={!isModal}
			swipeDirection="right"
			onOpenChange={(nextOpen, eventDetails) => {
				const reason = toDrawerCloseReason(eventDetails.reason);
				if (!nextOpen && reason) {
					requestCloseFromPanel(reason);
				}
			}}
		>
			<DialogPortal container={container}>
				<DialogLayer
					className={styles['drawer__layer']}
					slot="drawer-layer"
					zIndex="var(--drawer-z-index, 50)"
				>
					{isTask && !inTrail ? (
						<DrawerPrimitive.Backdrop
							// Base UI renders the backdrop of the outermost dialog only. A `task` nested
							// in an overlay drawer has its own, over the drawer it opens from, while a
							// `task` declared in a `Dialog` keeps the dialog's.
							forceRender={isNested}
							className={styles['drawer__backdrop']}
							data-slot="drawer-backdrop"
							data-testid={partTestId(testId, 'backdrop')}
						/>
					) : null}
					<DrawerPrimitive.Viewport className={styles['drawer__viewport']} data-type={layerType}>
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
							style={stackStyle}
							aria-modal={isModal ? 'true' : undefined}
							data-testid={testId}
							data-type={resolvedType}
							data-width={width}
							data-loading={loading || undefined}
							data-nested={nestedIn}
							// Valued by how it is covered: under a breadcrumb trail it is out of sight, and its
							// content skips layout and paint.
							data-covered={covered}
							data-slot="drawer-popup"
						>
							<DrawerStackProvider value={stackValue}>
								<DrawerPrimitive.Content className={styles['drawer__content']}>
									{/* Inside the content, so a press in a menu portalled here is not taken for the
									    start of a swipe: Base UI ignores the swipe on the content only. */}
									<PopupContainer>
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
												requestCloseFromPanel('close-press');
											}}
										/>
										{stackValue.trail.length > 1 ? (
											<DrawerTrail
												trail={stackValue.trail}
												ellipsis={stackValue.trailEllipsis}
												testId={testId}
											/>
										) : null}
										<div
											className={styles['drawer__body']}
											data-slot="drawer-body"
											data-testid={partTestId(testId, 'body')}
										>
											{loading ? (
												(loadingContent ?? (
													<Skeleton testId={partTestId(testId, 'body-skeleton')} />
												))
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
									</PopupContainer>
								</DrawerPrimitive.Content>
							</DrawerStackProvider>
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
 * ### Nested drawers
 *
 * A drawer declared inside another one, in its body or a header slot, renders the way the outer
 * drawer's `stack` says, and takes its width from it.
 *
 * With `stack="breadcrumb"`, the nested drawer drills down: it opens in place at the same width,
 * with no movement, and a trail of crumbs under its header leads back, the first crumb, a `...`
 * crumb that lists the earlier steps, and the last three. A press on a crumb closes every drawer
 * after it with `crumb-press`. `Esc` closes only the current drawer, a step back, while the close
 * button, a swipe and a press on the backdrop close the whole trail, the drawer on top first. A
 * drawer that stays open after its `onClose` stops the leave: the drawers under it stay open. The
 * first drawer of the trail sets the backdrop and the focus trap, so a `type` further down sets only
 * whether the drawer has a description and a footer. `crumb` sets a drawer's crumb, its `title` by
 * default, the card shown while the crumb is hovered or focused (`preview`), and its link (`href`,
 * `target`, `render`). A plain click on a crumb with a link still steps back, and a click with a
 * modifier key opens the link in a new tab. The `...` crumb opens a list of the earlier steps, on
 * hover and on a press, with the number of each step, and `trailEllipsis` on the first drawer of the
 * trail changes it. A covered drawer of the trail is out of sight, so its content skips layout and
 * paint and keeps its state and scroll, but its effects, timers and requests keep running.
 *
 * For content too heavy to keep mounted once per step, such as a page of charts, one drawer shows
 * the trail itself: `trail` lists the earlier steps, root first, the drawer's own `crumb` is last,
 * and `children` renders only the current step. A plain click on a step and `Esc` call
 * `onTrailSelect(index, reason)`, and you drop the steps after it. A step back mounts the step
 * again, so it keeps no scroll or state of its own.
 *
 * With `stack="overlay"`, the nested drawer opens over the outer one at 80% of its width, so the
 * outer one stays in sight. The outer one takes no input until the nested one closes, and the
 * nested drawer's own `type` sets its backdrop.
 *
 * A drawer of a trail with `stack="overlay"` opens an overlay over the trail, and the overlay may
 * start a trail of its own.
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
 * | `data-nested` | panel | `overlay`, `breadcrumb`: how the drawer it is declared in stacks it |
 * | `data-covered` | panel | `overlay`, `breadcrumb`: present while a nested drawer is open over it, valued by its own `stack` |
 *
 * | `data-slot` | Rendered |
 * | --- | --- |
 * | `drawer-backdrop` | on a `task`, except inside a breadcrumb trail, where only the first drawer of the trail has one |
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
 * | `drawer-trail` | in a breadcrumb trail, under the header, with the `Breadcrumb` of the trail |
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
 *   stack="overlay"
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
 *   stack="overlay"
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
 * <Drawer
 *   handle={logDetails}
 *   type="inspector"
 *   stack="overlay"
 *   title="Log details"
 *   width="extra-wide"
 * >
 *   {(log) => <LogDetails log={log} />}
 * </Drawer>
 *
 * <TableRow onClick={() => logDetails.open(row)} />
 * ```
 *
 * @example
 * ```tsx
 * // A drill-down: a press on a pod opens it in the same drawer, with a trail back. As in the first
 * // example, `node` and `pod` are the last records shown, kept apart from the open flags.
 * <Drawer
 *   type="inspector"
 *   stack="breadcrumb"
 *   open={isNodeOpen}
 *   onClose={() => setIsNodeOpen(false)}
 *   title={node.name}
 *   crumb={{ icon: <Server /> }}
 *   width="entity"
 * >
 *   <PodList pods={node.pods} onSelect={showPod} />
 *   <Drawer
 *     type="inspector"
 *     stack="breadcrumb"
 *     open={isPodOpen}
 *     onClose={() => setIsPodOpen(false)}
 *     title={pod.name}
 *     crumb={{ icon: <Box /> }}
 *   >
 *     <PodDetails pod={pod} />
 *   </Drawer>
 * </Drawer>
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
