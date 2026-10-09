import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import { SliderTextOverflow } from '../constants.js';
import styles from '../slider.module.scss';
import type { SliderTextOverflowType } from '../types.js';
import {
	getMarkEdge,
	getMarkLayout,
	getMarkList,
	isMarkActive,
	type SliderMark,
} from '../utils.js';

/**
 * @access private
 */
export type SliderMarksProps = {
	marks: Record<number, string> | undefined;
	min: number;
	max: number;
	values: readonly number[];
	textOverflow: SliderTextOverflowType;
	/** The `disabledTooltip` or `readOnlyTooltip` on screen, which a truncated label stacks under. */
	reason: ReactNode;
	/** Called with the value of the mark a click lands on. */
	onSelect: (markValue: number) => void;
	testId: string | undefined;
};

/**
 * The dot of each mark on the track, and the row of labels under it. Renders nothing without
 * marks inside the scale.
 *
 * @access private
 */
export function SliderMarks({
	marks,
	min,
	max,
	values,
	textOverflow,
	reason,
	onSelect,
	testId,
}: SliderMarksProps): ReactElement | null {
	const markList = getMarkList(marks, min, max);

	if (markList.length === 0) {
		return null;
	}

	const layout = getMarkLayout(markList, min, max);

	function markStyle(index: number): CSSProperties {
		const { position, halfGapStart, halfGapEnd } = layout[index];

		return {
			'--slider-internal-mark-position': String(position),
			...(halfGapStart === undefined
				? {}
				: { '--slider-internal-mark-half-gap-start': String(halfGapStart) }),
			...(halfGapEnd === undefined
				? {}
				: { '--slider-internal-mark-half-gap-end': String(halfGapEnd) }),
		} as CSSProperties;
	}

	return (
		<>
			{markList.map((mark, index) => (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- a pointer shortcut, the arrows, Home and End already reach every value
				<span
					key={mark.value}
					data-slot="slider-mark-dot"
					data-active={isMarkActive(mark.value, values, min) || undefined}
					className={styles['slider__mark-dot']}
					style={markStyle(index)}
					onClick={() => onSelect(mark.value)}
				/>
			))}
			<div data-slot="slider-marks" className={styles['slider__marks']} aria-hidden="true">
				{markList.map((mark, index) => (
					<SliderMarkLabel
						key={mark.value}
						mark={mark}
						edge={getMarkEdge(mark.value, min, max)}
						isActive={isMarkActive(mark.value, values, min)}
						style={markStyle(index)}
						textOverflow={textOverflow}
						reason={reason}
						onSelect={onSelect}
						testId={testId}
					/>
				))}
			</div>
		</>
	);
}

type SliderMarkLabelProps = {
	mark: SliderMark;
	edge: 'start' | 'end' | undefined;
	isActive: boolean;
	style: CSSProperties;
	textOverflow: SliderTextOverflowType;
	reason: ReactNode;
	onSelect: (markValue: number) => void;
	testId: string | undefined;
};

/**
 * One label of the row and, with `ellipsis`, the tooltip that shows it in full while truncated.
 */
function SliderMarkLabel({
	mark,
	edge,
	isActive,
	style,
	textOverflow,
	reason,
	onSelect,
	testId,
}: SliderMarkLabelProps): ReactElement {
	const hasOverflowTooltip = textOverflow === SliderTextOverflow.Ellipsis;
	const [isTruncated, labelRef] = useIsLabelTruncated(hasOverflowTooltip);

	const label = (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- a pointer shortcut, the arrows, Home and End already reach every value
		<span
			ref={labelRef}
			data-slot="slider-mark"
			data-active={isActive || undefined}
			data-edge={edge}
			data-truncated={isTruncated || undefined}
			data-testid={partTestId(testId, `mark-${mark.value}`)}
			className={styles['slider__mark']}
			style={style}
			onClick={() => onSelect(mark.value)}
		>
			{mark.label}
		</span>
	);

	// The anchor mounts from the props, not from whether the label is truncated right now, so the
	// label never remounts when the slider is resized.
	if (!hasOverflowTooltip) {
		return label;
	}

	return (
		<TooltipAnchor
			content={
				isTruncated ? (
					<TooltipStack
						items={[
							{ id: 'reason', content: reason },
							{ id: 'label', content: mark.label },
						]}
					/>
				) : null
			}
			// Above the label it would cover the track and the thumbs.
			contentProps={{ side: 'bottom' }}
		>
			{label}
		</TooltipAnchor>
	);
}
