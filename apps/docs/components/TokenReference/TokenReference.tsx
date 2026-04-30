import { colorTokens, semanticTokens } from '@signozhq/design-tokens';
import { Button } from '@signozhq/ui';
import { useMemo, useState } from 'react';
import type { TokenData } from './TokenRow.js';
import { TokenSearch } from './TokenSearch.js';
import { TokenTable } from './TokenTable.js';

type ThemeMode = 'light' | 'dark';

export type SemanticTokenGroup =
	| 'surface-levels'
	| 'actions'
	| 'callouts'
	| 'accents'
	| 'sidebar'
	| 'charts'
	| 'fonts'
	| 'base'
	| 'alerts'
	| 'legacy';

export interface TokenReferenceProps {
	groups?: SemanticTokenGroup[];
	mode?: 'semantic' | 'primitive' | 'all';
	showThemeToggle?: boolean;
	showSearch?: boolean;
	showCategoryFilter?: boolean;
	showModeTabs?: boolean;
	showHeader?: boolean;
	title?: string;
	description?: string;
}

interface TokenWithMetadata {
	value: string;
	description?: string;
	usage?: string;
	dontUse?: string;
	category?: string;
	group?: string;
}

type TokenValue = string | TokenWithMetadata;

function getTokenValue(token: TokenValue): string {
	return typeof token === 'string' ? token : token.value;
}

function getTokenMetadata(token: TokenValue): Omit<TokenWithMetadata, 'value'> {
	if (typeof token === 'string') {
		return {};
	}
	const { value: _, ...metadata } = token;
	return metadata;
}

function parseSemanticTokens(mode: ThemeMode): TokenData[] {
	const themeTokens = semanticTokens.default?.[mode]?.tokens;
	if (!themeTokens) return [];

	return Object.entries(themeTokens).map(([name, token]) => ({
		name,
		value: getTokenValue(token as TokenValue),
		...getTokenMetadata(token as TokenValue),
	}));
}

interface ColorShade {
	value: string;
	type: string;
	description?: string;
}

function parsePrimitiveColors(): TokenData[] {
	const tokens: TokenData[] = [];
	const bg = colorTokens.bg as Record<string, Record<string, ColorShade>>;

	for (const [colorName, shades] of Object.entries(bg)) {
		for (const [shadeName, shadeData] of Object.entries(shades)) {
			tokens.push({
				name: `bg-${colorName.toLowerCase()}-${shadeName}`,
				value: shadeData.value,
				description: shadeData.description || `${colorName} ${shadeName}`,
				category: 'background',
				group: colorName.toLowerCase(),
			});
		}
	}

	return tokens;
}

const GROUPS_ORDER: SemanticTokenGroup[] = [
	'surface-levels',
	'actions',
	'callouts',
	'accents',
	'sidebar',
	'charts',
	'fonts',
	'base',
	'alerts',
	'legacy',
];

function groupTokensByGroup(tokens: TokenData[]): Map<string, TokenData[]> {
	const grouped = new Map<string, TokenData[]>();

	for (const token of tokens) {
		const group = token.group || 'other';
		if (!grouped.has(group)) {
			grouped.set(group, []);
		}
		grouped.get(group)!.push(token);
	}

	const sortedGroups = new Map<string, TokenData[]>();
	for (const group of GROUPS_ORDER) {
		if (grouped.has(group)) {
			sortedGroups.set(group, grouped.get(group)!);
		}
	}
	for (const [group, tokens] of grouped) {
		if (!sortedGroups.has(group)) {
			sortedGroups.set(group, tokens);
		}
	}

	return sortedGroups;
}

export const GROUP_LABELS: Record<string, string> = {
	'surface-levels': 'Surface Levels (L1, L2, L3)',
	actions: 'Action Colors (Primary, Secondary, Success, Warning, Danger)',
	callouts: 'Callout Components',
	accents: 'Accent Colors',
	sidebar: 'Sidebar',
	charts: 'Chart Colors',
	fonts: 'Typography',
	base: 'Base Colors',
	alerts: 'Alerts',
	legacy: 'Legacy Tokens',
};

export const GROUP_DESCRIPTIONS: Record<string, string> = {
	'surface-levels':
		'Hierarchical background, foreground, and border colors for layered UI surfaces.',
	actions: 'Colors for interactive elements like buttons, links, and form controls.',
	callouts: 'Styled containers for informational, success, warning, and error messages.',
	accents: 'Brand and semantic accent colors for highlights and data visualization.',
	sidebar: 'Tokens specific to sidebar navigation components.',
	charts: 'Color palette optimized for data visualization and charts.',
	fonts: 'Typography font family definitions.',
	base: 'Fundamental black and white base colors.',
	alerts: 'Alert strip and notification styling tokens.',
	legacy: 'Deprecated tokens maintained for backward compatibility. Migrate to semantic tokens.',
};

export function TokenReference({
	groups,
	mode = 'all',
	showThemeToggle = true,
	showSearch = true,
	showCategoryFilter = true,
	showModeTabs = true,
	showHeader = false,
	title = 'Token Reference',
	description = 'Design tokens for building consistent UI',
}: TokenReferenceProps) {
	const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [activeSection, setActiveSection] = useState<'semantic' | 'primitive'>(
		mode === 'primitive' ? 'primitive' : 'semantic'
	);

	const semanticTokensData = useMemo(() => parseSemanticTokens(themeMode), [themeMode]);

	const primitiveTokensData = useMemo(() => parsePrimitiveColors(), []);

	const filteredByGroups = useMemo(() => {
		if (!groups || groups.length === 0) {
			return semanticTokensData;
		}
		return semanticTokensData.filter(
			(token) => token.group && groups.includes(token.group as SemanticTokenGroup)
		);
	}, [semanticTokensData, groups]);

	const categories = useMemo(() => {
		const tokensToCheck = groups ? filteredByGroups : semanticTokensData;
		const cats = new Set<string>();
		for (const token of tokensToCheck) {
			if (token.category) cats.add(token.category);
		}
		return Array.from(cats).sort();
	}, [filteredByGroups, semanticTokensData, groups]);

	const shouldShowSemantic = mode === 'all' || mode === 'semantic';
	const shouldShowPrimitive = mode === 'all' || mode === 'primitive';
	const effectiveActiveSection =
		mode === 'semantic' ? 'semantic' : mode === 'primitive' ? 'primitive' : activeSection;

	const filteredTokens = useMemo(() => {
		const baseTokens =
			effectiveActiveSection === 'semantic' ? filteredByGroups : primitiveTokensData;

		return baseTokens.filter((token) => {
			const matchesSearch =
				!searchQuery ||
				token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				token.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				token.value.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory = !selectedCategory || token.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [
		effectiveActiveSection,
		filteredByGroups,
		primitiveTokensData,
		searchQuery,
		selectedCategory,
	]);

	const groupedTokens = useMemo(() => groupTokensByGroup(filteredTokens), [filteredTokens]);

	const showTabs = showModeTabs && mode === 'all';

	return (
		<div className="min-h-screen bg-l1-background p-6 pt-0">
			<div className="max-w-7xl mx-auto space-y-6">
				{showHeader && (
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-l1-foreground">{title}</h1>
							<p className="text-sm text-l2-foreground mt-1">{description}</p>
						</div>
					</div>
				)}

				{showTabs && (
					<div className="flex gap-2 border-b border-l2-border">
						{shouldShowSemantic && (
							<Button
								onClick={() => {
									setActiveSection('semantic');
									setSelectedCategory(null);
								}}
								variant={activeSection === 'semantic' ? 'solid' : 'link'}
								color={activeSection === 'semantic' ? 'primary' : 'secondary'}
							>
								Semantic Tokens
							</Button>
						)}
						{shouldShowPrimitive && (
							<Button
								type="button"
								onClick={() => {
									setActiveSection('primitive');
									setSelectedCategory(null);
								}}
								variant={activeSection === 'primitive' ? 'solid' : 'ghost'}
								color={activeSection === 'primitive' ? 'primary' : 'secondary'}
							>
								Primitive Colors
							</Button>
						)}
					</div>
				)}

				{showSearch && (
					<TokenSearch
						onSearch={setSearchQuery}
						onCategoryFilter={showCategoryFilter ? setSelectedCategory : undefined}
						categories={showCategoryFilter ? categories : []}
						selectedCategory={selectedCategory}
					/>
				)}

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm text-l3-foreground">
						Showing {filteredTokens.length} tokens
						{searchQuery && ` matching "${searchQuery}"`}
						{selectedCategory && ` in ${selectedCategory}`}
					</div>

					{showThemeToggle && (
						<div className="flex items-center gap-4">
							<div className="flex rounded-lg border border-l2-border overflow-hidden">
								<Button
									type="button"
									onClick={() => setThemeMode('light')}
									variant={themeMode === 'light' ? 'solid' : 'ghost'}
									color={themeMode === 'light' ? 'primary' : 'secondary'}
								>
									Light
								</Button>
								<Button
									type="button"
									onClick={() => setThemeMode('dark')}
									variant={themeMode === 'dark' ? 'solid' : 'ghost'}
									color={themeMode === 'dark' ? 'primary' : 'secondary'}
								>
									Dark
								</Button>
							</div>
						</div>
					)}
				</div>

				<div className="space-y-6">
					{Array.from(groupedTokens.entries()).map(([group, tokens]) => (
						<TokenTable key={group} tokens={tokens} title={GROUP_LABELS[group] || group} />
					))}
				</div>
			</div>
		</div>
	);
}
