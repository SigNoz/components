import { cloneElement, isValidElement, type ReactElement, type ReactNode, type Ref } from 'react';
import { cn } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import styles from '../button-group.module.scss';

function withClassName(element: ReactElement | undefined, className: string): ReactElement | null {
	if (!isValidElement<{ className?: string }>(element)) {
		return null;
	}

	return cloneElement(element, { className: cn(element.props.className, className) });
}

/**
 * @access private
 */
export type ButtonGroupMemberContentProps = {
	/**
	 * `undefined` for an icon member.
	 */
	label?: ReactNode;
	/**
	 * True when the label is the `<No label>` fallback.
	 */
	emptyLabel?: boolean;
	/**
	 * Takes the prefix slot. An icon member has no label or suffix.
	 */
	icon?: ReactElement;
	prefix?: ReactElement;
	suffix?: ReactElement;
	labelRef?: Ref<HTMLSpanElement>;
	/**
	 * Paints a text label from `data-label` instead of holding the text. Set on a collapsed member,
	 * so the text is in the DOM once and `getByText` finds the open menu's row, not two matches.
	 */
	paintLabel?: boolean;
};

/**
 * What a member shows between its borders: the prefix slot with its spinner, the label and the
 * suffix. Shared by the members and by the ellipsis replica the group measures.
 *
 * @access private
 */
export function ButtonGroupMemberContent({
	label,
	emptyLabel,
	icon,
	prefix,
	suffix,
	labelRef,
	paintLabel = false,
}: ButtonGroupMemberContentProps): ReactElement {
	const labelText =
		paintLabel && (typeof label === 'string' || typeof label === 'number')
			? String(label)
			: undefined;

	const prefixElement = icon ?? prefix;
	const suffixElement =
		icon === undefined ? withClassName(suffix, styles['button-group__suffix']) : null;

	return (
		<>
			<span
				data-slot="button-group-item-prefix-wrapper"
				className={styles['button-group__prefix-wrapper']}
				data-empty={!prefixElement}
			>
				<span
					data-slot="button-group-item-prefix-slot"
					className={styles['button-group__prefix-slot']}
				>
					{withClassName(prefixElement, styles['button-group__prefix'])}
				</span>
				<span
					data-slot="button-group-item-prefix-loading"
					className={styles['button-group__loader-slot']}
					aria-hidden="true"
				>
					<Spinner />
				</span>
			</span>
			{icon === undefined && (
				<span
					ref={labelRef}
					data-slot="button-group-item-label"
					data-empty-label={emptyLabel || undefined}
					data-label={labelText}
					className={styles['button-group__label']}
				>
					{labelText === undefined ? label : null}
				</span>
			)}
			{suffixElement && (
				<span
					data-slot="button-group-item-suffix-slot"
					className={styles['button-group__suffix-slot']}
				>
					{suffixElement}
				</span>
			)}
		</>
	);
}
