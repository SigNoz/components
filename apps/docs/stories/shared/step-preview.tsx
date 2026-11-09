import { Badge, Typography } from '@signozhq/ui';
import { Fragment, type ReactElement } from 'react';
import styles from './step-preview.module.css';

export type PreviewStep = {
	kind: string;
	name: string;
	icon: ReactElement;
	facts: [label: string, value: string][];
};

export function StepPreview({
	step,
	from,
	position,
	total,
}: {
	step: PreviewStep;
	from: PreviewStep | undefined;
	position: number;
	total: number;
}): ReactElement {
	return (
		<div>
			<div className={styles.header}>
				{step.icon}
				<Typography
					variant="code"
					size="small"
					weight="medium"
					color="main"
					as="span"
					textOverflow="wrap"
				>
					{step.name}
				</Typography>
				<Badge variant="outlined" color="secondary">
					{step.kind}
				</Badge>
			</div>
			<dl className={styles.facts}>
				{step.facts.map(([label, value]) => (
					<Fragment key={label}>
						<dt>
							<Typography
								variant="label"
								size="small"
								weight="regular"
								color="tertiary"
								as="span"
								textOverflow="wrap"
							>
								{label}
							</Typography>
						</dt>
						<dd>
							<Typography
								variant="code"
								size="small"
								weight="regular"
								color="main"
								as="span"
								textOverflow="wrap"
							>
								{value}
							</Typography>
						</dd>
					</Fragment>
				))}
			</dl>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="tertiary"
				as="p"
				textOverflow="wrap"
				paddingX={6}
				paddingY={4}
			>
				{`Step ${position} of ${total}`}
				{from === undefined ? null : ` · opened from ${from.kind}`}
			</Typography>
		</div>
	);
}
