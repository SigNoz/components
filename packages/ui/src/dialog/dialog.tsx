import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from '@signozhq/icons';
import { forwardRef, type ReactElement, type RefAttributes, useMemo, useRef } from 'react';
import { Button } from '../button/index.js';
import { DrawerStackReset } from '../drawer/drawer-stack-context.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { PopupContainer } from '../lib/popup-container.js';
import { Skeleton } from '../skeleton/index.js';
import { hasRenderableContent, partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './dialog.module.scss';
import { DialogLayer } from './subcomponents/dialog-layer.js';
import type { DialogHandle } from './dialog-handle.js';
import { DialogPayload } from './subcomponents/dialog-payload.js';
import { DialogPortal } from './subcomponents/dialog-portal.js';
import type {
	DialogChildren,
	DialogCloseReasonType,
	DialogProps,
	NoHandle,
	RuledDialogKeys,
	ValidateDialogProps,
} from './types.js';
import { useCloseHandleOnUnmount } from './use-close-handle-on-unmount.js';
import { useDialogHandleState } from './use-dialog-handle-state.js';
import { isDialogCloseReason } from './utils.js';

const DialogImpl = forwardRef<HTMLDivElement, DialogProps & RejectedProps>(function Dialog(
	{
		open,
		handle,
		container,
		onClose,
		title,
		titleIcon,
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
	const mergedRef = useMemo(() => mergeRefs(ref, popupRef), [ref]);
	// With a handle the handle owns the open state, and the dialog closes itself on a request.
	const handleState = useDialogHandleState(handle);
	useCloseHandleOnUnmount(handle);
	const isOpen = handle ? handleState.open : (open ?? false);

	const requestClose = (reason: DialogCloseReasonType): void => {
		if (handle) {
			handle.close();
		} else {
			onClose?.(reason);
		}
	};

	return (
		<DialogPrimitive.Root
			open={isOpen}
			onOpenChange={(nextOpen, eventDetails) => {
				if (!nextOpen && isDialogCloseReason(eventDetails.reason)) {
					requestClose(eventDetails.reason);
				}
			}}
		>
			<DrawerStackReset>
				<DialogPortal container={container}>
					<DialogLayer
						className={styles['dialog__layer']}
						slot="dialog-layer"
						zIndex="var(--dialog-z-index, 50)"
					>
						<DialogPrimitive.Backdrop
							className={styles['dialog__backdrop']}
							data-slot="dialog-backdrop"
							data-testid={partTestId(testId, 'backdrop')}
						/>
						<DialogPrimitive.Viewport className={styles['dialog__viewport']}>
							<DialogPrimitive.Popup
								ref={mergedRef}
								// Base UI's default is the first tabbable element of the panel, which is the
								// close button in the header. The panel itself takes it, so a screen reader
								// reads the title first.
								initialFocus={initialFocus ?? popupRef}
								finalFocus={finalFocus}
								className={styles['dialog']}
								data-width={width}
								data-loading={loading || undefined}
								data-testid={testId}
								aria-busy={loading || undefined}
								{...props}
								// After the spread: a `data-*` from the call site may not take the slot the
								// component is found by, and an `aria-*` may not undo the modal.
								aria-modal="true"
								data-slot="dialog-popup"
							>
								<PopupContainer>
									<div
										className={styles['dialog__header']}
										data-slot="dialog-header"
										data-testid={partTestId(testId, 'header')}
									>
										<div className={styles['dialog__heading']}>
											{titleIcon ? (
												<span
													className={styles['dialog__title-icon']}
													data-loading={loading || undefined}
													aria-hidden="true"
												>
													{loading ? (
														// At the icon size, through the avatar size token in the stylesheet.
														<Skeleton.Avatar size="sm" shape="square" />
													) : (
														titleIcon
													)}
												</span>
											) : null}
											<DialogPrimitive.Title
												// While loading, the title stays the accessible name of the panel and only the
												// skeleton shows.
												className={
													loading ? styles['dialog__visually-hidden'] : styles['dialog__title']
												}
												data-slot="dialog-title"
												data-testid={partTestId(testId, 'title')}
											>
												{title.trim() === '' ? '<No title>' : title}
											</DialogPrimitive.Title>
											{loading ? (
												<div
													data-slot="dialog-title-skeleton"
													className={styles['dialog__title-skeleton']}
												>
													<Skeleton
														title={false}
														paragraph={{ rows: 1, width: '40%' }}
														testId={partTestId(testId, 'title-skeleton')}
													/>
												</div>
											) : null}
										</div>
										{hasRenderableContent(description) && loading ? (
											<div
												data-slot="dialog-description-skeleton"
												className={styles['dialog__description-skeleton']}
											>
												<Skeleton
													title={false}
													paragraph={{ rows: 1, width: '70%' }}
													testId={partTestId(testId, 'description-skeleton')}
												/>
											</div>
										) : null}
										{hasRenderableContent(description) && !loading ? (
											<DialogPrimitive.Description
												render={<div />}
												className={styles['dialog__description']}
												data-slot="dialog-description"
												data-testid={partTestId(testId, 'description')}
											>
												{description}
											</DialogPrimitive.Description>
										) : null}
										<div className={styles['dialog__close']}>
											<Button
												variant="ghost"
												color="secondary"
												size="sm"
												icon
												aria-label="Close"
												data-slot="dialog-close"
												testId={partTestId(testId, 'close')}
												onClick={() => {
													requestClose('close-press');
												}}
											>
												<X />
											</Button>
										</div>
									</div>
									<div
										className={styles['dialog__body']}
										data-slot="dialog-body"
										data-testid={partTestId(testId, 'body')}
									>
										{loading ? (
											(loadingContent ?? <Skeleton testId={partTestId(testId, 'body-skeleton')} />)
										) : (
											<DialogPayload payload={handleState.payload}>{children}</DialogPayload>
										)}
									</div>
									{hasRenderableContent(footerSuffix) ? (
										<div
											className={styles['dialog__footer']}
											data-slot="dialog-footer"
											data-testid={partTestId(testId, 'footer')}
										>
											{hasRenderableContent(footerPrefix) ? (
												<div
													className={styles['dialog__footer-prefix']}
													data-slot="dialog-footer-prefix"
													data-testid={partTestId(testId, 'footer-prefix')}
												>
													{loading ? <Skeleton.Button size="md" /> : footerPrefix}
												</div>
											) : null}
											<div
												className={styles['dialog__footer-suffix']}
												data-slot="dialog-footer-suffix"
												data-testid={partTestId(testId, 'footer-suffix')}
											>
												{loading ? (
													<>
														<Skeleton.Button size="md" />
														<Skeleton.Button size="md" />
													</>
												) : (
													footerSuffix
												)}
											</div>
										</div>
									) : null}
								</PopupContainer>
							</DialogPrimitive.Popup>
						</DialogPrimitive.Viewport>
					</DialogLayer>
				</DialogPortal>
			</DrawerStackReset>
		</DialogPrimitive.Root>
	);
});

/**
 * Renders a modal window over the page with a backdrop, a header, a body that scrolls and an
 * optional footer (Base UI Dialog). For forms and content. A confirmation of a destructive or
 * consequential action is an `AlertDialog`.
 *
 * `id`, `ref`, `aria-*` and `data-*` land on the panel. `className` and `style` are not
 * forwarded.
 *
 * Visual values are `--dialog-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The panel is a `role="dialog"` with `aria-modal="true"`, named by `title` and described by
 * `description`. The close button is labelled `Close`.
 *
 * ### Controlled, or from a handle
 *
 * With `open`, the dialog never opens or closes itself. `onClose` reports the request with its
 * reason, and the dialog stays open until `open` becomes `false`.
 *
 * With a `handle` from `useDialogHandle()`, `handle.open(payload)` shows the dialog from anywhere,
 * such as a row action, and `children` may be a function of that payload. The dialog closes
 * itself on every close request, so `open` and `onClose` are not passed. A dialog that must refuse
 * a close, such as a form with unsaved edits, uses `open`.
 *
 * Either way, a closed dialog unmounts its content and keeps no state. A dialog on a handle that
 * unmounts while open, such as a child closed with its parent, closes its handle.
 *
 * ### Loading
 *
 * With `loading`, the dialog opens before its content is ready. The title, the `titleIcon`, the
 * `description`, the `footerPrefix` and the `footerSuffix` each show a skeleton when they are
 * passed, and the body shows `loadingContent`, or a default skeleton. `children` renders once
 * `loading` is `false`. The close button stays, and the panel is `aria-busy` and still named by
 * `title`.
 *
 * ### Focus and keyboard
 *
 * While open, focus is trapped in the panel, the page under the backdrop does not scroll and
 * everything outside the panel is hidden from assistive technology. Focus starts on the panel, so a
 * screen reader reads the title, and the first `Tab` reaches the close button. On close, focus goes
 * back to the element that had it when `open` became `true`.
 *
 * `Esc` while a popup inside the panel is open (Select, Combobox, Dropdown, Popover) closes only
 * that popup. The dialog adds no `Enter` handler of its own.
 *
 * ### Layering
 *
 * The dialog renders in `document.body`, or in `container`, and stacks above the layer it was
 * opened from, such as a drawer, with no `zIndex`. A dialog nested in another one, or declared in
 * a popover inside its panel, renders in the same `container` unless it passes its own. Tooltips,
 * dropdowns, selects, popovers and toasts opened inside it portal into the panel and render above
 * it.
 *
 * ### Nested dialogs
 *
 * A `Dialog` rendered in the `children`, `footerPrefix` or `footerSuffix` of another `Dialog` is
 * nested in it. Only the top dialog takes input, `Esc` and outside presses reach it alone, and the
 * parent panel gets `data-nested-dialog-open`. There is one backdrop, the first dialog's. Closing
 * the parent closes its children with it.
 *
 * ### Asserting on it
 *
 * `testId` lands on the panel and names every part. Use these, never the hashed class names.
 *
 * | Data attribute | On | Values |
 * | --- | --- | --- |
 * | `data-width` | panel | `narrow`, `base`, `wide`, `extra-wide`, `full` |
 * | `data-open` / `data-closed` | panel, backdrop | present while open / while the exit runs |
 * | `data-nested-dialog-open` | panel | present while a nested dialog is open |
 * | `data-loading` | panel | present while `loading` |
 *
 * | `data-slot` | Rendered |
 * | --- | --- |
 * | `dialog-backdrop` | always, once per stack of nested dialogs |
 * | `dialog-popup` | always, the panel |
 * | `dialog-header` | always |
 * | `dialog-title` | always |
 * | `dialog-description` | when `description` renders something |
 * | `dialog-title-skeleton` | while `loading`, the box around the title skeleton |
 * | `dialog-description-skeleton` | while `loading` and `description` renders something, the box around its skeleton |
 * | `dialog-close` | always |
 * | `dialog-body` | always |
 * | `dialog-footer` | when `footerSuffix` renders something |
 * | `dialog-footer-prefix` | when `footerPrefix` and `footerSuffix` both render something |
 * | `dialog-footer-suffix` | when `footerSuffix` renders something |
 *
 * @example
 * ```tsx
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Rename view"
 *   footerSuffix={
 *     <>
 *       <Button variant="outlined" color="secondary" size="md" onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </Button>
 *       <Button variant="solid" color="primary" size="md" type="submit" form="rename-view">
 *         Save
 *       </Button>
 *     </>
 *   }
 * >
 *   <form id="rename-view" onSubmit={save}>…</form>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Keeps the dialog open on a stray backdrop press while the form has unsaved edits
 * <Dialog
 *   open={isOpen}
 *   onClose={(reason) => {
 *     // Unsaved edits: a backdrop press would drop them without a warning.
 *     if (reason === 'outside-press' && isDirty) return;
 *     setIsOpen(false);
 *   }}
 *   title="Edit alert"
 *   width="wide"
 * >
 *   …
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Opens at once and fills in when the rule arrives
 * const { data: rule, isLoading } = useAlertRule(ruleId);
 *
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title={rule?.name ?? 'Edit alert'}
 *   description="Changes apply from the next evaluation."
 *   loading={isLoading}
 *   loadingContent={<EditAlertFormSkeleton />}
 *   footerSuffix={…}
 * >
 *   {rule ? <EditAlertForm rule={rule} /> : null}
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // One dialog for every row of the table, opened from the row's action
 * const editAlert = useDialogHandle<AlertRule>();
 *
 * <Dialog handle={editAlert} title="Edit alert" width="wide">
 *   {(rule) => <EditAlertForm rule={rule} onSaved={() => editAlert.close()} />}
 * </Dialog>
 *
 * <Button onClick={() => editAlert.open(row)}>Edit</Button>
 * ```
 */
export const Dialog = DialogImpl as <
	Payload = NoHandle,
	T extends Omit<DialogProps<Payload>, 'children'> = Omit<DialogProps<Payload>, 'children'>,
>(
	// `T` is inferred from the call site, so `T extends DialogProps` alone never runs excess
	// property checks. Every key outside the props is pinned to `never` instead, except the keys
	// a rule rejects: pinned too, the compiler reports `never` on the prop and drops the rule.
	//
	// `handle` is restated so `Payload` has somewhere to be inferred from, which is what types
	// `children` as a function of whatever that handle opens with. That restating also takes
	// `handle` back out of `T`, so the open-or-handle rule is told the payload separately.
	// Without a handle there is nothing to infer from and `Payload` is its default, `NoHandle`.
	// `handle` and `children` are separate members. When the props lack `children`, TypeScript
	// infers nothing from the member that requires it, so a `handle` kept there is never read and
	// the error blames the handle (`DialogHandle<NoHandle>`) instead of the missing `children`.
	//
	// `children` is restated through `NoInfer` and left out of `T`'s constraint, so an
	// unannotated `(row) => …` is typed from the handle alone. Inferred from `T`, TypeScript 5.9
	// reads it before the payload and types `row` as an implicit `any`.
	props: T & { handle?: DialogHandle<Payload> } & {
		children: DialogChildren<NoInfer<Payload>>;
	} & ValidateDialogProps<T, NoInfer<Payload>> &
		Record<
			Exclude<
				keyof T,
				keyof DialogProps<Payload> | keyof RefAttributes<HTMLDivElement> | RuledDialogKeys
			>,
			never
		> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
