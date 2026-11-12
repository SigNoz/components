import { Info } from '@signozhq/icons';
import { isLabelTruncatedInHeight, useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { EMPTY_LABEL_TEXT } from '../constants.js';
import styles from '../field.module.scss';
import type { FieldLabelAndMessageProps } from '../types.js';

/**
 * @access private
 */
export type FieldLabelContentProps = Pick<
	FieldLabelAndMessageProps,
	'label' | 'labelIcon' | 'labelTooltip'
> & {
	required: boolean;
	hasLabelTooltip: boolean;
	testId: string | undefined;
};

/**
 * What a `<label>` or a `<legend>` of a field holds: the icon, the text cut to 2 lines with the
 * full text in a tooltip, the required marker and the info icon of `labelTooltip`.
 *
 * @access private
 */
export function FieldLabelContent({
	label,
	labelIcon,
	labelTooltip,
	hasLabelTooltip,
	required,
	testId,
}: FieldLabelContentProps) {
	const text = label === '' ? EMPTY_LABEL_TEXT : label;
	const [isTruncated, textRef] = useIsLabelTruncated(true, isLabelTruncatedInHeight);

	return (
		<>
			{labelIcon !== undefined && (
				<span
					className={styles['field__label-icon']}
					data-slot="field-label-icon"
					aria-hidden="true"
				>
					{labelIcon}
				</span>
			)}
			<TooltipAnchor content={isTruncated ? text : null}>
				<span
					ref={textRef}
					className={styles['field__label-text']}
					data-slot="field-label-text"
					data-truncated={isTruncated || undefined}
				>
					{text}
				</span>
			</TooltipAnchor>
			{required && (
				<span
					className={styles['field__required-marker']}
					data-slot="field-required-marker"
					aria-hidden="true"
				>
					*
				</span>
			)}
			{hasLabelTooltip && (
				<TooltipAnchor content={labelTooltip}>
					<span
						className={styles['field__label-tooltip']}
						data-slot="field-label-tooltip"
						data-testid={partTestId(testId, 'label-tooltip')}
						aria-hidden="true"
					>
						<Info aria-hidden="true" />
					</span>
				</TooltipAnchor>
			)}
		</>
	);
}
