import { Check, Copy } from '@signozhq/icons';
import { Button, ButtonColor, ButtonSize, ButtonVariant, Input, Typography } from '@signozhq/ui';
import React, { useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';
import { iconsManifest } from '../data/icons-manifest.js';
import styles from './IconGallery.module.css';

interface IconGalleryProps {
	size?: number;
	strokeWidth?: number;
	color?: string;
}

// Separate component for individual icon cell
const IconCell = React.memo(
	({
		columnIndex,
		rowIndex,
		style,
		data,
	}: {
		columnIndex: number;
		rowIndex: number;
		style: React.CSSProperties;
		data: {
			icons: typeof iconsManifest;
			size: number;
			strokeWidth: number;
			color: string;
			copiedIcon: string | null;
			onCopy: (name: string) => void;
		};
	}) => {
		const { icons, size, strokeWidth, color, copiedIcon, onCopy } = data;
		const index = rowIndex * 6 + columnIndex; // 6 columns
		const icon = icons[index];

		if (!icon) return null;

		const { name, component: Icon } = icon;

		return (
			<div style={style} className={styles.iconCell}>
				<div className={styles.iconCard}>
					<div className={styles.iconWrapper}>
						<Icon size={size} strokeWidth={strokeWidth} color={color} />
					</div>
					<Typography size="sm" className={styles.iconName}>
						{name}
					</Typography>
					<Button
						variant={ButtonVariant.Ghost}
						color={ButtonColor.None}
						size={ButtonSize.SM}
						onClick={() => onCopy(name)}
						prefix={
							copiedIcon === name ? (
								<Check style={{ width: '1rem', height: '1rem' }} />
							) : (
								<Copy style={{ width: '1rem', height: '1rem' }} />
							)
						}
					>
						{copiedIcon === name ? 'Copied!' : 'Copy'}
					</Button>
				</div>
			</div>
		);
	},
);

IconCell.displayName = 'IconCell';

function IconGallery({ size = 24, strokeWidth = 2, color = 'currentColor' }: IconGalleryProps) {
	const [search, setSearch] = useState('');
	const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

	const filteredIcons = useMemo(() => {
		return iconsManifest.filter((icon) => {
			const matchesSearch =
				icon.name.toLowerCase().includes(search.toLowerCase()) ||
				icon.tags.some((tag) => tag.includes(search.toLowerCase()));
			return matchesSearch;
		});
	}, [search]);

	const copyToClipboard = async (iconName: string) => {
		await navigator.clipboard.writeText(`<${iconName} />`);
		setCopiedIcon(iconName);
		setTimeout(() => setCopiedIcon(null), 2000);
	};

	const COLUMN_WIDTH = 230; // Base width for each column
	const ROW_HEIGHT = 180; // Height for each row

	return (
		<div className={styles.container}>
			<div className={styles.searchContainer}>
				<Input
					placeholder="Search icons..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className={styles.gridContainer}>
				<AutoSizer>
					{({ height, width }) => {
						const columnCount = Math.max(1, Math.floor(width / COLUMN_WIDTH));
						const rowCount = Math.ceil(filteredIcons.length / columnCount);

						return (
							<Grid
								columnCount={columnCount}
								columnWidth={COLUMN_WIDTH}
								height={height}
								rowCount={rowCount}
								rowHeight={ROW_HEIGHT}
								width={width}
								itemData={{
									icons: filteredIcons,
									size,
									strokeWidth,
									color,
									copiedIcon,
									onCopy: copyToClipboard,
								}}
							>
								{IconCell}
							</Grid>
						);
					}}
				</AutoSizer>
			</div>
		</div>
	);
}

export default IconGallery;
