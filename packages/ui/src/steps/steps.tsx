import { forwardRef, useEffect } from 'react';
import { isBlankText } from '../lib/blank-text.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './steps.module.scss';
import { StepsList } from './subcomponents/steps-list.js';
import { StepsStep } from './subcomponents/steps-step.js';
import type { StepsProps } from './types.js';
import { getStepStatus, isValidCurrent, toCurrentStep } from './utils.js';

/**
 * A row of numbered steps that shows where the user is in a flow with a known number of steps,
 * such as the onboarding setup. Use `Steps.List` for a vertical list where each step holds its own
 * content.
 *
 * It is display only: no step can be clicked, and the page moves between steps with its own
 * buttons.
 *
 * Every `aria-*` and any `data-*` are forwarded to the `ol`. `className` and `style` are not
 * props, and a value that gets past the types is dropped.
 *
 * Visual values are `--steps-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * It renders an `ol` with one `li` per step, so a screen reader announces a list and the count of
 * steps. The current step carries `aria-current="step"`, and a done step reads the word
 * `Completed` after its label. The markers are `aria-hidden`. The list has no name of its own: a
 * screen with two `Steps` passes an `aria-label` to each.
 *
 * It is not a live region. When `current` changes, the page owns the focus and the announcement of
 * the new step.
 *
 * ### Layout
 *
 * The row fills the width of its parent and never wraps. Every step but the last takes an equal
 * share of the row, and a line joins the end of its text to the next marker. The last step takes
 * the same share, up to the width of its content, so when the row is short every step is cut
 * alike.
 *
 * A change of `current` moves nothing: no step changes its position or its size.
 *
 * ### Ellipsis
 *
 * While a label or a description is cut, it is a tab stop, so its tooltip opens from the keyboard
 * too. The markers never shrink: when even the cut text does not fit, the row overflows its
 * parent.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root and the prefix of every step and part. The number in a
 * test ID is the step number, from 1. Otherwise use the role and the data attributes, never the
 * hashed class names.
 *
 * | attribute | on | value |
 * |---|---|---|
 * | `data-slot` | root | `"steps"` |
 * | `data-current` | root | `current` after the fallback to `1`, kept above the count of steps when every step is done |
 * | `data-status` | each step | `done`, `current` or `waiting` |
 * | `data-truncated` | label, description | present only while the text is cut |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `steps-item` | one per step, the `li` | `${testId}-item-${n}` |
 * | `steps-marker` | always | `${testId}-item-${n}-marker` |
 * | `steps-label` | always | `${testId}-item-${n}-label` |
 * | `steps-description` | when the step has a `description` | `${testId}-item-${n}-description` |
 * | `steps-connector` | every step but the last | - |
 *
 * @example
 * ```tsx
 * <Steps
 *   aria-label="Setup progress"
 *   current={2}
 *   items={[
 *     { label: 'Select data source', description: 'Kubernetes' },
 *     { label: 'Configure', description: 'my-cluster' },
 *     { label: 'Send data' },
 *   ]}
 * />
 * ```
 */
const StepsRoot = forwardRef<HTMLOListElement, StepsProps>(function Steps(
	{
		items,
		current,
		testId,
		className: _className,
		style: _style,
		...props
	}: StepsProps & RejectedProps,
	ref,
) {
	const isInvalidCurrent = !isValidCurrent(current);
	const currentStep = toCurrentStep(current);
	const reserveDescription = items.some((item) => !isBlankText(item.description));

	const hasSteps = items.length > 0;

	useEffect(() => {
		if (isInvalidCurrent && hasSteps) {
			console.warn(
				`Steps: \`current\` must be an integer from 1, got ${String(current)}, showing step 1.`,
			);
		}
	}, [isInvalidCurrent, hasSteps, current]);

	if (!hasSteps) {
		return null;
	}

	return (
		<TooltipProviderIfMissing>
			<ol
				{...props}
				ref={ref}
				data-slot="steps"
				data-current={currentStep}
				className={styles.steps}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{items.map((item, index) => (
					<StepsStep
						// The steps are a fixed order with no identity of their own: step 2 is the
						// second item, whatever it holds.
						// oxlint-disable-next-line react/no-array-index-key
						key={index}
						item={item}
						step={index + 1}
						status={getStepStatus(index + 1, currentStep)}
						isLast={index === items.length - 1}
						reserveDescription={reserveDescription}
						testId={testId}
					/>
				))}
			</ol>
		</TooltipProviderIfMissing>
	);
});

export const Steps = Object.assign(StepsRoot, { List: StepsList });
