import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import {
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Button } from '../button/index.js';
import type { DialogHandle } from '../dialog/dialog-handle.js';
import { DialogLayer } from '../dialog/subcomponents/dialog-layer.js';
import { DialogPayload } from '../dialog/subcomponents/dialog-payload.js';
import { DialogPortal } from '../dialog/subcomponents/dialog-portal.js';
import type { NoHandle } from '../dialog/types.js';
import { useCloseHandleOnUnmount } from '../dialog/use-close-handle-on-unmount.js';
import { useDialogHandleState } from '../dialog/use-dialog-handle-state.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { PopupContainer } from '../lib/popup-container.js';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './alert-dialog.module.scss';
import type { AlertDialogProps, ValidateAlertDialogProps } from './types.js';

const AlertDialogImpl = forwardRef<HTMLDivElement, AlertDialogProps<unknown> & RejectedProps>(
	function AlertDialog(
		{
			open,
			handle,
			container,
			title,
			titleIcon,
			children,
			color,
			confirmText,
			confirmIcon,
			onConfirm,
			cancelText = 'Cancel',
			cancelIcon,
			onCancel,
			initialFocus,
			finalFocus,
			testId,
			className: _className,
			style: _style,
			...props
		},
		ref,
	) {
		const popupRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMemo(() => mergeRefs(ref, popupRef), [ref]);
		const [confirming, setConfirming] = useState(false);
		// With a handle the handle owns the open state, and the alert closes itself on an answer.
		const handleState = useDialogHandleState(handle);
		useCloseHandleOnUnmount(handle);
		const isOpen = handle ? handleState.open : (open ?? false);

		// What a pending `onConfirm` answers: the open state, or with a handle the state of the handle,
		// which also changes when it is opened again with another payload. Once that changes, the
		// request is for an alert that is no longer on screen. Its loading state ends, and when it
		// settles it neither closes the alert nor ends the loading state of a newer request.
		const shown = handle ? handleState : isOpen;
		const [confirmingFor, setConfirmingFor] = useState(shown);
		const pendingRef = useRef<object | null>(null);

		if (confirmingFor !== shown) {
			setConfirmingFor(shown);
			setConfirming(false);
		}

		// The panel keeps the buttons it had while it plays its exit. A request that ends as the alert
		// closes would otherwise show an idle confirm button and an enabled cancel button as it fades.
		const [confirmingWhileOpen, setConfirmingWhileOpen] = useState(confirming);

		if (isOpen && confirmingWhileOpen !== confirming) {
			setConfirmingWhileOpen(confirming);
		}

		const busy = isOpen ? confirming : confirmingWhileOpen;

		// Runs when `shown` changes, never on unmount: a request still pending when the alert
		// unmounts, such as when the dialog it sits in shows its loading state, still closes the
		// handle once it resolves.
		useEffect(() => {
			pendingRef.current = null;
		}, [shown]);

		// The focus stays on the pressed button until the exit ends, so a second `Enter`, or one held
		// down, still lands on it after the answer. Only the first answer counts.
		const cancel = (): void => {
			if (!isOpen) {
				return;
			}

			if (handle) {
				handle.close();
			} else {
				onCancel?.();
			}
		};

		// Only an explicit `false` keeps an alert on a handle open, so a handler that returns nothing
		// still closes it.
		const answered = (answer: boolean | void): void => {
			if (answer !== false) {
				handle?.close();
			}
		};

		// A loading Button takes no press, so a second press while `onConfirm` runs never lands here.
		const confirm = (): void => {
			if (!isOpen) {
				return;
			}

			const result = onConfirm(handleState.payload);

			// Not `instanceof Promise`: a promise from another realm, such as an iframe, or a library's
			// own thenable fails it and would close the alert before the request settles.
			// `Promise.resolve` below adopts either.
			if (typeof result !== 'object' || result === null) {
				answered(result);
				return;
			}

			const request = {};
			// The handle is read again on settle, since an alert that unmounted no longer sees the
			// handle opened again with another payload.
			const requestedFor = handleState;
			const settle = (): boolean => {
				if (
					pendingRef.current !== request ||
					(handle !== undefined && handle.getSnapshot() !== requestedFor)
				) {
					return false;
				}

				pendingRef.current = null;
				setConfirming(false);
				return true;
			};

			pendingRef.current = request;
			setConfirming(true);
			Promise.resolve(result).then(
				(answer) => {
					if (settle()) {
						answered(answer);
					}
				},
				// Not rethrown: the alert stays open, which is the answer to a failed request, and a
				// handler that already showed the error would otherwise report it again as unhandled.
				settle,
			);
		};

		return (
			<AlertDialogPrimitive.Root
				open={isOpen}
				onOpenChange={(nextOpen, eventDetails) => {
					if (!nextOpen && eventDetails.reason === 'escape-key' && !confirming) {
						cancel();
					}
				}}
			>
				<DialogPortal container={container}>
					<DialogLayer
						className={styles['alert-dialog__layer']}
						slot="alert-dialog-layer"
						zIndex="var(--alert-dialog-z-index, 50)"
					>
						<AlertDialogPrimitive.Backdrop
							className={styles['alert-dialog__backdrop']}
							data-slot="alert-dialog-backdrop"
							data-testid={partTestId(testId, 'backdrop')}
						/>
						<AlertDialogPrimitive.Viewport className={styles['alert-dialog__viewport']}>
							<AlertDialogPrimitive.Popup
								ref={mergedRef}
								// Base UI's default is the first tabbable element of the panel. The panel itself
								// takes it, so a screen reader reads the title and the body first, and an `Enter`
								// meant for the page answers nothing.
								initialFocus={initialFocus ?? popupRef}
								finalFocus={finalFocus}
								className={styles['alert-dialog']}
								data-testid={testId}
								{...props}
								// After the spread: a `data-*` from the call site may not take the slot or the
								// color the component is found by, and an `aria-*` may not undo the modal.
								aria-modal="true"
								data-color={color}
								data-slot="alert-dialog-popup"
							>
								<PopupContainer>
									<div className={styles['alert-dialog__content']}>
										<div className={styles['alert-dialog__heading']}>
											{titleIcon ? (
												<span className={styles['alert-dialog__title-icon']} aria-hidden="true">
													{titleIcon}
												</span>
											) : null}
											<AlertDialogPrimitive.Title
												className={styles['alert-dialog__title']}
												data-slot="alert-dialog-title"
												data-testid={partTestId(testId, 'title')}
											>
												{title.trim() === '' ? '<No title>' : title}
											</AlertDialogPrimitive.Title>
										</div>
										<AlertDialogPrimitive.Description
											render={<div />}
											className={styles['alert-dialog__body']}
											data-slot="alert-dialog-body"
											data-testid={partTestId(testId, 'body')}
										>
											<DialogPayload payload={handleState.payload}>{children}</DialogPayload>
										</AlertDialogPrimitive.Description>
									</div>
									<div className={styles['alert-dialog__footer']}>
										<Button
											variant="solid"
											color="secondary"
											size="md"
											prefix={cancelIcon}
											disabled={busy}
											disabledTooltip={undefined}
											data-slot="alert-dialog-cancel"
											testId={partTestId(testId, 'cancel')}
											onClick={cancel}
										>
											{cancelText}
										</Button>
										<Button
											variant="solid"
											color={color}
											size="md"
											prefix={confirmIcon}
											loading={busy}
											data-slot="alert-dialog-confirm"
											testId={partTestId(testId, 'confirm')}
											onClick={confirm}
										>
											{confirmText}
										</Button>
									</div>
								</PopupContainer>
							</AlertDialogPrimitive.Popup>
						</AlertDialogPrimitive.Viewport>
					</DialogLayer>
				</DialogPortal>
			</AlertDialogPrimitive.Root>
		);
	},
);

AlertDialogImpl.displayName = 'AlertDialog';

/**
 * Renders the fixed confirmation for a destructive or consequential action (Base UI Alert
 * Dialog): a title, a body that states the consequence, and a cancel and a confirm button.
 *
 * `id`, `ref`, `aria-*` and `data-*` land on the panel. `className` and `style` are not
 * forwarded.
 *
 * Visual values are `--alert-dialog-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The panel is a `role="alertdialog"` with `aria-modal="true"`, named by `title` and described by
 * `children`. Initial focus goes to the panel, so a screen reader reads the title and the body, and
 * the first `Tab` reaches the first button. `initialFocus` and `finalFocus` redirect the focus on
 * the way in and out.
 *
 * ### Answering it
 *
 * An alert is answered, not escaped. It has no close button, a press on the backdrop does
 * nothing, and `Esc` is the cancel button.
 *
 * With `open`, neither button closes it: `onCancel` and `onConfirm` report the answer, and the
 * alert stays open until `open` becomes `false`. With a `handle` from `useDialogHandle()`,
 * `handle.open(payload)` shows it, `onConfirm` receives the payload, and the alert closes itself
 * on cancel and once `onConfirm` returns or its promise resolves, so `open` and `onCancel` are not
 * passed. Returning or resolving to `false` keeps it open, for a failed request the handler
 * already reported.
 *
 * A rejected promise ends the loading state and leaves the alert open in both modes. The alert
 * catches it and does not rethrow it, so show the error from `onConfirm`.
 *
 * Everything else follows `Dialog`: focus trap, focus return, layering and nesting.
 *
 * ### Asserting on it
 *
 * `testId` lands on the panel and names every part. Use these, never the hashed class names.
 *
 * | Data attribute | On | Values |
 * | --- | --- | --- |
 * | `data-color` | panel | `primary`, `danger` |
 * | `data-open` / `data-closed` | panel, backdrop | present while open / while the exit runs |
 *
 * | `data-slot` | Rendered |
 * | --- | --- |
 * | `alert-dialog-backdrop` | when it is not nested in another dialog |
 * | `alert-dialog-popup` | always, the panel |
 * | `alert-dialog-title` | always |
 * | `alert-dialog-body` | always |
 * | `alert-dialog-cancel` | always |
 * | `alert-dialog-confirm` | always |
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   open={isOpen}
 *   title="Delete this view?"
 *   color="danger"
 *   confirmText="Delete view"
 *   onConfirm={async () => {
 *     await deleteView(view.id);
 *     setIsOpen(false);
 *   }}
 *   onCancel={() => setIsOpen(false)}
 * >
 *   Dashboards that link to it will open the default view.
 * </AlertDialog>
 * ```
 *
 * @example
 * ```tsx
 * // One alert for every row, closed by the handle once the delete resolves
 * const deleteView = useDialogHandle<SavedView>();
 *
 * <AlertDialog
 *   handle={deleteView}
 *   title="Delete this view?"
 *   color="danger"
 *   confirmText="Delete view"
 *   onConfirm={(view) => removeView(view.id)}
 * >
 *   {(view) => <>Everyone loses access to <strong>{view.name}</strong>.</>}
 * </AlertDialog>
 * ```
 */
export const AlertDialog = AlertDialogImpl as <
	Payload = NoHandle,
	T extends Omit<AlertDialogProps<Payload>, 'children' | 'onConfirm'> = Omit<
		AlertDialogProps<Payload>,
		'children' | 'onConfirm'
	>,
>(
	// `handle`, `children` and `onConfirm` are restated for the payload, the way `Dialog` does.
	// Without a handle `Payload` is its default, `NoHandle`. `handle` has a member of its own, so a
	// missing `children` or `onConfirm` does not keep the handle from being read, the way `Dialog`
	// explains.
	props: T & { handle?: DialogHandle<Payload> } & {
		children: AlertDialogProps<NoInfer<Payload>>['children'];
		onConfirm: AlertDialogProps<NoInfer<Payload>>['onConfirm'];
	} & ValidateAlertDialogProps<T, NoInfer<Payload>> &
		Record<
			Exclude<keyof T, keyof AlertDialogProps<Payload> | keyof RefAttributes<HTMLDivElement>>,
			never
		> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
