import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { hasRenderableContent } from '../../lib/utils.js';
import { DROPDOWN_EMPTY_LABEL } from '../constants.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownGroupItemType } from '../types.js';

/**
 * @access private
 */
export type DropdownGroupProps = {
	item: Pick<DropdownGroupItemType, 'label' | 'value' | 'testId'>;
	children: ReactNode;
};

/**
 * A section heading and the rows under it.
 *
 * The heading is not interactive and takes no highlight stop, so the arrow keys pass over it.
 *
 * @access private
 */
export function DropdownGroup({ item, children }: DropdownGroupProps): ReactNode {
	const { testId: dropdownTestId } = useDropdownContext();
	const isLabelEmpty = !hasRenderableContent(item.label);
	const resolvedTestId =
		item.testId ??
		(dropdownTestId === undefined ? undefined : `${dropdownTestId}-group-${item.value}`);

	return (
		<Menu.Group
			data-slot="dropdown-group"
			className={styles['dropdown__group']}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			<Menu.GroupLabel
				data-slot="dropdown-group-label"
				data-empty-label={isLabelEmpty || undefined}
				className={styles['dropdown__group-label']}
			>
				{isLabelEmpty ? DROPDOWN_EMPTY_LABEL : item.label}
			</Menu.GroupLabel>
			{children}
		</Menu.Group>
	);
}
