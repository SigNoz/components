import type { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type {
	CloseHandlerRule,
	DialogOpenProps,
	NoHandle,
	OnOpenChangeRule,
	RuledSharedDialogKeys,
	RuleFor,
	ValidateSharedDialogProps,
} from '../dialog/types.js';

/**
 * The intent of the confirm button of an `AlertDialog`.
 */
export type AlertDialogColorType = 'primary' | 'danger';

interface AHandleClosesTheAlert {
	'with a `handle`, the alert closes itself on cancel and the handle reports it: drop `onCancel`, and read the close from `useDialogHandle(onOpenChange)`': never;
}

interface AControlledAlertNeedsOnCancel {
	'with `open`, only you close the alert: pass `onCancel` and set `open` to `false` in it': never;
}

interface OnOpenChangeIsOnCancel {
	'an alert only ever reports an answer: use `onCancel` and `onConfirm`, and set `open` to `false` in them': never;
}

interface AHandleReportsTheClose {
	'with a `handle`, the handle reports the close: pass `onOpenChange` to `useDialogHandle(onOpenChange)`, not to the alert': never;
}

interface AnAlertHasOneWidth {
	'`AlertDialog` has one width, 384px': never;
}

interface AnAlertHasAFixedFooter {
	'the footer of `AlertDialog` is always the cancel and confirm buttons': never;
}

interface LoadingComesFromOnConfirm {
	'the confirm button shows its loading state while the promise `onConfirm` returns is pending': never;
}

interface AnAlertIsAnswered {
	'an alert is answered, not escaped: `onCancel` is the only way to say no': never;
}

interface AnAlertHasNoCloseButton {
	'`AlertDialog` has no close button, and a press on the backdrop never closes it': never;
}

interface TheBodyIsTheDescription {
	'the body in `children` states the consequence and is the accessible description': never;
}

interface TheCheckboxBelongsToTheConsumer {
	'render the "Do not ask me this again" Checkbox in `children`, and store the choice yourself': never;
}

/**
 * The props {@link ValidateAlertDialogProps} rejects with a rule and that are not props of
 * `AlertDialog`. The signature leaves them out of the keys it pins to `never`: pinned, the compiler
 * reports `never` on the prop and drops the rule's message. `className` and `style` have no rule:
 * the plain `never` on the prop says enough.
 *
 * @access private
 */
export type RuledAlertDialogKeys =
	| RuledSharedDialogKeys
	| 'onOpenChange'
	| 'width'
	| 'footer'
	| 'footerPrefix'
	| 'footerSuffix'
	| 'loading'
	| 'confirmLoading'
	| 'onClose'
	| 'showCloseButton'
	| 'disableOutsideClick'
	| 'subTitle'
	| 'description'
	| 'checkboxLabel'
	| 'checkboxChecked'
	| 'onCheckboxChange'
	| 'checkboxColor';

/**
 * Extra constraints layered on top of {@link AlertDialogProps} at the call site. Each rejected
 * prop the old dialogs or antd `Modal` took names its replacement.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 */
export type ValidateAlertDialogProps<T, Payload = NoHandle> = ValidateSharedDialogProps<
	T,
	Payload
> &
	OnOpenChangeRule<T, Payload, OnOpenChangeIsOnCancel, AHandleReportsTheClose> &
	CloseHandlerRule<T, Payload, 'onCancel', AControlledAlertNeedsOnCancel, AHandleClosesTheAlert> &
	RuleFor<T, 'width', AnAlertHasOneWidth> &
	RuleFor<T, 'footer' | 'footerPrefix' | 'footerSuffix', AnAlertHasAFixedFooter> &
	RuleFor<T, 'loading' | 'confirmLoading', LoadingComesFromOnConfirm> &
	RuleFor<T, 'onClose', AnAlertIsAnswered> &
	RuleFor<T, 'showCloseButton' | 'disableOutsideClick', AnAlertHasNoCloseButton> &
	RuleFor<T, 'subTitle' | 'description', TheBodyIsTheDescription> &
	RuleFor<
		T,
		'checkboxLabel' | 'checkboxChecked' | 'onCheckboxChange' | 'checkboxColor',
		TheCheckboxBelongsToTheConsumer
	>;

export type AlertDialogProps<Payload = unknown> = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes &
	DialogOpenProps<Payload> & {
		/**
		 * The question the alert asks, such as `Delete this view?`, and the accessible name of the
		 * panel.
		 *
		 * @note An empty string renders `<No title>`, so the missing name shows in review.
		 */
		title: string;
		/**
		 * An icon rendered before the title.
		 */
		titleIcon?: ReactElement;
		/**
		 * The body. It states the consequence of the action, not the action again, and it is the
		 * panel's `aria-describedby`.
		 *
		 * With a `handle`, it may be a function of the payload of the latest `handle.open(...)`.
		 * It is called only while the alert is shown.
		 */
		children: ReactNode | ((payload: Payload) => ReactNode);
		/**
		 * The intent of the confirm button: `danger` for a destructive action, `primary` for a
		 * consequential one.
		 */
		color: AlertDialogColorType;
		/**
		 * The label of the confirm button. Name the action (`Delete view`), not `OK`.
		 */
		confirmText: string;
		/**
		 * The prefix of the confirm button.
		 */
		confirmIcon?: ReactElement;
		/**
		 * Called when the confirm button is pressed, with the payload of `handle.open(payload)`.
		 * While the promise it returns is pending, the confirm button shows its loading state, the
		 * cancel button is disabled and `Esc` does nothing: the request cannot be stopped, and
		 * closing would hide its result.
		 *
		 * @note With `open`, the alert does not close itself: set `open` to `false`, usually at the
		 * end of this handler. With a `handle`, the alert closes once the handler returns, or once
		 * its promise resolves, unless the answer is `false`: return `false` to keep it open, such
		 * as after showing a toast for a failed request. A rejected promise ends the loading state
		 * and leaves the alert open either way. It is caught and not rethrown, so report the error
		 * from this handler.
		 */
		onConfirm: (payload: Payload) => Promise<boolean | void> | boolean | void;
		/**
		 * The label of the cancel button.
		 *
		 * @default 'Cancel'
		 */
		cancelText?: string;
		/**
		 * The prefix of the cancel button.
		 */
		cancelIcon?: ReactElement;
		/**
		 * Called by the cancel button and by `Esc`. Set `open` to `false` in it.
		 *
		 * @note Required with `open`, rejected with a `handle`: an alert on a handle closes itself
		 * on cancel, and `useDialogHandle(onOpenChange)` reports it.
		 */
		onCancel?: () => void;
		/**
		 * Where focus goes when the alert opens. A ref pins it to one element, such as a field in the
		 * body the user fills before confirming.
		 *
		 * @note Never point it at the confirm button: an `Enter` meant for the page would confirm.
		 *
		 * @default the panel, so a screen reader reads the title and the body first
		 */
		initialFocus?: AlertDialogPrimitive.Popup.Props['initialFocus'];
		/**
		 * Where focus returns when the alert closes, such as the table when the row the alert opened
		 * from was deleted.
		 *
		 * @default the element that had the focus when the alert opened
		 */
		finalFocus?: AlertDialogPrimitive.Popup.Props['finalFocus'];
		/**
		 * Forwarded to the panel as `data-testid`. Every part is named after it:
		 * `` `${testId}-backdrop` ``, `-title`, `-body`, `-cancel`, `-confirm`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the panel, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
