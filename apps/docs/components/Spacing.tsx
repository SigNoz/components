import { Typography } from '@signozhq/ui';
import { getTransformedSpacingTokens } from '../utils.js';
import styles from './Spacing.module.css';

const spacing = getTransformedSpacingTokens();
const spacingKeys = Object.keys(spacing);

function Spacing() {
	return (
		<div className={styles.container}>
			<Typography size="lg" weight="bold" className={styles.title}>
				Spacing Scale
			</Typography>

			{spacingKeys.map((size) => {
				const value = spacing[size as keyof typeof spacing];

				return (
					<div key={size} className={styles.spacingItem}>
						<Typography size="sm">
							{size} - {value}
						</Typography>
						<div className={styles.spacingBar} style={{ width: value }}></div>
					</div>
				);
			})}
		</div>
	);
}

export default Spacing;
