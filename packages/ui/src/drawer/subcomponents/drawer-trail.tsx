import { cloneElement, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import {
	Breadcrumb,
	type BreadcrumbEllipsisOptions,
	type BreadcrumbItemType,
} from '../../breadcrumb/index.js';
import { isPlainClick } from '../../lib/is-plain-click.js';
import { partTestId } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import type { DrawerTrailEntry } from '../drawer-stack-context.js';
import { stepBackInTrail } from '../utils.js';

/**
 * The first crumb, the `...` crumb that lists the earlier steps, and the last three.
 */
const TRAIL_MAX_VISIBLE = 4;

/**
 * The `...` crumb of a trail unless the first drawer of the trail sets its own `trailEllipsis`:
 * its list shows the earlier steps, and every row ends with the number of its step.
 */
const TRAIL_ELLIPSIS: BreadcrumbEllipsisOptions = {
	heading: 'Earlier steps',
	rowSuffix: (_item, index) => (
		<span aria-hidden className={styles['drawer__trail-step']}>
			{index + 1}
		</span>
	),
};

/**
 * The trail under the header of a drawer opened in a breadcrumb trail: one crumb per drawer, and
 * per earlier step of a drawer's own `trail`, root first and this one last. A click on an earlier
 * crumb steps back to it. On a crumb with a link, only a plain click does: a click with a modifier
 * key is left to the browser, so the link opens in a new tab.
 *
 * @access private
 */
export function DrawerTrail({
	trail,
	ellipsis,
	testId,
}: {
	trail: readonly DrawerTrailEntry[];
	ellipsis: BreadcrumbEllipsisOptions | undefined;
	testId: string | undefined;
}): ReactNode {
	const items = trail.map((entry, index): BreadcrumbItemType => {
		const { title, icon } = entry;

		// The drawer on top is on screen: its crumb is the current page, with no link and no card.
		if (index === trail.length - 1) {
			return { title, icon };
		}

		const { href, target, render, preview } = entry;
		const isLink = href !== undefined || render !== undefined;

		const stepBack = (event: MouseEvent): void => {
			if (isLink) {
				if (!isPlainClick(event)) {
					return;
				}
				// The link is there for a new tab: a plain click goes back in the trail instead.
				event.preventDefault();
			}
			stepBackInTrail(trail, index);
		};

		// The handler of a `render` element runs before the one of the crumb, and a router link
		// navigates in it unless the click is already cancelled, so the step back goes first, on
		// the element itself.
		const link: Pick<BreadcrumbItemType, 'href' | 'target' | 'render' | 'onClick'> =
			render === undefined
				? { href, target, onClick: stepBack }
				: {
						href,
						target,
						render: cloneElement(
							render as ReactElement<{ onClick?: (event: MouseEvent) => void }>,
							{
								onClick: (event: MouseEvent) => {
									stepBack(event);
									(render.props as { onClick?: (event: MouseEvent) => void }).onClick?.(event);
								},
							},
						),
					};

		return { title, icon, preview, ...link };
	});

	return (
		<div
			className={styles['drawer__trail']}
			data-slot="drawer-trail"
			data-testid={partTestId(testId, 'trail')}
		>
			<Breadcrumb
				items={items}
				variant="outlined"
				collapseFrom="start"
				separator="›"
				maxVisible={TRAIL_MAX_VISIBLE}
				ellipsis={{ ...TRAIL_ELLIPSIS, ...ellipsis }}
				aria-label="Drill-down trail"
				testId={partTestId(testId, 'trail-breadcrumb')}
			/>
		</div>
	);
}
