import { lazy, type ReactNode, Suspense } from 'react';
import type { BreadcrumbEllipsisOptions } from '../../breadcrumb/types.js';
import { partTestId } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import type { DrawerTrailEntry } from '../drawer-stack-context.js';

// Only a drawer opened in a trail shows it, so the `Breadcrumb` and its `Dropdown` load with the
// first trail instead of with every drawer. The frame keeps its height while they load.
const DrawerTrailBreadcrumb = lazy(() =>
	import('./drawer-trail-breadcrumb.js').then((module) => ({
		default: module.DrawerTrailBreadcrumb,
	})),
);

/**
 * The trail under the header of a drawer opened in a breadcrumb trail.
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
	return (
		<div
			className={styles['drawer__trail']}
			data-slot="drawer-trail"
			data-testid={partTestId(testId, 'trail')}
		>
			<Suspense fallback={null}>
				<DrawerTrailBreadcrumb trail={trail} ellipsis={ellipsis} testId={testId} />
			</Suspense>
		</div>
	);
}
