import { Color } from '@signozhq/design-tokens';
import type { Theme } from './ThemeContext.jsx';

export const ThemeColors = {
	light: {
		BG_COLOR: Color.BG_INK_300,
		BG_COLOR_ALT: Color.BG_INK_400,
		BG_COLOR_DEEP: Color.BG_INK_500,
		TEXT_COLOR: Color.TEXT_VANILLA_100,
		TEXT_COLOR_MUTED: Color.TEXT_VANILLA_400,
		BORDER_COLOR: Color.BG_SLATE_400,
		BORDER_COLOR_ALT: Color.BG_SLATE_500,
	},
	dark: {
		BG_COLOR: Color.BG_VANILLA_100,
		BG_COLOR_ALT: Color.BG_VANILLA_200,
		BG_COLOR_DEEP: Color.BG_VANILLA_300,
		TEXT_COLOR: Color.TEXT_INK_400,
		TEXT_COLOR_MUTED: Color.TEXT_INK_300,
		BORDER_COLOR: Color.BG_VANILLA_300,
		BORDER_COLOR_ALT: Color.BG_VANILLA_400,
	},
};

export const getCSSVariables = (theme: Theme): string => {
	const themeColors = ThemeColors[theme as keyof typeof ThemeColors];
	return Object.entries(themeColors)
		.map(([key, value]) => `--${key.toLowerCase().replace(/_/g, '-')}: ${value};`)
		.join('\n');
};

export type ColorKey = keyof typeof ThemeColors.light;
