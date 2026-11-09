import { Popover } from '@base-ui/react/popover';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { useForceOpen } from '../../lib/force-open.js';
import { usePopupContainer } from '../../lib/popup-container.js';
import type { BreadcrumbEllipsisOptions, BreadcrumbResolvedItem } from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { BreadcrumbPopupBox } from './breadcrumb-popup-box.js';

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
	layerSource: RefObject<HTMLElement | null>;
	testId: string | undefined;
};

/**
 * The popup of the trail, portalled into the panel of a `Dialog` or a `Drawer` when there is one,
 * and into the body otherwise.
 *
 * Under a `ForceOpenProvider` it is held open on the list of the `...` crumb while crumbs are
 * collapsed, and held closed otherwise. It is controlled for the life of the provider, since
 * Base UI does not let a popup switch between controlled and uncontrolled.
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
	layerSource,
	testId,
}: BreadcrumbPopupProps): ReactElement {
	const popupContainer = usePopupContainer();
	const forced = useForceOpen();

	return (
		<Popover.Root
			handle={popup.handle}
			onOpenChange={popup.onOpenChange}
			{...(forced
				? {
						open: hasEllipsisPopup,
						triggerId: hasEllipsisPopup ? popup.ellipsisTriggerId : null,
					}
				: {})}
		>
			{({ payload }) => (
				<Popover.Portal container={popupContainer}>
					<BreadcrumbPopupBox
						popup={popup}
						payload={payload}
						resolved={resolved}
						collapsed={collapsed}
						ellipsis={ellipsis}
						ellipsisContent={ellipsisContent}
						layerSource={layerSource}
						testId={testId}
						held={forced}
					/>
				</Popover.Portal>
			)}
		</Popover.Root>
	);
}
