import { Typography } from '@signozhq/ui';
import type { TokenData } from './TokenRow.js';
import { TokenRow } from './TokenRow.js';
import styles from './TokenTable.module.css';

interface TokenTableProps {
	tokens: TokenData[];
	title?: string;
}

export function TokenTable({ tokens, title }: TokenTableProps) {
	if (tokens.length === 0) {
		return (
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="tertiary"
				as="p"
				textOverflow="wrap"
				align="center"
				paddingY={16}
			>
				No tokens found
			</Typography>
		);
	}

	return (
		<div className={styles.table}>
			{title && (
				<div className={styles.tableHeader}>
					<Typography
						variant="paragraph"
						size="small"
						weight="bold"
						color="inherit"
						as="p"
						textOverflow="wrap"
					>
						{title.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
					</Typography>
				</div>
			)}

			<div className={styles.columnHeaders}>
				<span className={styles.previewColumn}>Preview</span>
				<span>Token</span>
				<span className={styles.cssVariableColumn}>CSS Variable</span>
				<span className={styles.tailwindColumn}>Tailwind</span>
				<span className={styles.categoryColumn}>Category</span>
			</div>

			<div className={styles.tableBody}>
				{tokens.map((token) => (
					<TokenRow key={token.name} token={token} showDetails={true} />
				))}
			</div>
		</div>
	);
}
