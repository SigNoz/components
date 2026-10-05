import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { forwardRef, useEffect } from 'react';
import { usePopupContainer } from '../lib/popup-container.js';
import { partTestId } from '../lib/utils.js';
import { DEFAULT_LIMIT, DEFAULT_TIMEOUT, TOAST_POSITIONS, ToastPosition } from './constants.js';
import { ToastList } from './subcomponents/toast-list.js';
import { ToastViewport } from './subcomponents/toast-viewport.js';
import { persistedToastManagers, usePersistToasts } from './persist-toasts.js';
import { forgetVisibleToasts, setDefaultPosition, toastManagers } from './toast.js';
import type { ToasterProps } from './types.js';

/**
 * Renders every toast raised through `toast` (Base UI `Toast`). Mount it once, at the app root,
 * with no children.
 *
 * Only `id`, `className`, `style`, `aria-*` and `data-*` are forwarded, to the viewport. `id` and
 * the `ref` go to the viewport of `position` only.
 * The toasts are drawn by the component and take no props of their own: raise them with `toast`.
 *
 * Visual values are `--toast-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### One per app
 *
 * Every `Toaster` draws every toast, so a second one shows each toast twice. Mount it once, before
 * everything that calls `toast`. It starts listening in an effect, so a toast raised on the first
 * render by a component placed before it is lost, as is a call made while none is mounted.
 *
 * ### Stack
 *
 * Each position keeps a stack of its own, with its own viewport. `position` is where a toast
 * raised with no `position` goes. `offset` sets the distance of every stack from the edges of the
 * window. Newest first, `limit` visible per stack, the rest wait behind. A stack spreads on hover
 * and on focus inside it, and its timers pause meanwhile. Swiping a toast toward the edge it sits
 * against dismisses it.
 *
 * The viewport of `position` is a landmark. Another one is a landmark only while it holds a toast,
 * so an empty corner does not show up in the landmark list.
 *
 * ### Timeout
 *
 * `timeout` is how long `success`, `info` and `warning` stay on screen. `danger`, `loading` and a
 * toast with an `action` stay until they are dismissed, whatever it is. A `timeout` on the call
 * replaces it for that toast.
 *
 * ### In a story or a test
 *
 * Under a `PersistToastsProvider`, from `@signozhq/ui/testing`, no timer closes a toast, the
 * stack shows every toast whatever the `limit`, and it stays spread. `timeout` and `limit` are
 * ignored there, and so is a `timeout` on the call.
 *
 * ### Where it is portalled
 *
 * Into `container`, else the panel of the `Dialog` or `Drawer` the `Toaster` sits in, else
 * `document.body`. It stacks above dialogs, popovers and tooltips.
 *
 * ### Accessibility
 *
 * - The viewport is a landmark named `Notifications`. `F6` moves focus to it.
 * - `toast.danger` is announced assertively (`role="alert"`), the rest politely.
 * - A toast never takes focus when it arrives.
 * - Tab reaches the button of each toast, newest first. It is named by its label and closes the
 *   toast. `toast.danger` requires one, so a danger toast can be dismissed from the keyboard.
 * - While the stack is collapsed, Base UI hides the button from assistive technology until it has
 *   focus, and a `danger` toast with it, which a separate alert region announces instead.
 * - The icon is hidden from assistive technology, so the title has to say what happened.
 * - A title is an `h2`, so keep it short.
 *
 * ### Asserting on it
 *
 * `testId`, or a raw `data-testid`, is `data-testid` on the viewport of `position`, and
 * `<testId>-<position>` on the others. Each toast gets `<testId>-toast-<id>`, or the
 * `testId` it was raised with, and each part of it a suffix: `-content`, `-icon`, `-title`,
 * `-description`, `-action`. Otherwise use the data attributes, never the hashed class names.
 *
 * | Attribute | on |
 * |---|---|
 * | `data-position` | each viewport |
 * | `data-type` | the toast and its title, description and action: `success`, `info`, `warning`, `danger` or `loading` |
 * | `data-expanded` | the toast, while the stack is spread |
 * | `data-limited` | a toast past the `limit` the stack shows |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `toaster` | each viewport, the one of `position` first |
 * | `toast` | each toast, `role="dialog"`, `role="alertdialog"` for `danger` |
 * | `toast-content` | the row holding the icon and the text |
 * | `toast-icon` | the icon, `aria-hidden` |
 * | `toast-title` | the title, when there is one |
 * | `toast-description` | the description, when there is one |
 * | `toast-action` | the button on the right, which closes the toast. Rendered when the toast has an `action`, which `danger` requires |
 *
 * @example
 * ```tsx
 * <Toaster />
 * ```
 *
 * @example
 * ```tsx
 * // At the bottom of the page, further from the edge, and up to five at once
 * <Toaster position="bottom-center" offset={32} limit={5} />
 * ```
 */
export const Toaster = forwardRef<HTMLDivElement, ToasterProps>(function Toaster(
	{
		position = ToastPosition.TopRight,
		limit = DEFAULT_LIMIT,
		timeout = DEFAULT_TIMEOUT,
		container,
		testId,
		'data-testid': dataTestId,
		id,
		...props
	},
	ref,
) {
	const popupContainer = usePopupContainer();
	const persist = usePersistToasts();
	const managers = persist ? persistedToastManagers : toastManagers;
	// A raw `data-testid` is suffixed per position like `testId`, so no two viewports share one.
	const viewportTestId = testId ?? (typeof dataTestId === 'string' ? dataTestId : undefined);

	useEffect(() => forgetVisibleToasts(), []);
	useEffect(() => setDefaultPosition(position), [position]);

	// The stack of `position` first, so it is the first `[data-slot="toaster"]` in the document.
	const positions = [position, ...TOAST_POSITIONS.filter((other) => other !== position)];

	return (
		<>
			{positions.map((stack) => {
				const isDefault = stack === position;

				return (
					<ToastPrimitive.Provider
						key={stack}
						toastManager={managers[stack]}
						limit={persist ? Number.POSITIVE_INFINITY : limit}
						timeout={persist ? 0 : timeout}
					>
						<ToastPrimitive.Portal container={container === undefined ? popupContainer : container}>
							<ToastViewport
								ref={isDefault ? ref : undefined}
								id={isDefault ? id : undefined}
								position={stack}
								isDefault={isDefault}
								testId={isDefault ? viewportTestId : partTestId(viewportTestId, stack)}
								{...props}
							>
								<ToastList position={stack} testId={testId} />
							</ToastViewport>
						</ToastPrimitive.Portal>
					</ToastPrimitive.Provider>
				);
			})}
		</>
	);
});
