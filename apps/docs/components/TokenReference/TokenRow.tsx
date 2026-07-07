import { Typography } from '@signozhq/ui';
import { ColorSwatch } from './ColorSwatch.js';
import { CopyButton } from './CopyButton.js';
import styles from './TokenRow.module.css';

export interface TokenData {
	name: string;
	value: string;
	description?: string;
	usage?: string;
	dontUse?: string;
	category?: string;
	group?: string;
}

interface TokenRowProps {
	token: TokenData;
	showDetails?: boolean;
}

export function TokenRow({ token, showDetails = false }: TokenRowProps) {
	const cssVariable = `--${token.name}`;
	const tailwindClass =
		token.category === 'background'
			? `bg-${token.name}`
			: token.category === 'foreground'
				? `text-${token.name}`
				: token.category === 'border'
					? `border-${token.name}`
					: token.name;

	return (
		<div className={styles.row}>
			<div className={styles.rowContent}>
				<div className={styles.swatchColumn}>
					<ColorSwatch value={token.value} />
				</div>

				<div className={styles.tokenInfo}>
					<div className={styles.tokenName}>
						<code className={styles.tokenNameCode}>{token.name}</code>
						<CopyButton text={cssVariable} />
					</div>
					{token.description && (
						<Typography size="xs" color="muted" className={styles.tokenDescription}>
							{token.description}
						</Typography>
					)}
				</div>

				<div className={styles.cssVariable}>
					<code className={styles.codeBlock}>{cssVariable}</code>
					<CopyButton text={cssVariable} />
				</div>

				<div className={styles.tailwindColumn}>
					<code className={styles.codeBlock}>{tailwindClass}</code>
					<CopyButton text={tailwindClass} />
				</div>

				{token.category && <span className={styles.categoryBadge}>{token.category}</span>}
			</div>

			{showDetails && (token.usage || token.dontUse) && (
				<div className={styles.details}>
					{token.usage && (
						<div className={styles.detailRow}>
							<span className={styles.detailLabelUse}>Use:</span>
							<span className={styles.detailValue}>{token.usage}</span>
						</div>
					)}
					{token.dontUse && (
						<div className={styles.detailRow}>
							<span className={styles.detailLabelAvoid}>Avoid:</span>
							<span className={styles.detailValue}>{token.dontUse}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
