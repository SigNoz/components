import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import styles from '../dropdown.module.scss';

/**
 * @access private
 */
export type DropdownAffixProps = {
	/**
	 * The slot name. The content and the spinner take it with `-content` and `-loading` appended.
	 */
	slot: string;
	/**
	 * The slot's `data-testid`. The content, the spinner's layer and the spinner take it with
	 * `-content`, `-loading` and `-spinner` appended.
	 */
	testId: string | undefined;
	className: string;
	/**
	 * When true, the spinner cross-fades in over the content.
	 */
	loading: boolean;
	/**
	 * Without content, the slot collapses to nothing while it is not loading.
	 */
	children?: ReactNode;
};

/**
 * A leading or trailing slot that can trade its content for a spinner, the way `Button` does with
 * its prefix.
 *
 * Both layers stay mounted and share one grid cell, so the swap animates both ways instead of
 * snapping. The spinner is paused while it is hidden.
 *
 * @access private
 */
export function DropdownAffix({
	slot,
	testId,
	className,
	loading,
	children,
}: DropdownAffixProps): ReactNode {
	return (
		<span
			data-slot={slot}
			data-loading={loading || undefined}
			data-empty={children === undefined || undefined}
			className={cn(className, styles['dropdown__affix'])}
			data-testid={testId}
		>
			<span
				data-slot={`${slot}-content`}
				className={styles['dropdown__affix-content']}
				aria-hidden={loading || undefined}
				data-testid={testId && `${testId}-content`}
			>
				{children}
			</span>
			<span
				data-slot={`${slot}-loading`}
				className={styles['dropdown__affix-loader']}
				aria-hidden="true"
				data-testid={testId && `${testId}-loading`}
			>
				<Spinner testId={testId && `${testId}-spinner`} />
			</span>
		</span>
	);
}
