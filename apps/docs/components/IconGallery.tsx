import React, { useState, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { iconsManifest } from '../data/icons-manifest';
import { Input } from '@signozhq/input';
import { Button } from '@signozhq/button';
import { Copy, Check } from 'lucide-react';

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
			<div style={style} className="p-2">
				<div className="flex flex-col items-center p-4 rounded-lg border border-border hover:border-primary transition-colors h-full">
					<div className="flex items-center justify-center w-16 h-16 mb-2">
						<Icon size={size} strokeWidth={strokeWidth} color={color} />
					</div>
					<span className="text-sm text-center mb-2">{name}</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onCopy(name)}
						className="gap-0"
					>
						{copiedIcon === name ? (
							<Check className="size-4 mr-2" />
						) : (
							<Copy className="size-4 mr-2" />
						)}
						{copiedIcon === name ? 'Copied!' : 'Copy'}
					</Button>
				</div>
			</div>
		);
	},
);

IconCell.displayName = 'IconCell';

function IconGallery({
	size = 24,
	strokeWidth = 2,
	color = 'currentColor',
}: IconGalleryProps) {
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

	const COLUMN_WIDTH = 200; // Base width for each column
	const ROW_HEIGHT = 180; // Height for each row

	return (
		<div className="flex flex-col h-[calc(100vh-100px)]">
			<div className="flex flex-col gap-4 mb-4">
				<Input
					placeholder="Search icons..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className="flex-1">
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
