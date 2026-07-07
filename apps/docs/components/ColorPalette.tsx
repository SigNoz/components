import { Typography } from '@signozhq/ui';
import { getTransformedColorTokens } from '../utils.js';
import styles from './ColorPalette.module.css';

const colors = getTransformedColorTokens();

// Function to calculate luminance and determine if we should use light or dark text
function getContrastTextColor(hexColor: string): string {
	const hex = hexColor.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// brightness calculation
	const brightness = (r + g + b) / 3;

	return brightness > 127 ? styles.textBlack : styles.textWhite;
}

function ColorPalette() {
	// Accent colors configuration
	const primaryAccents = ['robin'];
	const secondaryAccents = ['forest', 'amber', 'cherry', 'aqua', 'sakura', 'sienna'];

	// Get accent color data
	const getAccentColor = (colorName: string) => {
		const color = colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
		if (!color) return null;
		const shade500 = color.shades.find((s) => s.name === '500');
		return shade500 ? { name: color.name, value: shade500.value } : null;
	};

	return (
		<div className={styles.container}>
			<Typography size="lg" weight="bold" className={styles.title}>
				Pallette
			</Typography>

			{/* Regular colors */}
			<div className={styles.colorGrid}>
				{colors
					.filter((item) => item.name !== 'Gradient')
					.map((color) => (
						<div key={color.name}>
							<Typography
								size="base"
								weight="bold"
								className={styles.colorCard}
								style={{ textTransform: 'capitalize' }}
							>
								{color.name}
							</Typography>
							<div className={styles.colorShades}>
								{color.shades.map((shade) => (
									<div
										key={shade.name}
										className={`${styles.colorShade} ${getContrastTextColor(shade.value)}`}
										style={{ backgroundColor: shade.value }}
									>
										<span>{shade.name}</span>
										<span className={styles.shadeValue}>{shade.value}</span>
									</div>
								))}
							</div>
						</div>
					))}
			</div>

			{/* Accents */}
			<div className={styles.accentsSection}>
				<Typography size="lg" weight="bold" className={styles.accentsTitle}>
					Accents
				</Typography>

				{/* Primary Accents */}
				<div className={styles.accentGroup}>
					<Typography
						size="xs"
						weight="semibold"
						className={styles.accentGroupTitle}
						style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
					>
						PRIMARY
					</Typography>
					<div className={styles.accentList}>
						{primaryAccents.map((accentName) => {
							const accent = getAccentColor(accentName);
							if (!accent) return null;
							return (
								<div key={accent.name} className={styles.accentItem}>
									<div className={styles.accentSwatch} style={{ backgroundColor: accent.value }} />
									<Typography
										size="xs"
										weight="semibold"
										className={styles.accentName}
										style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
									>
										{accent.name}
									</Typography>
								</div>
							);
						})}
					</div>
				</div>

				{/* Secondary Accents */}
				<div>
					<Typography
						size="xs"
						weight="semibold"
						className={styles.accentGroupTitle}
						style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
					>
						SECONDARY
					</Typography>
					<div className={styles.accentListWrap}>
						{secondaryAccents.map((accentName) => {
							const accent = getAccentColor(accentName);
							if (!accent) return null;
							return (
								<div key={accent.name} className={styles.accentItem}>
									<div className={styles.accentSwatch} style={{ backgroundColor: accent.value }} />
									<Typography
										size="xs"
										weight="semibold"
										className={styles.accentName}
										style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
									>
										{accent.name}
									</Typography>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Gradients */}
			{colors
				.filter((item) => item.name === 'Gradient')
				.map((color) => (
					<div key={color.name}>
						<Typography size="lg" weight="bold" className={styles.gradientsTitle}>
							Gradients
						</Typography>

						<div className={styles.gradientGrid}>
							{color.shades.map((shade) => (
								<div className={styles.gradientCard} key={shade.name}>
									<div
										className={styles.gradientSwatch}
										style={{ backgroundImage: shade.value }}
									></div>
									<Typography size="sm">{shade.name}</Typography>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
}

export default ColorPalette;
