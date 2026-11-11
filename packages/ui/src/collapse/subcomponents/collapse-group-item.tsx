import { Accordion } from '@base-ui/react/accordion';
import styles from '../collapse.module.scss';
import type { CollapseGroupItemType, CollapseGroupProps } from '../types.js';
import { CollapseSection } from './collapse-section.js';

/**
 * @access private
 */
export type CollapseGroupItemProps = Pick<
	CollapseGroupProps,
	'keepMounted' | 'noContentPadding' | 'textOverflow' | 'headingLevel'
> & {
	item: CollapseGroupItemType;
	open: boolean;
	testId: string | undefined;
	isRegion: boolean;
};

/**
 * One item of `Collapse.Group`: an accordion item around the header and the panel of a section.
 *
 * @access private
 */
export function CollapseGroupItem({
	item,
	open,
	testId,
	keepMounted = false,
	noContentPadding = false,
	textOverflow,
	headingLevel,
	isRegion,
}: CollapseGroupItemProps) {
	return (
		<Accordion.Item
			value={item.value}
			data-slot="collapse-group-item"
			data-testid={testId}
			data-expanded={open || undefined}
			className={styles['collapse-group__item']}
		>
			<CollapseSection
				kind="accordion"
				open={open}
				testId={testId}
				keepMounted={keepMounted}
				noContentPadding={noContentPadding}
				textOverflow={textOverflow}
				headingLevel={headingLevel}
				isRegion={isRegion}
				title={item.title}
				description={item.description}
				prefix={item.prefix}
				headerSuffix={item.headerSuffix}
			>
				{item.children}
			</CollapseSection>
		</Accordion.Item>
	);
}
