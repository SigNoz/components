import { type ReactElement, type ReactNode, useEffect } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { BREADCRUMB_ELLIPSIS_PAYLOAD } from '../constants.js';
import type {
	BreadcrumbEllipsisOptions,
	BreadcrumbPopupHandleType,
	BreadcrumbPopupPayloadType,
	BreadcrumbResolvedItem,
} from '../types.js';
import { hasPreview } from '../utils.js';
import { BreadcrumbCollapsedList } from './breadcrumb-collapsed-list.js';

/**
 * @access private
 */
export type BreadcrumbPopupContentProps = {
	handle: BreadcrumbPopupHandleType;
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
	 * The id of the heading of the list, which names the popup.
	 */
	headingId: string;
	/**
	 * Held open by a `ForceOpenProvider`, so a pick in the list does not close it.
	 */
	held: boolean;
	testId: string | undefined;
};

/**
 * What the popup of the trail shows: the card of a crumb, or the list of the `...` crumb.
 *
 * The popup closes when what it is open for loses its content: a crumb collapses into the list of
 * the `...` crumb, its `preview` renders nothing, or the last crumb of the list is gone.
 *
 * @access private
 */
export function BreadcrumbPopupContent({
	handle,
	payload,
	resolved,
	collapsed,
	ellipsis,
	ellipsisContent,
	headingId,
	held,
	testId,
}: BreadcrumbPopupContentProps): ReactElement {
	const isEllipsis = payload === BREADCRUMB_ELLIPSIS_PAYLOAD;
	const entry =
		typeof payload === 'number' ? resolved.find(({ index }) => index === payload) : undefined;
	const card =
		entry !== undefined && hasPreview(entry) && !collapsed.some(({ index }) => index === payload)
			? entry.item.preview
			: null;
	const list =
		collapsed.length === 0 ? null : ellipsis?.render === undefined ? (
			<BreadcrumbCollapsedList
				collapsed={collapsed}
				heading={ellipsis?.heading}
				headingId={headingId}
				rowSuffix={ellipsis?.rowSuffix}
				testId={partTestId(testId, 'ellipsis')}
				onPick={() => {
					if (!held) {
						handle.close();
					}
				}}
			/>
		) : (
			ellipsisContent
		);
	const content = isEllipsis ? list : card;
	const isEmpty = payload !== undefined && !hasRenderableContent(content);

	useEffect(() => {
		if (isEmpty) {
			handle.close();
		}
	}, [handle, isEmpty]);

	return <>{content}</>;
}
