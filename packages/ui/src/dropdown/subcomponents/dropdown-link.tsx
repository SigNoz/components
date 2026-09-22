import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownLinkItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

/**
 * @access private
 */
export type DropdownLinkProps = {
	item: DropdownLinkItemType;
	side: DropdownTooltipSide;
};

/**
 * One navigating row: the same slots and reasons as an action row, rendered as whatever the call
 * site handed over.
 *
 * `nativeButton={false}` tells Base UI the element is not a `<button>`, which is what keeps `Space`
 * activating an anchor.
 *
 * @access private
 */
export function DropdownLink({ item, side }: DropdownLinkProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const { close } = useDropdownContext();
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	// An inert row drops `render`: an anchor is still followed by a middle click and the context
	// menu, so the only way to block one is not to render it. The row stays in the keyboard walk
	// either way, which is what keeps its reason reachable.
	const renderProps = row.isInert ? {} : { render: item.render, nativeButton: false as const };

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.Item
				{...renderProps}
				data-slot="dropdown-link"
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				aria-disabled={row.isInert || undefined}
				className={styles['dropdown__item']}
				// Navigation is the action, so picking the row always closes the menu. Closing is
				// still this handler's call rather than Base UI's: the row is `aria-disabled`
				// rather than disabled while it is inert, and `closeOnClick` would not know that.
				closeOnClick={false}
				onClick={() => {
					if (!row.isInert) {
						close();
					}
				}}
				{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
			>
				<DropdownRowBody row={row} labelRef={labelRef} prefix={item.prefix} suffix={item.suffix} />
			</Menu.Item>
		</DropdownRowTooltip>
	);
}
