import { Typography } from '@signozhq/ui';
import styles from './ColorSwatch.module.css';

interface ColorSwatchProps {
	value: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function ColorSwatch({ value, size = 'md', className = '' }: ColorSwatchProps) {
	const sizeClasses = {
		sm: styles.swatchSm,
		md: styles.swatchMd,
		lg: styles.swatchLg,
	};

	const isColorValue =
		value.startsWith('var(--') ||
		value.startsWith('#') ||
		value.startsWith('rgb') ||
		value.startsWith('hsl') ||
		value.startsWith('color-mix');

	if (!isColorValue) {
		return (
			<div className={`${styles.swatch} ${sizeClasses[size]} ${styles.placeholder} ${className}`}>
				<Typography size="xs" color="muted">
					-
				</Typography>
			</div>
		);
	}

	return (
		<div
			className={`${styles.swatch} ${sizeClasses[size]} ${styles.colorSwatch} ${className}`}
			style={{ backgroundColor: value }}
			title={value}
		/>
	);
}
