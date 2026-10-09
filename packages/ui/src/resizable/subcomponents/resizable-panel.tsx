import { useRef } from 'react';
import { Panel } from 'react-resizable-panels';
import { partTestId } from '../../lib/utils.js';
import styles from '../resizable.module.scss';
import type { ResizableItemType } from '../types.js';
import { useTestIdAttribute } from '../utils.js';

/**
 * @access private
 */
export type ResizablePanelProps = {
	item: ResizableItemType;
	id: string;
	/**
	 * Keeps the panel's size in pixels when the root changes size.
	 */
	fixed: boolean;
	testId: string | undefined;
};

/**
 * One panel of a `Resizable`, and the box inside it that scrolls.
 *
 * @access private
 */
export function ResizablePanel({ item, id, fixed, testId }: ResizablePanelProps) {
	const { value, children, defaultSize, minSize, maxSize, onResize } = item;
	const elementRef = useRef<HTMLDivElement>(null);
	const reportedSize = useRef<number | undefined>(undefined);

	// The test ID of the panel goes on the box that scrolls, so the library's one on its outer box
	// goes.
	useTestIdAttribute(elementRef, undefined, id);

	return (
		<Panel
			id={id}
			elementRef={elementRef}
			defaultSize={defaultSize}
			minSize={minSize}
			maxSize={maxSize}
			groupResizeBehavior={fixed ? 'preserve-pixel-size' : 'preserve-relative-size'}
			// The library reports every change to the panel's box, the other axis included, and the
			// size again each time the panel registers anew, as it does when a limit changes.
			onResize={(size) => {
				if (size.inPixels !== reportedSize.current) {
					reportedSize.current = size.inPixels;
					onResize?.(size.inPixels);
				}
			}}
		>
			<div
				data-slot="resizable-panel"
				data-testid={partTestId(testId, `panel-${value}`)}
				className={styles['resizable__panel']}
			>
				{children}
			</div>
		</Panel>
	);
}
