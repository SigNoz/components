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

interface TypographyToken {
	value: string;
	type?: string;
}

export function parseTypographyTokens(): ParsedToken[] {
	const tokens: ParsedToken[] = [];
	const fontSize = typographyTokens.fontSize as Record<string, TypographyToken>;
	const fontWeight = typographyTokens.fontWeight as Record<string, TypographyToken>;

	for (const [size, data] of Object.entries(fontSize)) {
		tokens.push({
			name: `font-size-${size}`,
			value: data.value,
			category: 'typography',
			group: 'font-size',
			cssVariable: getCssVariable(`font-size-${size}`),
			tailwindClass: `text-${size}`,
		});
	}

	for (const [weight, data] of Object.entries(fontWeight)) {
		tokens.push({
			name: `font-weight-${weight}`,
			value: data.value,
			category: 'typography',
			group: 'font-weight',
			cssVariable: getCssVariable(`font-weight-${weight}`),
			tailwindClass: `font-${weight}`,
		});
	}

	return tokens;
}

export function groupTokensByGroup(tokens: ParsedToken[]): Map<string, ParsedToken[]> {
	const grouped = new Map<string, ParsedToken[]>();

	for (const token of tokens) {
		const group = token.group || 'other';
		if (!grouped.has(group)) {
			grouped.set(group, []);
		}
		grouped.get(group)!.push(token);
	}

	return grouped;
}

export function groupTokensByCategory(tokens: ParsedToken[]): Map<string, ParsedToken[]> {
	const grouped = new Map<string, ParsedToken[]>();

	for (const token of tokens) {
		const category = token.category || 'other';
		if (!grouped.has(category)) {
			grouped.set(category, []);
		}
		grouped.get(category)!.push(token);
	}

	return grouped;
}

export function filterTokens(
	tokens: ParsedToken[],
	options: {
		query?: string;
		category?: string;
		group?: string;
	}
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
