import type { Drawer } from '@base-ui/react/drawer';
import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { DialogHandle } from '../dialog/dialog-handle.js';
import type { CloseHandlerRule, NoHandle, RuleFor, ValidateOpenOrHandle } from '../dialog/types.js';

type OriginalPortalProps = Drawer.Portal.Props;
type OriginalPopupProps = Drawer.Popup.Props;

/**
 * What the drawer is for, which sets how it treats the page behind it.
 *
 * `inspector` shows one record to read. The page stays usable: no backdrop, no focus trap, no
 * scroll lock, and a press outside does not close it. It has no footer and no description.
 *
 * `task` is one job to finish, such as a create or an edit form, or a picker. It is modal, with a
 * backdrop, and takes the footer.
 */
export type DrawerTypeType = 'inspector' | 'task';

/**
 * The width of a `Drawer` panel. Each name is a max width, so on a narrow screen the panel shrinks
 * before it overflows: `narrow` 384px, `base` 512px, `wide` 672px, `extra-wide` 820px, `entity`
 * 880px.
 */
export type DrawerWidthType = 'narrow' | 'base' | 'wide' | 'extra-wide' | 'entity';

/**
 * Why a `Drawer` asks to close: `Esc`, a press on the backdrop of a `task`, the close button, or a
 * swipe towards the edge on a touch screen.
 */
export type DrawerCloseReasonType = 'escape-key' | 'outside-press' | 'close-press' | 'swipe';

/**
 * Opens a `Drawer` from application state, and closes it from inside its content. Create one with
 * `useDrawerHandle()`.
 *
 * `open(payload)` shows the drawer and renders `payload` through its `children`, and calling it
 * again while open swaps the payload in place. `close()` dismisses it, and `isOpen` reads whether
 * it is shown.
 */
export type DrawerHandleType<Payload = void> = DialogHandle<Payload>;

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the panel and names every part': never;
}

interface ADrawerNeedsOpenOrAHandle {
	'a drawer is shown by `open` or by `handle.open(...)`: pass one of them': never;
}

interface OpenOrAHandleNotBoth {
	'`open` and `handle` both say whether the drawer is shown: pass one of them': never;
}

interface PayloadChildrenNeedAHandle {
	'`children` as a function receives the payload of `handle.open(payload)`: pass a `handle` from `useDrawerHandle()`': never;
}

interface TheDrawerIsAlwaysControlled {
	'a drawer has no trigger and no uncontrolled mode: pass `open`, or a `handle` from `useDrawerHandle()`': never;
}

interface OnOpenChangeIsOnClose {
	'a drawer only ever asks to close: use `onClose(reason)`, and ignore a reason to keep it open': never;
}

interface TheTypeSetsTheBackdrop {
	'`type` sets the backdrop: a `task` is modal behind one, an `inspector` has none and leaves the page usable': never;
}

interface TheDrawerOwnsItsLayer {
	'a drawer stacks above the layer it opens from on its own: drop `zIndex`': never;
}

interface GetContainerIsContainer {
	'`getContainer` is called `container`, and takes the element, not a function': never;
}

interface AnInspectorHasNoFooter {
	'an `inspector` has no footer: a footer means a job to submit, which is `type="task"`': never;
}

interface AnInspectorHasNoDescription {
	'an `inspector` has no `description`: the title names the record, and its facts go in the body': never;
}

interface AHandleClosesTheDrawer {
	'with a `handle`, the drawer closes itself and the handle reports it: drop `onClose`, and read the close from `useDrawerHandle(onOpenChange)`': never;
}

interface AControlledDrawerNeedsOnClose {
	'with `open`, only you close the drawer: pass `onClose` and set `open` to `false` in it': never;
}

interface SubTitleIsDescription {
	'`subTitle` is called `description`: one line of guidance under the title of a `task`': never;
}

interface FooterIsFooterSuffix {
	'`footer` is called `footerSuffix`, the pair of `footerPrefix`': never;
}

interface TheCloseButtonIsFixed {
	'a `Drawer` always renders its close button, last in the header': never;
}

interface OutsidePressIsAReason {
	'a press on the backdrop of a `task` calls `onClose("outside-press")`: ignore that reason to keep the drawer open': never;
}

interface TheDrawerOpensFromTheRight {
	'a drawer always opens from the right edge, with one animation: drop `direction`, `placement`, `push`, `animation`, `offset` and `heightMode`': never;
}

interface EscIsAReason {
	'`Esc` calls `onClose("escape-key")`: ignore that reason to keep the drawer open': never;
}

interface ExtraIsHeaderSuffix {
	'antd `extra` is called `headerSuffix`: the actions before the close button': never;
}

interface TheDrawerUnmountsWhenClosed {
	'a closed drawer always unmounts its content: drop `destroyOnClose` and `forceMount`': never;
}

interface PartPropsAreSlots {
	'the drawer has no part props: put content in `headerPrefix`, `titlePrefix`, `titleSuffix`, `headerSuffix`, `footerPrefix` or `footerSuffix`, and test it through `testId`': never;
}

interface TheDrawerTakesNoClassName {
	'`Drawer` takes no `className` or `style`: wrap your content in your own element, and reach the panel with a `data-*` attribute': never;
}

/**
 * The rules of an `inspector`: no footer and no description. A `type` known only at runtime takes
 * the slots of a `task`, and the drawer drops them when it turns out to be an inspector.
 */
type ValidateDrawerType<T> = T extends { type: 'inspector' }
	? RuleFor<T, 'footerPrefix' | 'footerSuffix', AnInspectorHasNoFooter> &
			RuleFor<T, 'description', AnInspectorHasNoDescription>
	: unknown;

/**
 * Extra constraints layered on top of {@link DrawerProps} at the call site. Each rejected prop the
 * old `DrawerWrapper` or the antd `Drawer` took names its replacement.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 */
export type ValidateDrawerProps<T, Payload = NoHandle> = RuleFor<
	T,
	'data-testid',
	TheTestIdPropIsCalledTestId
> &
	ValidateOpenOrHandle<
		T,
		Payload,
		ADrawerNeedsOpenOrAHandle,
		OpenOrAHandleNotBoth,
		PayloadChildrenNeedAHandle
	> &
	ValidateDrawerType<T> &
	RuleFor<T, 'trigger' | 'defaultOpen', TheDrawerIsAlwaysControlled> &
	RuleFor<T, 'onOpenChange', OnOpenChangeIsOnClose> &
	RuleFor<T, 'showOverlay' | 'modal' | 'mask', TheTypeSetsTheBackdrop> &
	RuleFor<T, 'zIndex', TheDrawerOwnsItsLayer> &
	RuleFor<T, 'getContainer', GetContainerIsContainer> &
	CloseHandlerRule<T, Payload, 'onClose', AControlledDrawerNeedsOnClose, AHandleClosesTheDrawer> &
	RuleFor<T, 'subTitle', SubTitleIsDescription> &
	RuleFor<T, 'footer', FooterIsFooterSuffix> &
	RuleFor<T, 'showCloseButton' | 'closable' | 'closeIcon', TheCloseButtonIsFixed> &
	RuleFor<T, 'disableOutsideClick' | 'maskClosable', OutsidePressIsAReason> &
	RuleFor<T, 'keyboard', EscIsAReason> &
	RuleFor<
		T,
		'direction' | 'placement' | 'animation' | 'offset' | 'heightMode' | 'push',
		TheDrawerOpensFromTheRight
	> &
	RuleFor<T, 'extra', ExtraIsHeaderSuffix> &
	RuleFor<T, 'destroyOnClose' | 'forceMount', TheDrawerUnmountsWhenClosed> &
	RuleFor<
		T,
		| 'drawerContentProps'
		| 'drawerHeaderProps'
		| 'drawerTitleProps'
		| 'drawerSubtitleProps'
		| 'drawerDescriptionProps'
		| 'drawerFooterProps'
		| 'closeButtonProps',
		PartPropsAreSlots
	> &
	RuleFor<T, 'className' | 'style' | 'rootClassName', TheDrawerTakesNoClassName>;

/**
 * The props of a `Drawer`. A `type="inspector"` drawer takes no `description`, `footerPrefix` or
 * `footerSuffix`, which {@link ValidateDrawerProps} enforces at the call site.
 */
export type DrawerProps<Payload = unknown> = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * What the drawer is for. `inspector` shows one record to read, and the page behind stays
		 * usable: no backdrop, no focus trap, and a press outside does not close it. `task` is one
		 * job to finish, such as a create or an edit form, or a picker: modal, with a backdrop and
		 * the footer.
		 */
		type: DrawerTypeType;
		/**
		 * Shows the drawer. With `open` the drawer is controlled: it never opens or closes itself.
		 *
		 * @note Required unless a `handle` is passed, and never passed with one.
		 */
		open?: boolean;
		/**
		 * Opens and closes the drawer from application state instead of `open`.
		 *
		 * `handle.open(payload)` shows it and renders `payload` through `children`, and calling it
		 * again while open swaps the payload in place. `handle.close()` dismisses it. A close
		 * request from the drawer itself closes it through the handle too, so `open` and `onClose`
		 * are never passed with a handle.
		 *
		 * @note Create one with `useDrawerHandle()`.
		 */
		handle?: DrawerHandleType<Payload>;
		/**
		 * The element the drawer is portalled into, for a page that shows only part of the
		 * document, such as an element in fullscreen.
		 *
		 * @note The backdrop and the panel are `position: fixed`. An ancestor with a `transform`,
		 * a `filter` or `contain` makes them fixed to that ancestor instead of the viewport.
		 *
		 * @note `null`, or a ref still empty when the drawer opens, renders nothing until the
		 * element exists.
		 *
		 * @default document.body
		 */
		container?: OriginalPortalProps['container'];
		/**
		 * Called when the user asks to close the drawer: `Esc` (`escape-key`), a press on the
		 * backdrop of a `task` (`outside-press`), the close button (`close-press`) or a swipe
		 * towards the right edge on a touch screen (`swipe`). The drawer stays open until `open`
		 * becomes `false`.
		 *
		 * @note Required with `open`, rejected with a `handle`: a drawer on a handle closes itself on
		 * every request, and `useDrawerHandle(onOpenChange)` reports it. A drawer that must refuse a
		 * close, such as a form with unsaved edits, uses `open`.
		 *
		 * @note To keep the drawer open for one reason, ignore that reason in the handler, and say
		 * why in the code. An `inspector` never reports `outside-press`: the page behind it stays
		 * usable.
		 */
		onClose?: (reason: DrawerCloseReasonType) => void;
		/**
		 * The name of the record or the job, and the accessible name of the panel. One line: a name
		 * longer than the header is cut with `…`, and the full text shows in a tooltip.
		 *
		 * @note An empty string renders `<No title>`, so the missing name shows in review.
		 */
		title: string;
		/**
		 * Rendered at the start of the header, before a divider: the ↑/↓ buttons of a drawer opened
		 * from a list, or the Back button of a drawer that turned from a view into an edit.
		 *
		 * @note Use `size="sm"` buttons with an `aria-label`, so they line up with the close button.
		 * While `loading`, it stays on screen but takes no input.
		 */
		headerPrefix?: ReactNode;
		/**
		 * Rendered right before the title: an icon, or the one neutral type badge of an infra entity
		 * (Host, Pod, Node).
		 *
		 * @note Not part of the accessible name: put meaning in the `title`. While `loading`, a
		 * skeleton takes its place.
		 */
		titlePrefix?: ReactNode;
		/**
		 * Rendered right after the title: the copy button of a name the user may want to paste
		 * elsewhere, such as a pod name or a trace ID.
		 *
		 * @note Not rendered while `loading`.
		 */
		titleSuffix?: ReactNode;
		/**
		 * Rendered at the end of the header, before the close button: one kind of action, such as
		 * up to two icon buttons, one text button or a time picker, and a `⋯` menu for the rest.
		 *
		 * @note Use `size="sm"` buttons. Saving and deleting belong to the footer of a `task`, not
		 * here. While `loading`, it stays on screen but takes no input.
		 */
		headerSuffix?: ReactNode;
		/**
		 * The body. It is the one area that scrolls, between a header and a footer that stay put.
		 *
		 * With a `handle`, it may be a function of the payload of the latest `handle.open(...)`. It
		 * is called only while the drawer is shown.
		 */
		children: ReactNode | ((payload: Payload) => ReactNode);
		/**
		 * Where focus goes when the drawer opens. A ref pins it to one element, such as the field to
		 * fill first, and `false` leaves it where it is.
		 *
		 * @default the panel, so a screen reader reads the title. The first `Tab` goes to the header.
		 *
		 * @note Use it instead of `autoFocus` on an element in the body. React runs `autoFocus` before
		 * the drawer records where the focus was, so on close the focus falls to the page body
		 * instead of going back.
		 */
		initialFocus?: OriginalPopupProps['initialFocus'];
		/**
		 * Where focus returns when the drawer closes.
		 *
		 * @default the element that had the focus when the drawer opened
		 */
		finalFocus?: OriginalPopupProps['finalFocus'];
		/**
		 * Shows the drawer while its content is still being fetched. The title, the `titlePrefix`
		 * and the `description` show a skeleton, the `titleSuffix` is hidden, and the
		 * `headerPrefix` and `headerSuffix` take no input. The body shows `loadingContent`, and the
		 * footer slots show a skeleton. The close button and `Esc` keep working, so a slow request
		 * never traps the user.
		 *
		 * The panel gets `aria-busy="true"` and keeps `title` as its accessible name.
		 *
		 * @note `children` is not rendered, and not called with the payload, until `loading` is
		 * `false`.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What the body shows while `loading` is true, such as a skeleton shaped like the content
		 * that is about to render. Defaults to a title line and three text lines.
		 *
		 * @note Rendered only while `loading` is true.
		 */
		loadingContent?: ReactNode;
		/**
		 * The max width of the panel. Pick the nearest name, not a width that fits the content. A
		 * drawer keeps its width while its content changes.
		 *
		 * @default 'base'
		 */
		width?: DrawerWidthType;
		/**
		 * Forwarded to the panel as `data-testid`. Every part is named after it:
		 * `` `${testId}-backdrop` ``, `-header`, `-header-prefix`, `-title-prefix`, `-title`,
		 * `-title-suffix`, `-description`, `-header-suffix`, `-close`, `-body`, `-footer`,
		 * `-footer-prefix`, `-footer-suffix`. While `loading`, the skeletons are
		 * `-title-prefix-skeleton`, `-title-skeleton`, `-description-skeleton` and
		 * `-body-skeleton`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the panel, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
		/**
		 * One line of guidance under the title, when the title alone does not say what to do.
		 *
		 * @note `task` only. A node that renders nothing renders no description and no
		 * `aria-describedby`.
		 */
		description?: ReactNode;
		/**
		 * The actions, at the end of the footer: a Cancel button and one primary named by what it
		 * does, primary last. A form in the body submits through a button here with
		 * `form="<form id>"`.
		 *
		 * @note `task` only. A node that renders nothing renders no footer.
		 */
		footerSuffix?: ReactNode;
		/**
		 * Rendered at the start of the footer, apart from the `footerSuffix` actions: one destructive
		 * button, which confirms first, or one line of status such as `• 2 unsaved changes`.
		 *
		 * @note `task` only, and rendered only with a `footerSuffix` that renders something.
		 */
		footerPrefix?: ReactNode;
	};
