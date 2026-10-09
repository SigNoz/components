import { SolidAlertCircle, SolidAlertTriangle, SolidCheckCircle2 } from '@signozhq/icons';
import type { CSSProperties, ReactNode } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../input.module.scss';
import type { InputProps, InputSizeType, InputStatusType, InputVariantType } from '../types.js';

const STATUS_ICONS = {
	success: SolidCheckCircle2,
	warning: SolidAlertCircle,
	danger: SolidAlertTriangle,
} as const;

/**
 * @access private
 */
export type InputMemberType = 'password' | 'textarea' | 'number';

/**
 * @access private
 */
export type InputFrameAttributeProps = {
	size: InputSizeType;
	variant: InputVariantType;
	status: InputStatusType | undefined;
	noFocusRing: boolean;
	disabled: boolean;
	readOnly: boolean;
	member: InputMemberType | undefined;
	width: InputProps['width'];
	maxWidth: InputProps['maxWidth'];
	testId: string | undefined;
	dataAttributes: Record<string, unknown>;
};

/**
 * Everything the frame element carries, as one spreadable record, so `Input.Number` can put the
 * same attributes on the Base UI group element it renders instead of the frame `<div>`.
 *
 * @access private
 */
export function getFrameAttributes({
	size,
	variant,
	status,
	noFocusRing,
	disabled,
	readOnly,
	member,
	width,
	maxWidth,
	testId,
	dataAttributes,
}: InputFrameAttributeProps): Record<string, unknown> {
	const style = {
		...(width == null ? {} : { '--input-internal-width': toCssLength(width) }),
		...(maxWidth == null ? {} : { '--input-internal-max-width': toCssLength(maxWidth) }),
	} as CSSProperties;

	return {
		...dataAttributes,
		className: styles['input'],
		style,
		'data-slot': 'input',
		'data-size': size,
		'data-variant': variant,
		...(status === undefined ? {} : { 'data-status': status }),
		...(disabled && !readOnly ? { 'data-disabled': true } : {}),
		...(readOnly ? { 'data-readonly': true } : {}),
		...(noFocusRing ? { 'data-no-focus-ring': true } : {}),
		...(member === undefined ? {} : { 'data-member': member }),
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};
}

/**
 * The trailing icon of a validation state.
 *
 * @access private
 */
export function InputStatusIcon({
	status,
	testId,
}: {
	status: InputStatusType;
	testId: string | undefined;
}) {
	const Icon = STATUS_ICONS[status];

	return (
		<span
			className={styles['input__status-icon']}
			data-slot="input-status-icon"
			data-testid={partTestId(testId, 'status')}
			aria-hidden="true"
		>
			<Icon aria-hidden="true" />
		</span>
	);
}

/**
 * @access private
 */
export type InputFrameSlotsProps = {
	prefix: ReactNode;
	suffix: ReactNode;
	status: InputStatusType | undefined;
	testId: string | undefined;
	children: ReactNode;
};

/**
 * What sits inside the frame, in order: the prefix, the control, the suffix, the status icon.
 * Shared so `Input.Number` renders the same slots inside its own frame element.
 *
 * @access private
 */
export function InputFrameSlots({
	prefix,
	suffix,
	status,
	testId,
	children,
}: InputFrameSlotsProps) {
	return (
		<>
			{hasRenderableContent(prefix) && (
				<span
					className={styles['input__prefix']}
					data-slot="input-prefix"
					data-testid={partTestId(testId, 'prefix')}
				>
					{prefix}
				</span>
			)}
			{children}
			{hasRenderableContent(suffix) && (
				<span
					className={styles['input__suffix']}
					data-slot="input-suffix"
					data-testid={partTestId(testId, 'suffix')}
				>
					{suffix}
				</span>
			)}
			{status !== undefined && <InputStatusIcon status={status} testId={testId} />}
		</>
	);
}

/**
 * @access private
 */
export type InputFrameProps = InputFrameAttributeProps & {
	prefix: ReactNode;
	suffix: ReactNode;
	reason: ReactNode;
	hasReasonAnchor: boolean;
	children: ReactNode;
};

/**
 * The box every member of the compound renders: the bordered row holding the slots, wrapped in the
 * reason tooltip while one of the locked states carries a reason.
 *
 * @access private
 */
export function InputFrame({
	prefix,
	suffix,
	reason,
	hasReasonAnchor,
	children,
	...attributeProps
}: InputFrameProps) {
	const frame = (
		<div {...getFrameAttributes(attributeProps)}>
			<InputFrameSlots
				prefix={prefix}
				suffix={suffix}
				status={attributeProps.status}
				testId={attributeProps.testId}
			>
				{children}
			</InputFrameSlots>
		</div>
	);

	if (!hasReasonAnchor) {
		return frame;
	}

	return <TooltipAnchor content={reason}>{frame}</TooltipAnchor>;
}
