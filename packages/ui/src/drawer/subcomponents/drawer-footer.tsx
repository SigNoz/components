import type { ReactNode } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { Skeleton } from '../../skeleton/index.js';
import styles from '../drawer.module.scss';
import type { DrawerProps } from '../types.js';

type DrawerFooterProps = Pick<DrawerProps, 'footerPrefix' | 'footerSuffix' | 'testId'> & {
	loading: boolean;
};

/**
 * The footer of a `task` drawer: `footerPrefix` at the start, apart from the `footerSuffix`
 * actions at the end. Renders nothing without a `footerSuffix`.
 *
 * @access private
 */
export function DrawerFooter({
	footerPrefix,
	footerSuffix,
	loading,
	testId,
}: DrawerFooterProps): ReactNode {
	if (!hasRenderableContent(footerSuffix)) {
		return null;
	}

	return (
		<div
			className={styles['drawer__footer']}
			data-slot="drawer-footer"
			data-testid={partTestId(testId, 'footer')}
		>
			{hasRenderableContent(footerPrefix) ? (
				<div
					className={styles['drawer__footer-prefix']}
					data-slot="drawer-footer-prefix"
					data-testid={partTestId(testId, 'footer-prefix')}
				>
					{loading ? <Skeleton.Button size="md" /> : footerPrefix}
				</div>
			) : null}
			<div
				className={styles['drawer__footer-suffix']}
				data-slot="drawer-footer-suffix"
				data-testid={partTestId(testId, 'footer-suffix')}
			>
				{loading ? (
					<>
						<Skeleton.Button size="md" />
						<Skeleton.Button size="md" />
					</>
				) : (
					footerSuffix
				)}
			</div>
		</div>
	);
}
