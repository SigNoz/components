import { type ReactElement, type ReactNode, useEffect, useId } from 'react';
import { ForceOpenProvider, ForceOpenReset } from '../../lib/force-open.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { Popover } from '../../popover/popover.js';
import { BREADCRUMB_ELLIPSIS_POPUP_LABEL } from '../constants.js';
import type {
	BreadcrumbEllipsisOptions,
	BreadcrumbPopupPayloadType,
	BreadcrumbResolvedItem,
} from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { BreadcrumbPopupContent } from './breadcrumb-popup-content.js';

/**
 * @access private
 */
export type BreadcrumbPopupProps = {
	popup: BreadcrumbPopupState;
	resolved: BreadcrumbResolvedItem[];
	collapsed: BreadcrumbResolvedItem[];
	ellipsis: BreadcrumbEllipsisOptions | undefined;
	ellipsisContent: ReactNode;
	/**
	 * Whether the `...` crumb renders and opens anything, which a `ForceOpenProvider` holds it open
	 * on.
	 */
	hasEllipsisPopup: boolean;
	testId: string | undefined;
};

/**
 * The popup of the trail: one `Popover` that the `...` crumb and every crumb with a `preview` open
 * through its handle. The `...` crumb opens the list as a dialog, a crumb its card.
 *
 * Under a `ForceOpenProvider` the trail holds the popup itself, on the list of the `...` crumb
 * while crumbs are collapsed and closed otherwise, so the `Popover` is let out of the provider. The
 * content goes back under it.
 *
 * @access private
 */
export function BreadcrumbPopup({
	popup,
	resolved,
	collapsed,
	ellipsis,
	ellipsisContent,
	hasEllipsisPopup,
	testId,
}: BreadcrumbPopupProps): ReactElement {
	const { handle, forced, ellipsisTriggerId } = popup;
	const headingId = useId();
	const held = forced && hasEllipsisPopup;
	const name =
		ellipsis?.render === undefined && hasRenderableContent(ellipsis?.heading)
			? { 'aria-labelledby': headingId }
			: { 'aria-label': BREADCRUMB_ELLIPSIS_POPUP_LABEL };

	// The `...` crumb has registered with the handle by now: it renders before this, in the trail.
	useEffect(() => {
		if (held) {
			handle.openTrigger(ellipsisTriggerId);
		} else if (forced) {
			handle.close();
		}
	}, [handle, held, forced, ellipsisTriggerId]);

	return (
		<ForceOpenReset>
			<Popover
				handle={handle}
				side="bottom"
				align="start"
				onOpenChange={popup.onOpenChange}
				// Held open, the list keeps the focus where it is.
				initialFocus={forced ? false : undefined}
				testId={testId}
				{...name}
			>
				{(payload: BreadcrumbPopupPayloadType | undefined) => {
					const content = (
						<BreadcrumbPopupContent
							handle={handle}
							payload={payload}
							resolved={resolved}
							collapsed={collapsed}
							ellipsis={ellipsis}
							ellipsisContent={ellipsisContent}
							headingId={headingId}
							held={forced}
							testId={testId}
						/>
					);

					return forced ? <ForceOpenProvider>{content}</ForceOpenProvider> : content;
				}}
			</Popover>
		</ForceOpenReset>
	);
}
