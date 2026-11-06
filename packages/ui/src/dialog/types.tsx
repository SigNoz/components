import type { Dialog } from '@base-ui/react/dialog';
import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type { DialogHandle } from './dialog-handle.js';

type OriginalPortalProps = Dialog.Portal.Props;
type OriginalPopupProps = Dialog.Popup.Props;

/**
 * The width of a `Dialog` panel. Each name is a max width, so on a narrow screen the panel shrinks
 * before it overflows: `narrow` 384px, `base` 512px, `wide` 672px, `extra-wide` 820px, `full` the
 * viewport minus 16px on each side.
 */
export type DialogWidthType = 'narrow' | 'base' | 'wide' | 'extra-wide' | 'full';

/**
 * Why a `Dialog` asks to close: `Esc`, a press on the backdrop, or the close button.
 */
export type DialogCloseReasonType = 'escape-key' | 'outside-press' | 'close-press';

/**
 * What a `DialogHandle` holds: whether the dialog is shown, and the payload of the latest
 * `handle.open(...)`.
 *
 * @access private
 */
export interface DialogHandleState<Payload> {
	open: boolean;
	payload: Payload | undefined;
}

/**
 * The arguments of {@link DialogHandle.open}: none for a handle without a payload, the payload
 * otherwise.
 *
 * @access private
 */
export type DialogHandleOpenArgs<Payload> = [Payload] extends [void] ? [] : [payload: Payload];

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the panel and names every part': never;
}

interface TheDialogIsAlwaysControlled {
	'a dialog has no trigger and no uncontrolled mode: pass `open`, or a `handle` from `useDialogHandle()`': never;
}

interface ADialogNeedsOpenOrAHandle {
	'a dialog is shown by `open` or by `handle.open(...)`: pass one of them': never;
}

interface OpenOrAHandleNotBoth {
	'`open` and `handle` both say whether the dialog is shown: pass one of them': never;
}

interface AHandleClosesTheDialog {
	'with a `handle`, the dialog closes itself and the handle reports it: drop `onClose`, and read the close from `useDialogHandle(onOpenChange)`': never;
}

interface AControlledDialogNeedsOnClose {
	'with `open`, only you close the dialog: pass `onClose` and set `open` to `false` in it': never;
}

interface PayloadChildrenNeedAHandle {
	'`children` as a function receives the payload of `handle.open(payload)`: pass a `handle`': never;
}

interface OnOpenChangeIsOnClose {
	'a dialog only ever asks to close: use `onClose(reason)`, and ignore a reason to keep it open': never;
}

interface SubTitleIsDescription {
	'`subTitle` is called `description`, and it is the accessible description of the panel': never;
}

interface TheCloseButtonIsFixed {
	'a `Dialog` always renders its close button': never;
}

interface OutsidePressIsAReason {
	'a press on the backdrop calls `onClose("outside-press")`: ignore that reason to keep the dialog open': never;
}

interface TheDialogIsAlwaysModal {
	'a dialog is always modal and always has the backdrop': never;
}

interface TheDialogOwnsItsLayer {
	'a dialog stacks above drawers on its own: drop `zIndex`': never;
}

interface GetContainerIsContainer {
	'`getContainer` is called `container`, and takes the element, not a function': never;
}

interface ThePanelIsCentered {
	'the panel is always centered: drop `position`, `heightMode`, `animation` and `offset`, and use a `Drawer` for a panel at the edge of the page': never;
}

interface TheFooterTakesTheButtons {
	'antd `onOk`, `okText` and the like are gone: put the buttons in `footerSuffix`': never;
}

interface FooterIsFooterSuffix {
	'`footer` is called `footerSuffix`, the pair of `footerPrefix`': never;
}

interface TheDialogTakesNoClassName {
	'`Dialog` takes no `className` or `style`: wrap your content in your own element, and reach the panel with a `data-*` attribute': never;
}

/**
 * Resolves to `Rule` when `T` has any of `Keys`, and to `unknown` otherwise.
 *
 * @access private
 */
export type RuleFor<T, Keys extends PropertyKey, Rule> = [Extract<keyof T, Keys>] extends [never]
	? unknown
	: Rule;

declare const noHandle: unique symbol;

/**
 * The `Payload` a dialog is typed with when no `handle` is passed. It is the default of that type
 * parameter in the signatures of `Dialog` and `AlertDialog`: with no `handle` there is nothing to
 * infer the payload from, so TypeScript falls back to the default. No handle can have it as a
 * payload, so a handle typed `unknown` or `any` is never mistaken for no handle.
 *
 * @access private
 */
export interface NoHandle {
	readonly [noHandle]: never;
}

/**
 * Whether `Payload` is {@link NoHandle}: true when no `handle` was passed, false for any payload a
 * handle can carry, `unknown`, `any` and `never` included.
 *
 * `0 extends 1 & Payload` is true only for `any`, which is assignable to `NoHandle` both ways.
 *
 * @access private
 */
export type IsNoHandle<Payload> = 0 extends 1 & Payload
	? false
	: [Payload] extends [NoHandle]
		? [NoHandle] extends [Payload]
			? true
			: false
		: false;

// Keyed, not shaped, the way `ValidatePopoverProps` reads its trigger-or-handle rule. A handle
// is read off `Payload` rather than `keyof T`, because the signature that infers the payload
// takes `handle` out of `T`. With no handle `Payload` has no inference candidate and is
// `NoHandle`, its default, and any other `Payload` means a handle was passed. A payload of
// `unknown` or `any` is a handle too, which is why the default is a type of its own.
// The signatures pass it through `NoInfer`, or the conditional below becomes an inference site
// and `Payload` is inferred as the props themselves.
//
// `open` counts as passed only when it is a required key of `T`. An unannotated callback in the
// props makes `T` fall back to its constraint while it is typed, and there `open` is an optional
// key that nobody passed. The close handlers are read the same way below.
/**
 * The open-or-handle pair: one of `open` and `handle`, never both, and `children` as a function
 * only with a handle. The rules default to the dialog's wording, and Drawer passes its own.
 *
 * @access private
 */
export type ValidateOpenOrHandle<
	T,
	Payload,
	NeedsOpenOrHandle = ADialogNeedsOpenOrAHandle,
	NotBoth = OpenOrAHandleNotBoth,
	ChildrenNeedAHandle = PayloadChildrenNeedAHandle,
> =
	IsNoHandle<Payload> extends true
		? [Extract<keyof T, 'open'>] extends [never]
			? NeedsOpenOrHandle
			: T extends { children: (...args: never[]) => unknown }
				? ChildrenNeedAHandle
				: unknown
		: T extends { open: unknown }
			? NotBoth
			: unknown;

/**
 * With `open` the dialog never closes itself, so the handler that does it is required. With a
 * handle the dialog closes itself, so the handler is rejected: the handle owns the open state.
 *
 * @access private
 */
export type CloseHandlerRule<T, Payload, Key extends PropertyKey, ControlledRule, HandleRule> =
	IsNoHandle<Payload> extends true
		? [Extract<keyof T, 'open'>] extends [never]
			? unknown
			: [Extract<keyof T, Key>] extends [never]
				? ControlledRule
				: unknown
		: T extends Record<Key, unknown>
			? HandleRule
			: unknown;

/**
 * The rules `Dialog` and `AlertDialog` share: the open-or-handle pair, and the props of the old
 * dialogs that no longer exist.
 *
 * @access private
 */
export type ValidateSharedDialogProps<T, Payload> = RuleFor<
	T,
	'data-testid',
	TheTestIdPropIsCalledTestId
> &
	ValidateOpenOrHandle<T, Payload> &
	RuleFor<T, 'trigger' | 'defaultOpen', TheDialogIsAlwaysControlled> &
	RuleFor<T, 'onOpenChange', OnOpenChangeIsOnClose> &
	RuleFor<T, 'showOverlay' | 'modal', TheDialogIsAlwaysModal> &
	RuleFor<T, 'zIndex', TheDialogOwnsItsLayer> &
	RuleFor<T, 'getContainer', GetContainerIsContainer>;

/**
 * Extra constraints layered on top of {@link DialogProps} at the call site. Each rejected prop
 * the old `DialogWrapper` or antd `Modal` took names its replacement.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 */
export type ValidateDialogProps<T, Payload = NoHandle> = ValidateSharedDialogProps<T, Payload> &
	CloseHandlerRule<T, Payload, 'onClose', AControlledDialogNeedsOnClose, AHandleClosesTheDialog> &
	RuleFor<T, 'subTitle', SubTitleIsDescription> &
	RuleFor<T, 'footer', FooterIsFooterSuffix> &
	RuleFor<T, 'showCloseButton' | 'closable' | 'closeIcon', TheCloseButtonIsFixed> &
	RuleFor<T, 'disableOutsideClick' | 'maskClosable' | 'keyboard', OutsidePressIsAReason> &
	RuleFor<T, 'position' | 'heightMode' | 'animation' | 'offset' | 'centered', ThePanelIsCentered> &
	RuleFor<
		T,
		'onOk' | 'onCancel' | 'okText' | 'cancelText' | 'okButtonProps' | 'cancelButtonProps',
		TheFooterTakesTheButtons
	> &
	RuleFor<T, 'className' | 'style', TheDialogTakesNoClassName>;

/**
 * Where a dialog is shown from: its `open` prop, or a handle from `useDialogHandle()`.
 *
 * @access private
 */
export type DialogOpenProps<Payload> = {
	/**
	 * Shows the dialog. With `open` the dialog is controlled: it never opens or closes itself.
	 *
	 * @note Required unless a `handle` is passed, and never passed with one.
	 */
	open?: boolean;
	/**
	 * Opens and closes the dialog from application state instead of `open`.
	 *
	 * `handle.open(payload)` shows it and renders `payload` through `children`. `handle.close()`
	 * dismisses it. A close request from the dialog itself closes it through the handle too, so
	 * `open` and the close handler are never passed with a handle.
	 *
	 * @note Create one with `useDialogHandle()`.
	 */
	handle?: DialogHandle<Payload>;
	/**
	 * The element the dialog is portalled into, for a page that shows only part of the document,
	 * such as an element in fullscreen.
	 *
	 * @note The backdrop and the panel are `position: fixed`. An ancestor with a `transform`,
	 * a `filter` or `contain` makes them fixed to that ancestor instead of the viewport.
	 *
	 * @note `null`, or a ref still empty when the dialog opens, renders nothing until the element
	 * exists, while the page scroll is already locked.
	 *
	 * @default document.body
	 */
	container?: OriginalPortalProps['container'];
};

export type DialogProps<Payload = unknown> = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes &
	DialogOpenProps<Payload> & {
		/**
		 * Called when the user asks to close the dialog: `Esc` (`escape-key`), a press on the
		 * backdrop (`outside-press`) or the close button (`close-press`). The dialog stays open
		 * until `open` becomes `false`.
		 *
		 * @note Required with `open`, rejected with a `handle`: a dialog on a handle closes itself
		 * on every request, and `useDialogHandle(onOpenChange)` reports it. A dialog that must
		 * refuse a close, such as a form with unsaved edits, uses `open`.
		 *
		 * @note To keep the dialog open for one reason, ignore that reason in the handler, and say
		 * why in the code. Only a press on the backdrop is an outside press: a press on a toast, on
		 * a popup opened from the panel or on another modal in `document.body` is not.
		 */
		onClose?: (reason: DialogCloseReasonType) => void;
		/**
		 * The heading, and the accessible name of the panel. Wraps, never truncates.
		 *
		 * @note An empty string renders `<No title>`, so the missing name shows in review.
		 */
		title: string;
		/**
		 * An icon rendered before the title.
		 */
		titleIcon?: ReactElement;
		/**
		 * A line under the title, inside the header. It is the panel's `aria-describedby`.
		 *
		 * @note A node that renders nothing renders no description and no `aria-describedby`.
		 */
		description?: ReactNode;
		/**
		 * The body. It scrolls when the panel reaches its max height, while the header and the
		 * footer stay put.
		 *
		 * With a `handle`, it may be a function of the payload of the latest `handle.open(...)`.
		 * It is called only while the dialog is shown.
		 */
		children: ReactNode | ((payload: Payload) => ReactNode);
		/**
		 * Where focus goes when the dialog opens. A ref pins it to one element, such as the field to
		 * fill first.
		 *
		 * @default the panel, so a screen reader reads the title. The first `Tab` goes to the close
		 * button.
		 *
		 * @note Use it instead of `autoFocus` on an element in the body. React runs `autoFocus`
		 * before the dialog records where the focus was, so on close the focus falls to the page
		 * body instead of going back.
		 */
		initialFocus?: OriginalPopupProps['initialFocus'];
		/**
		 * Where focus returns when the dialog closes.
		 *
		 * @default the element that had the focus when the dialog opened
		 */
		finalFocus?: OriginalPopupProps['finalFocus'];
		/**
		 * The actions, at the end of the footer: a cancel button and one primary, primary last. A
		 * form in the body submits through a button here with `form="<form id>"`.
		 *
		 * @note A node that renders nothing renders no footer.
		 */
		footerSuffix?: ReactNode;
		/**
		 * Rendered at the start of the footer, apart from the `footerSuffix` actions: one
		 * destructive button, or one line of hint text.
		 *
		 * @note Rendered only with a `footerSuffix` that renders something.
		 */
		footerPrefix?: ReactNode;
		/**
		 * Shows the dialog while its content is still being fetched. Every slot that has
		 * something to render shows a skeleton in its place: the title, the `titleIcon`, the
		 * `description`, the body, the `footerPrefix` and the `footerSuffix`. The close button
		 * stays, so the user can still leave.
		 *
		 * The panel gets `aria-busy="true"` and keeps `title` as its accessible name.
		 *
		 * @note `children` is not rendered, and not called with the payload, until `loading` is
		 * `false`. The body shows `loadingContent` instead.
		 *
		 * @note A slot shows its skeleton only when its prop renders something. A `description`
		 * that comes with the data is `undefined` while loading, so its line appears only once the
		 * data does.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What the body shows while `loading` is true, such as a skeleton shaped like the form
		 * that is about to render. Defaults to a title line and three text lines.
		 *
		 * @note Rendered only while `loading` is true.
		 */
		loadingContent?: ReactNode;
		/**
		 * The max width of the panel. Pick the nearest name, not a width that fits the content.
		 *
		 * @default 'base'
		 */
		width?: DialogWidthType;
		/**
		 * Forwarded to the panel as `data-testid`. Every part is named after it:
		 * `` `${testId}-backdrop` ``, `-header`, `-title`, `-description`, `-close`, `-body`,
		 * `-footer`, `-footer-prefix`, `-footer-suffix`. While `loading`, the skeletons are
		 * `-title-skeleton`, `-description-skeleton` and `-body-skeleton`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the panel, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
