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
			<Typography size="sm" color="muted" className={styles.emptyState}>
				No tokens found
			</Typography>
		);
	}

	return (
		<div className={styles.table}>
			{title && (
				<div className={styles.tableHeader}>
					<Typography size="sm" weight="semibold" className={styles.tableHeaderTitle}>
						{title}
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
