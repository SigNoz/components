import { forwardRef } from 'react';
import { hasRenderableContent, partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../steps.module.scss';
import type { StepsListProps } from '../types.js';
import { splitListAttributes, toListStepKey } from '../utils.js';
import { StepsListFooter } from './steps-list-footer.js';
import { StepsListStep } from './steps-list-step.js';

/**
 * A vertical list of numbered steps, where each step holds its own content, such as the steps of a
 * trace funnel. Reached as `Steps.List`, not imported on its own.
 *
 * Each step has a marker with its number, an optional label next to it, and its content under the
 * label. A line joins each marker to the next one along the full height of the content. There is
 * no current step, so every marker looks the same.
 *
 * The list fills the width of its parent. The marker column has a fixed width, and the label and
 * the content take the rest. The content is not cut: the list grows with it, and the parent owns
 * the scroll.
 *
 * `footer` adds a row after the last step, such as the button that adds a step: a dot in the marker
 * column, the footer in the content column, and the line of the last step running down to the dot.
 * It is not a step and takes no number.
 *
 * It renders a `div` that holds an `ol` with one `li` per step, and the footer after the `ol`. The
 * marker is `aria-hidden`, the list gives the position. The list and the markers are not focusable:
 * the content keeps its own focus order. The footer is outside the `ol`, so a screen reader counts
 * only the steps.
 *
 * `ref` and every `data-*` go to the root `div`. `id` and every `aria-*` go to the `ol`, so an
 * `aria-label` names the list of steps. With an empty `items` there is no `ol`, and the footer
 * renders alone: `id` and `aria-*` have no element to land on. There is no `className` or `style`.
 *
 * ### Asserting on it
 *
 * The number in a test ID is the step number, from 1.
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `steps-list` | the root, a `div` | `${testId}` |
 * | `steps-list-items` | the `ol`, when `items` is not empty | `${testId}-items` |
 * | `steps-list-item` | one per step, the `li` | `${testId}-item-${n}` |
 * | `steps-list-marker` | always | `${testId}-item-${n}-marker` |
 * | `steps-list-connector` | every step but the last | - |
 * | `steps-list-label` | when the step has a `label` | `${testId}-item-${n}-label` |
 * | `steps-list-content` | always | `${testId}-item-${n}-content` |
 * | `steps-list-footer` | when there is a `footer`, a `div` after the `ol` | `${testId}-footer` |
 * | `steps-list-footer-connector` | when there is a `footer` | - |
 * | `steps-list-footer-marker` | when there is a `footer` | `${testId}-footer-marker` |
 * | `steps-list-footer-content` | when there is a `footer` | `${testId}-footer-content` |
 *
 * @example
 * ```tsx
 * <Steps.List
 *   aria-label="Funnel steps"
 *   items={steps.map((step) => ({ children: <FunnelStep key={step.id} step={step} /> }))}
 *   footer={<Button onClick={addStep}>Add Funnel Step</Button>}
 * />
 * ```
 */
export const StepsList = forwardRef<HTMLDivElement, StepsListProps>(function StepsList(
	{
		items,
		footer,
		testId,
		className: _className,
		style: _style,
		current: _current,
		...props
	}: StepsListProps & RejectedProps<'className' | 'style' | 'current'>,
	ref,
) {
	const hasItems = items.length > 0;
	const hasFooter = hasRenderableContent(footer);

	if (!hasItems && !hasFooter) {
		return null;
	}

	const { root, list } = splitListAttributes(props);

	return (
		<div
			{...root}
			ref={ref}
			data-slot="steps-list"
			className={styles['steps-list']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{hasItems && (
				<ol
					{...list}
					data-slot="steps-list-items"
					className={styles['steps-list__items']}
					data-testid={partTestId(testId, 'items')}
				>
					{items.map((item, index) => (
						<StepsListStep
							key={toListStepKey(item, index)}
							item={item}
							step={index + 1}
							// With a footer, the line of the last step runs down to the footer dot.
							isLast={!hasFooter && index === items.length - 1}
							testId={testId}
						/>
					))}
				</ol>
			)}
			{hasFooter && <StepsListFooter testId={testId}>{footer}</StepsListFooter>}
		</div>
	);
});
StepsList.displayName = 'Steps.List';
