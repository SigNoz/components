import { Autocomplete } from '@base-ui/react/autocomplete';
import { Search } from '@signozhq/icons';
import { type ReactNode, type Ref, useId } from 'react';
import { partTestId } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import styles from '../command.module.scss';
import type { CommandSearchInputProps } from '../types.js';

/**
 * @access private
 */
export type CommandSearchProps = {
	label: string;
	searchInputProps: CommandSearchInputProps;
	commandTestId: string | undefined;
	inputRef: Ref<HTMLInputElement>;
	onKeyDown: Autocomplete.Input.Props['onKeyDown'];
};

/**
 * The search row pinned at the top of the palette.
 *
 * @access private
 */
export function CommandSearch({
	label,
	searchInputProps,
	commandTestId,
	inputRef,
	onKeyDown,
}: CommandSearchProps): ReactNode {
	const { placeholder, prefix, suffix, loading = false } = searchInputProps;
	const inputId = useId();
	const testId = partTestId(commandTestId, 'search');

	return (
		<div data-slot="command-search" className={styles['command__search']}>
			<label htmlFor={inputId} className={styles['command__visually-hidden']}>
				{label}
			</label>
			<span
				data-slot="command-search-prefix"
				data-loading={loading || undefined}
				data-testid={partTestId(testId, 'prefix')}
				aria-hidden
				className={styles['command__search-affix']}
			>
				{loading ? <Spinner size={14} /> : (prefix ?? <Search />)}
			</span>
			<Autocomplete.Input
				id={inputId}
				data-slot="command-search-input"
				placeholder={placeholder}
				ref={inputRef}
				onKeyDown={onKeyDown}
				className={styles['command__search-input']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			/>
			{suffix !== undefined && (
				<span
					data-slot="command-search-suffix"
					data-testid={partTestId(testId, 'suffix')}
					className={styles['command__search-affix']}
				>
					{suffix}
				</span>
			)}
		</div>
	);
}
