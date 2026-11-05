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
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
				marginBottom={10}
			>
				Pallette
			</Typography>

			{/* Regular colors */}
			<div className={styles.colorGrid}>
				{colors
					.filter((item) => item.name !== 'Gradient')
					.map((color) => (
						<div key={color.name}>
							<Typography
								variant="paragraph"
								size="base"
								weight="bold"
								color="inherit"
								as="p"
								textOverflow="wrap"
								marginTop={8}
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
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
					marginBottom={10}
				>
					Accents
				</Typography>

				{/* Primary Accents */}
				<div className={styles.accentGroup}>
					<div className={styles.accentGroupTitle}>
						<Typography
							variant="uppercase"
							size="small"
							weight="bold"
							color="inherit"
							as="p"
							textOverflow="wrap"
							marginBottom={8}
						>
							PRIMARY
						</Typography>
					</div>
					<div className={styles.accentList}>
						{primaryAccents.map((accentName) => {
							const accent = getAccentColor(accentName);
							if (!accent) return null;
							return (
								<div key={accent.name} className={styles.accentItem}>
									<div className={styles.accentSwatch} style={{ backgroundColor: accent.value }} />
									<div className={styles.accentName}>
										<Typography
											variant="uppercase"
											size="small"
											weight="bold"
											color="inherit"
											as="p"
											textOverflow="wrap"
										>
											{accent.name}
										</Typography>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Secondary Accents */}
				<div>
					<div className={styles.accentGroupTitle}>
						<Typography
							variant="uppercase"
							size="small"
							weight="bold"
							color="inherit"
							as="p"
							textOverflow="wrap"
							marginBottom={8}
						>
							SECONDARY
						</Typography>
					</div>
					<div className={styles.accentListWrap}>
						{secondaryAccents.map((accentName) => {
							const accent = getAccentColor(accentName);
							if (!accent) return null;
							return (
								<div key={accent.name} className={styles.accentItem}>
									<div className={styles.accentSwatch} style={{ backgroundColor: accent.value }} />
									<div className={styles.accentName}>
										<Typography
											variant="uppercase"
											size="small"
											weight="bold"
											color="inherit"
											as="p"
											textOverflow="wrap"
										>
											{accent.name}
										</Typography>
									</div>
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
						<Typography
							variant="paragraph"
							size="base"
							weight="bold"
							color="inherit"
							as="p"
							textOverflow="wrap"
							marginBottom={10}
						>
							Gradients
						</Typography>

						<div className={styles.gradientGrid}>
							{color.shades.map((shade) => (
								<div className={styles.gradientCard} key={shade.name}>
									<div
										className={styles.gradientSwatch}
										style={{ backgroundImage: shade.value }}
									></div>
									<Typography
										variant="paragraph"
										size="small"
										weight="regular"
										color="inherit"
										as="p"
										textOverflow="wrap"
									>
										{shade.name}
									</Typography>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
}

export default ColorPalette;
