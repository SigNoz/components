import { Autocomplete } from '@base-ui/react/autocomplete';
import { type ReactNode, useId } from 'react';
import { Kbd } from '../../kbd/kbd.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { hasTooltipContent } from '../../tooltip/tooltip-content-stack-context.js';
import { COMMAND_EMPTY_LABEL } from '../constants.js';
import styles from '../command.module.scss';
import type { CommandActionItemType } from '../types.js';

/**
 * @access private
 */
export type CommandItemProps = {
	item: CommandActionItemType;
	commandTestId: string | undefined;
	onPick: (item: CommandActionItemType) => void;
};

/**
 * One action row.
 *
 * @access private
 */
export function CommandItem({ item, commandTestId, onPick }: CommandItemProps): ReactNode {
	const isLabelEmpty = !hasRenderableContent(item.label);
	const testId = item.testId ?? partTestId(commandTestId, `item-${item.value}`);

	// `loading` outranks `disabled`, the way it does on `Button`: while the row is waiting it is
	// not disabled at all, and its reason is what the row is waiting for.
	const isLoading = item.loading === true;
	const isDisabled = !isLoading && item.disabled === true;
	const reason = isLoading ? item.loadingTooltip : isDisabled ? item.disabledTooltip : null;
	const hasReason = hasTooltipContent(reason);
	const reasonId = useId();

	// The spinner takes the leading slot when the row has a prefix, and the trailing one otherwise,
	// so the label stays where it is.
	const hasPrefix = hasRenderableContent(item.prefix);
	const isSuffixLoading = isLoading && !hasPrefix;
	const hasShortcut = !isSuffixLoading && hasRenderableContent(item.shortcut);
	const spinner = <Spinner size={14} />;
	const prefix = isLoading && hasPrefix ? spinner : item.prefix;
	const idleSuffix = hasShortcut ? <Kbd size="sm">{item.shortcut}</Kbd> : item.suffix;
	const suffix = isSuffixLoading ? spinner : idleSuffix;
	const suffixId = useId();

	// The suffix is hidden so the shortcut stays out of the row's name. A screen reader reads it as
	// the description instead, after the reason.
	const describedBy =
		[hasReason ? reasonId : '', hasShortcut ? suffixId : ''].filter(Boolean).join(' ') || undefined;

	return (
		<Autocomplete.Item
			value={item.value}
			// With it, Base UI marks the row `aria-disabled` and drops a click or a plain `Enter` on it. The
			// arrow keys still land on it. A modified `Enter` goes through the panel, which checks too.
			disabled={isLoading || isDisabled}
			// Base UI sets `aria-selected` only on rows that can be selected, and a palette row runs an
			// action instead. The highlighted row carries it so a screen reader announces where
			// `Enter` lands.
			//
			// The focus never leaves the field, so the reason opens with the highlight, from the
			// keyboard as from the pointer. The trigger stays mounted, so the row never remounts when
			// a reason appears.
			render={(props, state) => (
				<TooltipAnchor
					content={hasReason ? reason : null}
					open={state.highlighted}
					contentProps={{ id: reasonId, side: 'right' }}
				>
					<div {...props} aria-selected={state.highlighted} />
				</TooltipAnchor>
			)}
			onClick={() => {
				onPick(item);
			}}
			aria-describedby={describedBy}
			data-slot="command-item"
			// Over Base UI's own `data-disabled`, which a loading row would carry too.
			data-disabled={isDisabled || undefined}
			data-loading={isLoading || undefined}
			className={styles['command__item']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{hasRenderableContent(prefix) && (
				<span
					data-slot="command-item-prefix"
					data-testid={partTestId(testId, 'prefix')}
					data-loading={(isLoading && hasPrefix) || undefined}
					aria-hidden
					className={styles['command__item-affix']}
				>
					{prefix}
				</span>
			)}
			<span
				data-slot="command-item-label"
				data-empty-label={isLabelEmpty || undefined}
				className={styles['command__item-label']}
			>
				{isLabelEmpty ? COMMAND_EMPTY_LABEL : item.label}
			</span>
			{hasRenderableContent(suffix) && (
				<span
					id={suffixId}
					data-slot="command-item-suffix"
					data-testid={partTestId(testId, 'suffix')}
					data-loading={isSuffixLoading || undefined}
					aria-hidden
					className={styles['command__item-affix']}
				>
					{suffix}
				</span>
			)}
		</Autocomplete.Item>
	);
}
