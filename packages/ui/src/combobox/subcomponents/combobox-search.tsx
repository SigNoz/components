import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Search } from '@signozhq/icons';
import { type ReactNode, useId } from 'react';
import { useFieldContext } from '../../lib/field-context.js';
import { partTestId } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import styles from '../combobox.module.scss';
import type { ComboboxSearchInputProps } from '../types.js';

/**
 * The search row pinned at the top of the popup.
 *
 * Base UI owns the field's value, through the root's `inputValue`.
 *
 * @access private
 */
export function ComboboxSearch({
	searchInputProps,
	comboboxTestId,
}: {
	searchInputProps: ComboboxSearchInputProps;
	comboboxTestId: string | undefined;
}): ReactNode {
	const { placeholder, prefix, suffix, loading = false } = searchInputProps;
	const testId = partTestId(comboboxTestId, 'search');
	const inputId = useId();
	const isInField = useFieldContext() !== null;

	return (
		<div data-slot="combobox-search" className={styles['combobox__search']}>
			<span
				data-slot="combobox-search-prefix"
				data-loading={loading || undefined}
				data-testid={partTestId(testId, 'prefix')}
				className={styles['combobox__search-affix']}
			>
				{loading ? <Spinner size={14} /> : (prefix ?? <Search />)}
			</span>
			<BaseCombobox.Input
				data-slot="combobox-search-input"
				placeholder={placeholder}
				aria-label={placeholder}
				// Inside a `Field`, Base UI names every input of the combobox with the field's label. The
				// label names the trigger, and this row is a search: pointing `aria-labelledby` at itself
				// gives the name back to `aria-label`.
				{...(isInField ? { id: inputId, 'aria-labelledby': inputId } : {})}
				className={styles['combobox__search-input']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			/>
			{suffix !== undefined && (
				<span data-slot="combobox-search-suffix" className={styles['combobox__search-affix']}>
					{suffix}
				</span>
			)}
		</div>
	);
}
