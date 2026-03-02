interface ColorSwatchProps {
	value: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function ColorSwatch({ value, size = 'md', className = '' }: ColorSwatchProps) {
	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	};

	const isColorValue =
		value.startsWith('var(--') ||
		value.startsWith('#') ||
		value.startsWith('rgb') ||
		value.startsWith('hsl') ||
		value.startsWith('color-mix');

	if (!isColorValue) {
		return (
			<div
				className={`${sizeClasses[size]} rounded border border-l2-border flex items-center justify-center bg-l2-background ${className}`}
			>
				<span className="text-xs text-l3-foreground">—</span>
			</div>
		);
	}

	return (
		<div
			className={`${sizeClasses[size]} rounded border border-l2-border shadow-sm ${className}`}
			style={{ backgroundColor: value }}
			title={value}
		/>
	);
}
