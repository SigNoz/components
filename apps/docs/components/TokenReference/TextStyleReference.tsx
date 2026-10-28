import { Typography } from '@signozhq/ui';
import type { CSSProperties } from 'react';
import type {
	ParsedTextStyle,
	TextStyleProperty,
	TextStyleVariant,
} from '../../utils/tokenDocs.js';
import {
	getCssPropertyName,
	getTextStyleVariable,
	parseTextStyles,
	TEXT_STYLE_PROPERTIES,
	TEXT_STYLE_VARIANTS,
} from '../../utils/tokenDocs.js';
import { CopyButton } from './CopyButton.js';
import styles from './TextStyleReference.module.css';

const VARIANTS: Record<TextStyleVariant, { title: string; description: string; sample: string }> = {
	label: {
		title: 'Label',
		description:
			'Single-line text: buttons, menu items, tabs, badges, a label next to a control. The line height is 1, so the height of the box comes from its layout.',
		sample: 'Create dashboard',
	},
	paragraph: {
		title: 'Paragraph',
		description:
			'Text that can wrap: descriptions, toast and callout bodies, tooltips, empty states. The only styles with a line height above 1.',
		sample: 'Traces show where a request spent its time, across every service it touched.',
	},
	uppercase: {
		title: 'Uppercase',
		description:
			'Uppercase text with wide letter spacing, such as the label of a group of menu items. The only styles that set a text-transform.',
		sample: 'Recent dashboards',
	},
	code: {
		title: 'Code',
		description: 'Monospace text: code, attribute keys and keyboard keys.',
		sample: "service.name = 'frontend'",
	},
};

const textStyles = parseTextStyles();

function readStyle(name: string, property: TextStyleProperty): string {
	return `var(${getTextStyleVariable(name, property)})`;
}

function getSampleStyle(name: string): CSSProperties {
	return {
		fontFamily: readStyle(name, 'fontFamily'),
		fontSize: readStyle(name, 'fontSize'),
		fontWeight: readStyle(name, 'fontWeight'),
		lineHeight: readStyle(name, 'lineHeight'),
		letterSpacing: readStyle(name, 'letterSpacing'),
		textTransform: readStyle(name, 'textTransform'),
	};
}

function getDeclarations({ name, variant }: ParsedTextStyle): string {
	return TEXT_STYLE_PROPERTIES.filter(
		(property) => property !== 'textTransform' || variant === 'uppercase',
	)
		.map((property) => `${getCssPropertyName(property)}: ${readStyle(name, property)};`)
		.join('\n');
}

function getFirstFamily(fontFamily: string): string {
	const [first = fontFamily] = fontFamily.split(',');
	return first.replace(/['"]/g, '').trim();
}

function TextStyleRow({ style }: { style: ParsedTextStyle }) {
	return (
		<div className={styles.row}>
			<p className={styles.sample} style={getSampleStyle(style.name)}>
				{VARIANTS[style.variant].sample}
			</p>
			<div className={styles.name}>
				<code className={styles.nameCode}>{style.name}</code>
				<CopyButton
					text={getDeclarations(style)}
					label={`Copy the declarations of ${style.name}`}
				/>
			</div>
			<span className={styles.value}>{style.fontSize}</span>
			<span className={styles.value}>{style.fontWeight}</span>
			<span className={styles.value}>{style.lineHeight}</span>
			<span className={styles.value}>{style.letterSpacing}</span>
			<span className={styles.value} title={style.fontFamily}>
				{getFirstFamily(style.fontFamily)}
			</span>
		</div>
	);
}

export function TextStyleReference() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					{textStyles.length} text styles. Every text element takes its font from exactly one of
					them and sets the five font properties from it, plus text-transform for uppercase. The
					copy button next to a style copies those declarations.
				</Typography>

				{TEXT_STYLE_VARIANTS.map((variant) => (
					<section key={variant} className={styles.table}>
						<div className={styles.tableHeader}>
							<Typography
								variant="paragraph"
								size="small"
								weight="bold"
								color="inherit"
								as="p"
								textOverflow="wrap"
							>
								{VARIANTS[variant].title}
							</Typography>
							<Typography
								variant="paragraph"
								size="small"
								weight="regular"
								color="secondary"
								as="p"
								textOverflow="wrap"
							>
								{VARIANTS[variant].description}
							</Typography>
						</div>

						<div className={styles.columnHeaders}>
							<span>Sample</span>
							<span>Style</span>
							<span className={styles.valueHeader}>Size</span>
							<span className={styles.valueHeader}>Weight</span>
							<span className={styles.valueHeader}>Line height</span>
							<span className={styles.valueHeader}>Letter spacing</span>
							<span className={styles.valueHeader}>Family</span>
						</div>

						{textStyles
							.filter((style) => style.variant === variant)
							.map((style) => (
								<TextStyleRow key={style.name} style={style} />
							))}
					</section>
				))}
			</div>
		</div>
	);
}
