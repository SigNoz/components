import { GripVertical } from '@signozhq/icons';
import { useRef } from 'react';
import { Separator } from 'react-resizable-panels';
import styles from '../resizable.module.scss';
import { isBlankLabel, useTestIdAttribute } from '../utils.js';

/**
 * @access private
 */
export type ResizableHandleProps = {
	id: string;
	/**
	 * The `label` of the panel before the handle, which the handle resizes.
	 */
	label: string;
	testId: string | undefined;
};

/**
 * The line between two panels of a `Resizable`, with its grip.
 *
 * @access private
 */
export function ResizableHandle({ id, label, testId }: ResizableHandleProps) {
	const elementRef = useRef<HTMLDivElement>(null);

	useTestIdAttribute(elementRef, testId, id);

	return (
		<Separator
			id={id}
			elementRef={elementRef}
			aria-label={isBlankLabel(label) ? undefined : label}
			data-slot="resizable-handle"
			className={styles['resizable__handle']}
		>
			<span
				data-slot="resizable-handle-grip"
				aria-hidden="true"
				className={styles['resizable__grip']}
			>
				<GripVertical className={styles['resizable__grip-icon']} />
			</span>
		</Separator>
	);
}
