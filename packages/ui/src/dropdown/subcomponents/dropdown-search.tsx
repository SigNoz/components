import { Search } from '@signozhq/icons';
import { type KeyboardEvent, type MutableRefObject, type ReactNode, useId } from 'react';
import { Spinner } from '../../spinner/spinner.js';
import {
	DROPDOWN_ROW_SELECTOR,
	DROPDOWN_SEARCH_LABEL,
	DROPDOWN_SEARCH_PASSTHROUGH_KEYS,
} from '../constants.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownSearchInputProps } from '../types.js';

/**
 * @access private
 */
export type DropdownSearchProps = {
	searchInputProps: DropdownSearchInputProps;
	query: string;
	onQueryChange: (value: string) => void;
	/**
	 * The popup, so `ArrowDown` can hand the highlight to the first row.
	 */
	popupRef: MutableRefObject<HTMLDivElement | null>;
	/**
	 * The field, so the first row can hand the focus back on `ArrowUp`.
	 */
	inputRef: MutableRefObject<HTMLInputElement | null>;
};

/**
 * The pinned search row.
 *
 * A sibling of the viewport rather than a row inside it, so it stays put while the rows scroll
 * under it.
 *
 * @access private
 */
export function DropdownSearch({
	searchInputProps,
	query,
	onQueryChange,
	popupRef,
	inputRef,
}: DropdownSearchProps): ReactNode {
	const { testId: dropdownTestId } = useDropdownContext();
	const inputId = useId();
	const { placeholder, prefix, suffix, loading } = searchInputProps;
	const resolvedTestId = dropdownTestId === undefined ? undefined : `${dropdownTestId}-search`;

	// Base UI runs typeahead on every printable key, which would race the text being typed here.
	// Only the keys that mean "leave the field" reach it.
	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (!DROPDOWN_SEARCH_PASSTHROUGH_KEYS.includes(event.key)) {
			// `Enter` stops here on purpose. Passed through, it would fire whichever row the
			// highlight happens to be on, which is rarely the one the user was reading.
			event.stopPropagation();

			if (event.key === 'Enter') {
				event.preventDefault();
			}

			return;
		}

		if (event.key !== 'ArrowDown') {
			return;
		}

		const firstRow = popupRef.current?.querySelector<HTMLElement>(DROPDOWN_ROW_SELECTOR);

		if (firstRow !== null && firstRow !== undefined) {
			event.preventDefault();
			event.stopPropagation();
			firstRow.focus();
		}
	}

	return (
		<div data-slot="dropdown-search" className={styles['dropdown__search']}>
			<span data-slot="dropdown-search-prefix" className={styles['dropdown__search-affix']}>
				{loading === true ? <Spinner /> : (prefix ?? <Search />)}
			</span>
			<input
				ref={inputRef}
				id={inputId}
				type="text"
				autoComplete="off"
				data-slot="dropdown-search-input"
				className={styles['dropdown__search-input']}
				placeholder={placeholder}
				aria-label={placeholder ?? DROPDOWN_SEARCH_LABEL}
				value={query}
				onChange={(event) => {
					onQueryChange(event.target.value);
					searchInputProps.onChange?.(event.target.value);
				}}
				onKeyDown={handleKeyDown}
				{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
			/>
			{suffix !== undefined && (
				<span data-slot="dropdown-search-suffix" className={styles['dropdown__search-affix']}>
					{suffix}
				</span>
			)}
		</div>
	);
}
