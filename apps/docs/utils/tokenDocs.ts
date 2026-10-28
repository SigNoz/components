import {
	colorTokens,
	semanticTokens,
	spacingTokens,
	typographyTokens,
} from '@signozhq/design-tokens';

export interface TokenWithMetadata {
	value: string;
	description?: string;
	usage?: string;
	dontUse?: string;
	category?: string;
	group?: string;
}

export type TokenValue = string | TokenWithMetadata;

export interface ParsedToken {
	name: string;
	value: string;
	description?: string;
	usage?: string;
	dontUse?: string;
	category?: string;
	group?: string;
	cssVariable: string;
	tailwindClass: string;
}

export type ThemeMode = 'light' | 'dark';

export function getTokenValue(token: TokenValue): string {
	return typeof token === 'string' ? token : token.value;
}

export function getTokenMetadata(token: TokenValue): Omit<TokenWithMetadata, 'value'> {
	if (typeof token === 'string') {
		return {};
	}
	const { value: _, ...metadata } = token;
	return metadata;
}

export function getCssVariable(tokenName: string): string {
	return `--${tokenName}`;
}

export function getTailwindClass(tokenName: string, category?: string): string {
	switch (category) {
		case 'background':
			return `bg-${tokenName}`;
		case 'foreground':
			return `text-${tokenName}`;
		case 'border':
			return `border-${tokenName}`;
		default:
			return tokenName;
	}
}

export function parseSemanticTokens(mode: ThemeMode = 'dark'): ParsedToken[] {
	const themeTokens = (
		semanticTokens as Record<string, Record<string, { tokens: Record<string, TokenValue> }>>
	).default?.[mode]?.tokens;
	if (!themeTokens) return [];

	return Object.entries(themeTokens).map(([name, token]) => {
		const metadata = getTokenMetadata(token);
		return {
			name,
			value: getTokenValue(token),
			...metadata,
			cssVariable: getCssVariable(name),
			tailwindClass: getTailwindClass(name, metadata.category),
		};
	});
}

interface ColorShade {
	value: string;
	type: string;
	description?: string;
}

export function parsePrimitiveColors(): ParsedToken[] {
	const tokens: ParsedToken[] = [];
	const bg = colorTokens.bg as Record<string, Record<string, ColorShade>>;

	for (const [colorName, shades] of Object.entries(bg)) {
		for (const [shadeName, shadeData] of Object.entries(shades)) {
			const name = `${colorName.toLowerCase()}-${shadeName}`;
			tokens.push({
				name,
				value: shadeData.value,
				description: shadeData.description || `${colorName} ${shadeName}`,
				category: 'background',
				group: colorName.toLowerCase(),
				cssVariable: getCssVariable(`bg-${name}`),
				tailwindClass: `bg-${name}`,
			});
		}
	}

	return tokens;
}

interface SpacingToken {
	value: string;
	type?: string;
}

export function parseSpacingTokens(): ParsedToken[] {
	const tokens: ParsedToken[] = [];
	const padding = spacingTokens.padding as Record<string, SpacingToken>;
	const margin = spacingTokens.margin as Record<string, SpacingToken>;

	for (const [size, data] of Object.entries(padding)) {
		tokens.push({
			name: `padding-${size}`,
			value: data.value,
			category: 'spacing',
			group: 'padding',
			cssVariable: getCssVariable(`padding-${size}`),
			tailwindClass: `p-${size}`,
		});
	}

	for (const [size, data] of Object.entries(margin)) {
		tokens.push({
			name: `margin-${size}`,
			value: data.value,
			category: 'spacing',
			group: 'margin',
			cssVariable: getCssVariable(`margin-${size}`),
			tailwindClass: `m-${size}`,
		});
	}

	return tokens;
}

export const TEXT_STYLE_VARIANTS = ['label', 'paragraph', 'uppercase', 'code'] as const;

export type TextStyleVariant = (typeof TEXT_STYLE_VARIANTS)[number];

const TEXT_STYLE_SIZES = ['large', 'medium', 'base', 'small'];

export const TEXT_STYLE_PROPERTIES = [
	'fontFamily',
	'fontSize',
	'fontWeight',
	'lineHeight',
	'letterSpacing',
	'textTransform',
] as const;

export type TextStyleProperty = (typeof TEXT_STYLE_PROPERTIES)[number];

type TextStyleTokens = Record<TextStyleProperty, { value: string }>;

export interface ParsedTextStyle extends Record<TextStyleProperty, string> {
	name: string;
	variant: TextStyleVariant;
	size: string;
	weight: string;
}

function bySizeThenWeight(a: ParsedTextStyle, b: ParsedTextStyle): number {
	return (
		TEXT_STYLE_SIZES.indexOf(a.size) - TEXT_STYLE_SIZES.indexOf(b.size) ||
		Number(a.weight) - Number(b.weight)
	);
}

export function parseTextStyles(): ParsedTextStyle[] {
	return TEXT_STYLE_VARIANTS.flatMap((variant) => {
		const sizes: Record<string, Record<string, TextStyleTokens>> = typographyTokens[variant];

		return Object.entries(sizes)
			.flatMap(([size, weights]) =>
				Object.entries(weights).map(([weight, tokens]) => ({
					name: `${variant}-${size}-${weight}`,
					variant,
					size,
					weight,
					fontFamily: tokens.fontFamily.value,
					fontSize: tokens.fontSize.value,
					fontWeight: tokens.fontWeight.value,
					lineHeight: tokens.lineHeight.value,
					letterSpacing: tokens.letterSpacing.value,
					textTransform: tokens.textTransform.value,
				})),
			)
			.sort(bySizeThenWeight);
	});
}

export function getCssPropertyName(property: TextStyleProperty): string {
	return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function getTextStyleVariable(styleName: string, property: TextStyleProperty): string {
	return `--${styleName}-${getCssPropertyName(property)}`;
}

export function groupTokensByGroup(tokens: ParsedToken[]): Map<string, ParsedToken[]> {
	const grouped = new Map<string, ParsedToken[]>();

	for (const token of tokens) {
		const group = token.group || 'other';
		const entries = grouped.get(group);
		if (entries) {
			entries.push(token);
		} else {
			grouped.set(group, [token]);
		}
	}

	return grouped;
}

export function groupTokensByCategory(tokens: ParsedToken[]): Map<string, ParsedToken[]> {
	const grouped = new Map<string, ParsedToken[]>();

	for (const token of tokens) {
		const category = token.category || 'other';
		const entries = grouped.get(category);
		if (entries) {
			entries.push(token);
		} else {
			grouped.set(category, [token]);
		}
	}

	return grouped;
}

export function filterTokens(
	tokens: ParsedToken[],
	options: {
		query?: string;
		category?: string;
		group?: string;
	},
): ParsedToken[] {
	return tokens.filter((token) => {
		const matchesQuery =
			!options.query ||
			token.name.toLowerCase().includes(options.query.toLowerCase()) ||
			token.description?.toLowerCase().includes(options.query.toLowerCase()) ||
			token.value.toLowerCase().includes(options.query.toLowerCase());

		const matchesCategory = !options.category || token.category === options.category;
		const matchesGroup = !options.group || token.group === options.group;

		return matchesQuery && matchesCategory && matchesGroup;
	});
}

export function getUniqueCategories(tokens: ParsedToken[]): string[] {
	const categories = new Set<string>();
	for (const token of tokens) {
		if (token.category) categories.add(token.category);
	}
	return Array.from(categories).sort();
}

export function getUniqueGroups(tokens: ParsedToken[]): string[] {
	const groups = new Set<string>();
	for (const token of tokens) {
		if (token.group) groups.add(token.group);
	}
	return Array.from(groups).sort();
}
