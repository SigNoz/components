import { Popover } from '@base-ui/react/popover';
import { type ReactElement, type ReactNode, type RefObject, useEffect, useId } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { POPOVER_SIDE_OFFSET } from '../../popover/constants.js';
import styles from '../breadcrumb.module.scss';
import { BREADCRUMB_ELLIPSIS_PAYLOAD, BREADCRUMB_ELLIPSIS_POPUP_LABEL } from '../constants.js';
import type {
	BreadcrumbEllipsisOptions,
	BreadcrumbPopupPayloadType,
	BreadcrumbResolvedItem,
} from '../types.js';
import type { BreadcrumbPopupState } from '../use-breadcrumb-popup.js';
import { hasPreview } from '../utils.js';
import { BreadcrumbCollapsedList } from './breadcrumb-collapsed-list.js';

/**
 * @access private
 */
export type BreadcrumbPopupBoxProps = {
	popup: BreadcrumbPopupState;
	/**
	 * What the trigger the popup is open for handed it: the place in `items` of a crumb, or the
	 * `...` crumb. `undefined` for the moment before the trigger has handed it over.
	 */
	payload: BreadcrumbPopupPayloadType | undefined;
	resolved: BreadcrumbResolvedItem[];
	/**
	 * The crumbs that sit in the list of the `...` crumb, which have no card.
	 */
	collapsed: BreadcrumbResolvedItem[];
	ellipsis: BreadcrumbEllipsisOptions | undefined;
	/**
	 * What `ellipsis.render` returned for the collapsed crumbs, which replaces the list.
	 */
	ellipsisContent: ReactNode;
	/**
	 * The element the layer the trail sits in is read from.
	 */
	layerSource: RefObject<HTMLElement | null>;
	testId: string | undefined;
	/**
	 * Keeps the focus where it is when the popup opens, for a `ForceOpenProvider` that holds it open.
	 */
	held: boolean;
};

/**
 * The positioner, the popup and the viewport that swaps their content, for the card of a crumb or
 * the list of the `...` crumb.
 *
 * Mounts on open, so the layer the trail sits in is read once per open. The popup closes when what
 * it is open for loses its content: a crumb collapses into the list of the `...` crumb, its
 * `preview` renders nothing, or the last crumb of the list is gone.
 *
 * @access private
 */
export function BreadcrumbPopupBox({
	popup,
	payload,
	resolved,
	collapsed,
	ellipsis,
	ellipsisContent,
	layerSource,
	testId,
	held,
}: BreadcrumbPopupBoxProps): ReactElement {
	const { handle, popupRef } = popup;
	const layerStyle = useLayerZIndex(layerSource, 'var(--breadcrumb-preview-z-index, 50)');
	const headingId = useId();
	const isEllipsis = payload === BREADCRUMB_ELLIPSIS_PAYLOAD;
	const slot = isEllipsis ? 'breadcrumb-ellipsis-popup' : 'breadcrumb-preview';
	const entry =
		typeof payload === 'number' ? resolved.find(({ index }) => index === payload) : undefined;
	const card =
		entry !== undefined && hasPreview(entry) && !collapsed.some(({ index }) => index === payload)
			? entry.item.preview
			: null;
	const isList = ellipsis?.render === undefined;
	const list =
		collapsed.length === 0 ? null : isList ? (
			<BreadcrumbCollapsedList
				collapsed={collapsed}
				heading={ellipsis?.heading}
				headingId={headingId}
				rowSuffix={ellipsis?.rowSuffix}
				testId={partTestId(testId, 'ellipsis')}
				onPick={() => handle.close()}
			/>
		) : (
			ellipsisContent
		);
	const content = isEllipsis ? list : card;
	const isEmpty = payload !== undefined && !hasRenderableContent(content);
	const name =
		isList && hasRenderableContent(ellipsis?.heading)
			? { 'aria-labelledby': headingId }
			: { 'aria-label': BREADCRUMB_ELLIPSIS_POPUP_LABEL };

	useEffect(() => {
		if (isEmpty) {
			handle.close();
		}
	}, [handle, isEmpty]);

	return (
		<Popover.Positioner
			side="bottom"
			align="start"
			sideOffset={POPOVER_SIDE_OFFSET}
			data-slot={`${slot}-positioner`}
			className={styles['breadcrumb__preview-positioner']}
			style={layerStyle}
		>
			<Popover.Popup
				ref={popupRef}
				initialFocus={isEllipsis && !held ? undefined : false}
				finalFocus={isEllipsis ? undefined : false}
				// Base UI makes every popup a dialog, and a card is not one.
				role={isEllipsis ? 'dialog' : undefined}
				{...(isEllipsis ? name : {})}
				data-slot={slot}
				data-testid={partTestId(testId, isEllipsis ? 'ellipsis-popup' : 'preview')}
				className={styles['breadcrumb__preview']}
			>
				<Popover.Viewport
					data-slot={`${slot}-viewport`}
					className={styles['breadcrumb__preview-viewport']}
				>
					{content}
				</Popover.Viewport>
			</Popover.Popup>
		</Popover.Positioner>
	);
}
