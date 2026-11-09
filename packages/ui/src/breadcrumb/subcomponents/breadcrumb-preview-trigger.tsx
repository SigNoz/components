import { Popover } from '@base-ui/react/popover';
import { type ReactElement, useId } from 'react';
import { POPOVER_HOVER_DELAY } from '../../popover/constants.js';
import {
	BREADCRUMB_PREVIEW_CLOSE_DELAY,
	BREADCRUMB_PREVIEW_TRIGGER_RESET,
	BreadcrumbItemKind,
} from '../constants.js';
import type { BreadcrumbItemKindType } from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { useBreadcrumbPreviewFocus } from '../use-breadcrumb-preview-focus.js';

/**
 * @access private
 */
export type BreadcrumbPreviewTriggerProps = {
	popup: BreadcrumbPopupState;
	/**
	 * The place of the crumb in `items`, which the popup reads the crumb by.
	 */
	index: number;
	kind: BreadcrumbItemKindType;
	/**
	 * The element of the crumb, merged in as the `render` of the trigger, so the crumb keeps its
	 * element, its ref, its link and its click.
	 */
	children: ReactElement<{ id?: string }>;
};

/**
 * Makes the element of a crumb a trigger of the card of its `preview`, on hover and on the keyboard
 * focus.
 *
 * A Base UI trigger is a button that a press opens, and a crumb is neither. What it adds for that is
 * taken back: the role, the `tabindex` and the `aria-*` that announce a dialog, the toggle on a click
 * and the click that `Space` and `Enter` make.
 *
 * @access private
 */
export function BreadcrumbPreviewTrigger({
	popup,
	index,
	kind,
	children,
}: BreadcrumbPreviewTriggerProps): ReactElement {
	const generatedId = useId();
	// The id Base UI tracks the trigger by: the one on the element would replace it, since the
	// props of the `render` element win.
	const id = children.props.id ?? generatedId;
	const focus = useBreadcrumbPreviewFocus(popup, id);
	const { handle } = popup;

	return (
		<Popover.Trigger
			handle={handle}
			payload={index}
			openOnHover
			delay={POPOVER_HOVER_DELAY}
			closeDelay={BREADCRUMB_PREVIEW_CLOSE_DELAY}
			nativeButton={kind === BreadcrumbItemKind.Button}
			id={id}
			render={children}
			{...BREADCRUMB_PREVIEW_TRIGGER_RESET}
			onClick={(event) => {
				event.preventBaseUIHandler();

				// Base UI leaves a press on another trigger alone, so a list the `...` crumb holds open
				// would outlive the click that a press outside closes it with.
				if (handle.isOpen && !event.currentTarget.hasAttribute('data-popup-open')) {
					handle.close();
				}
			}}
			onKeyDown={(event) => event.preventBaseUIHandler()}
			onKeyUp={(event) => event.preventBaseUIHandler()}
			onFocus={focus.onFocus}
			onBlur={focus.onBlur}
		/>
	);
}
