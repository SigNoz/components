import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from '@signozhq/icons';
import { forwardRef, type ReactNode } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../callout.module.scss';
import { CALLOUT_EMPTY_DESCRIPTION, CALLOUT_EMPTY_TITLE } from '../constants.js';
import type { CalloutProps } from '../types.js';
import { CalloutFrame } from './callout-frame.js';

export type CalloutExpandableProps = CalloutProps & {
	/**
	 * The single heading line, which stays visible when the callout is collapsed. A long title
	 * ends in an ellipsis, and a tooltip shows the whole of it while it is cut.
	 *
	 * @note Expected to be a string. The ellipsis and the tooltip only work with a string.
	 *
	 * @note An empty title renders `<No title>`, exported as `CALLOUT_EMPTY_TITLE`.
	 */
	title: ReactNode;
	/**
	 * Whether the description is visible on mount. The state is uncontrolled and does not
	 * survive a reload.
	 */
	defaultExpanded: boolean;
};

/**
 * A callout whose description the user can hide. Reached as `Callout.Expandable`, not imported on
 * its own.
 *
 * It is the only callout with a `title`: the title row, the icon and the chevron stay when
 * collapsed. The whole title row is one button, so a click on the title or on the chevron
 * toggles. A click on the description does nothing, since it holds links and text to select.
 *
 * ### Collapse
 *
 * A Base UI collapsible: the callout is its root, the title row its trigger and the description
 * its panel. Collapsed hides the description with `hidden="until-found"` and keeps it mounted, so
 * find in page reaches its text and expands the callout. The title row has `aria-expanded`, and
 * `aria-controls` pointing at the description while expanded, and its name is the title. The root
 * carries `data-has-title`, and `data-open` or `data-closed`.
 *
 * ### Empty
 *
 * Unlike `Callout`, it never hides: an empty title renders `CALLOUT_EMPTY_TITLE` and an empty
 * description renders `CALLOUT_EMPTY_DESCRIPTION`, so the broken state of the message stays
 * visible.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `callout` | the root, carries `testId` |
 * | `callout-icon` | the icon |
 * | `callout-toggle` | the title row, the button that holds the title and the chevron |
 * | `callout-title` | the title, `data-truncated` while it does not fit |
 * | `callout-description` | the description |
 *
 * @example
 * ```tsx
 * <Callout.Expandable
 *   color="primary"
 *   size="sm"
 *   icon={<SolidInfoCircle />}
 *   title="What is instrumentation?"
 *   defaultExpanded
 * >
 *   Instrumentation is the code that produces telemetry.
 * </Callout.Expandable>
 * ```
 */
export const CalloutExpandable = forwardRef<HTMLDivElement, CalloutExpandableProps>(
	function CalloutExpandable({ title, defaultExpanded, children, ...props }, ref) {
		const [isTruncated, labelRef] = useIsLabelTruncated(true);
		const { testId } = props;
		const titleContent = hasRenderableContent(title) ? title : CALLOUT_EMPTY_TITLE;

		// The whole row is the button: people click the title about as often as the chevron. The
		// tooltip sits on the button too, so keyboard focus opens it, not only a hover.
		const header = (
			<TooltipAnchor content={isTruncated ? titleContent : null}>
				<Collapsible.Trigger
					data-slot="callout-toggle"
					className={styles['callout__toggle']}
					data-testid={partTestId(testId, 'toggle')}
				>
					<span
						ref={labelRef}
						data-slot="callout-title"
						data-truncated={isTruncated || undefined}
						className={styles['callout__title']}
						data-testid={partTestId(testId, 'title')}
					>
						{titleContent}
					</span>
					<span className={styles['callout__button']} aria-hidden="true">
						<ChevronDown />
					</span>
				</Collapsible.Trigger>
			</TooltipAnchor>
		);

		return (
			<Collapsible.Root
				defaultOpen={defaultExpanded}
				render={
					<CalloutFrame
						{...props}
						ref={ref}
						header={header}
						descriptionRender={<Collapsible.Panel hiddenUntilFound />}
					>
						{hasRenderableContent(children) ? children : CALLOUT_EMPTY_DESCRIPTION}
					</CalloutFrame>
				}
			/>
		);
	},
);
CalloutExpandable.displayName = 'Callout.Expandable';
