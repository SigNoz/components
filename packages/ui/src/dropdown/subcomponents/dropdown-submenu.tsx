import { Menu } from '@base-ui/react/menu';
import { ChevronRight } from '@signozhq/icons';
import { type ReactNode, useEffect, useState } from 'react';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownSubmenuItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';
import { DropdownPositioner } from './dropdown-positioner.js';
import { DropdownViewport } from './dropdown-viewport.js';

/**
 * @access private
 */
export type DropdownSubmenuProps = {
	item: DropdownSubmenuItemType;
	side: DropdownTooltipSide;
	children: ReactNode;
};

/**
 * A row that opens a menu of its own, and that menu.
 *
 * One level deep, enforced by the item type rather than by a check here. The trailing slot is the
 * chevron, which is why the kind has no `suffix`.
 *
 * @access private
 */
export function DropdownSubmenu({ item, side, children }: DropdownSubmenuProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const { container, popupStyle } = useDropdownContext();
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	const [trigger, setTrigger] = useState<HTMLElement | null>(null);

	const isEmpty = item.items.length === 0;

	// The fallback keeps the popup readable, and this says the submenu is empty rather than letting
	// an empty box ship as if it were a design. An empty search result is a different case and does
	// not come through here.
	useEffect(() => {
		if (isEmpty) {
			console.warn(`Dropdown: the submenu "${value}" has no items, showing the empty row.`);
		}
	}, [isEmpty, value]);

	return (
		<Menu.SubmenuRoot
			closeParentOnEsc={false}
			// Not Base UI's `disabled`, on either part: it would take the trigger out of the
			// keyboard walk and the row's reason with it. Cancelling the open keeps the row
			// highlightable and inert at once, the same trade `ToggleGroup` makes.
			onOpenChange={(open, eventDetails) => {
				if (open && row.isInert) {
					eventDetails.cancel();
				}
			}}
		>
			<DropdownRowTooltip row={row} side={side}>
				<Menu.SubmenuTrigger
					ref={setTrigger}
					data-slot="dropdown-submenu-trigger"
					data-disabled={row.isDisabled || undefined}
					data-loading={row.isLoading || undefined}
					aria-disabled={row.isInert || undefined}
					className={styles['dropdown__item']}
					{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
				>
					<DropdownRowBody
						row={row}
						labelRef={labelRef}
						prefix={item.prefix}
						suffix={<ChevronRight data-slot="dropdown-submenu-chevron" />}
					/>
				</Menu.SubmenuTrigger>
			</DropdownRowTooltip>
			<Menu.Portal container={container}>
				<DropdownPositioner trigger={trigger} side="inline-end" align="start">
					<Menu.Popup
						data-slot="dropdown-popup"
						data-submenu=""
						className={styles['dropdown']}
						style={popupStyle}
					>
						<DropdownViewport>{children}</DropdownViewport>
					</Menu.Popup>
				</DropdownPositioner>
			</Menu.Portal>
		</Menu.SubmenuRoot>
	);
}
