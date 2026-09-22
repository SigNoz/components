import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { DROPDOWN_EMPTY_CONTENT, DropdownItemKind } from '../constants.js';
import { DropdownScope, useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownItemType } from '../types.js';
import { DropdownCheckboxItem } from './dropdown-checkbox-item.js';
import { DropdownGroup } from './dropdown-group.js';
import { DropdownItem } from './dropdown-item.js';
import { DropdownLink } from './dropdown-link.js';
import { DropdownRadioGroup } from './dropdown-radio-group.js';
import type { DropdownTooltipSide } from './dropdown-row.js';
import { DropdownSubmenu } from './dropdown-submenu.js';

/**
 * What a menu shows when it has nothing to put in it.
 *
 * Not a row: it takes no highlight stop, so the arrow keys find nothing to walk rather than landing
 * on a line that does nothing.
 *
 * @access private
 */
function DropdownEmpty({ content }: { content: ReactNode }): ReactNode {
	const { testId: dropdownTestId } = useDropdownContext();
	const resolvedTestId = dropdownTestId === undefined ? undefined : `${dropdownTestId}-empty`;

	return (
		<div
			data-slot="dropdown-empty"
			data-empty-content=""
			className={styles['dropdown__empty']}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			{content}
		</div>
	);
}

/**
 * @access private
 */
export type DropdownItemsProps = {
	items: readonly DropdownItemType[];
	/**
	 * Which side the rows' tooltips open against: away from the menu holding them.
	 */
	side: DropdownTooltipSide;
	/**
	 * What to show when `items` is empty. Only the root passes it: a submenu with nothing in it is
	 * a consumer bug and keeps the `<No content>` marker.
	 */
	noContent?: ReactNode;
};

/**
 * The union switch, shared by the menu and every submenu in it.
 *
 * @access private
 */
export function DropdownItems({
	items,
	side,
	noContent = DROPDOWN_EMPTY_CONTENT,
}: DropdownItemsProps): ReactNode {
	if (items.length === 0) {
		return <DropdownEmpty content={noContent} />;
	}

	return (
		<>
			{items.map((item) => {
				switch (item.type) {
					case DropdownItemKind.Separator:
						return (
							<Menu.Separator
								key={item.value}
								data-slot="dropdown-separator"
								className={styles['dropdown__separator']}
							/>
						);
					case DropdownItemKind.Group:
						return (
							<DropdownGroup key={item.value} item={item}>
								<DropdownScope value={item.value}>
									<DropdownItems items={item.items} side={side} />
								</DropdownScope>
							</DropdownGroup>
						);
					case DropdownItemKind.RadioGroup:
						return <DropdownRadioGroup key={item.name} item={item} side={side} />;
					case DropdownItemKind.Link:
						return <DropdownLink key={item.value} item={item} side={side} />;
					case DropdownItemKind.Checkbox:
						return <DropdownCheckboxItem key={item.name} item={item} side={side} />;
					case DropdownItemKind.Submenu:
						return (
							<DropdownSubmenu key={item.value} item={item} side={side}>
								{/* A row inside a submenu opens its tooltip to the right, away from
								    the menu the submenu grew out of. */}
								<DropdownScope value={item.value}>
									<DropdownItems items={item.items} side="right" />
								</DropdownScope>
							</DropdownSubmenu>
						);
					default:
						return <DropdownItem key={item.value} item={item} side={side} />;
				}
			})}
		</>
	);
}
