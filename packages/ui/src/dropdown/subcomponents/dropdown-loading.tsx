import type { ReactNode } from 'react';
import { Spinner } from '../../spinner/spinner.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';

/**
 * @access private
 */
export type DropdownLoadingProps = {
	/**
	 * What to show in place of the rows. A spinner when it renders nothing.
	 */
	content: ReactNode;
};

/**
 * What stands in for the rows while the menu is loading.
 *
 * Not a row: it takes no highlight stop, so the arrow keys have nothing to walk while the list is
 * on its way.
 *
 * @access private
 */
export function DropdownLoading({ content }: DropdownLoadingProps): ReactNode {
	const { testId: dropdownTestId } = useDropdownContext();
	const resolvedTestId = dropdownTestId === undefined ? undefined : `${dropdownTestId}-loading`;

	// An `<output>` rather than a div with `role="status"`: same implicit role, and the rows it
	// stands in for are what the user is waiting to be told about.
	return (
		<output
			data-slot="dropdown-loading"
			className={styles['dropdown__loading']}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			{content ?? <Spinner size={14} />}
		</output>
	);
}
