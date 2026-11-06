import { colorTokens, spacingTokens } from '@signozhq/design-tokens';

// Extracted types
type ColorToken = {
	value: string;
	type: string;
};

type ColorTokens = Record<string, Record<string, ColorToken>>;

type TransformedColor = {
	name: string;
	shades: { name: string; value: string }[];
};

type SpacingToken = {
	value: string;
};

type SpacingTokens = {
	padding: Record<string, SpacingToken>;
};

/**
 * Transforms color tokens into a structured format.
 * @param colorTokens - The color tokens object to transform.
 * @returns An array of color objects with name and shades.
 */
/**
 * transformColorTokens
 * Input:
 * {
 *   primary: {
 *     100: { value: "#E6F7FF", type: "color" },
 *     200: { value: "#BAE7FF", type: "color" }
 *   }
 * }
 *
 * Output:
 * [
 *   {
 *     name: "primary",
 *     shades: [
 *       { name: "100", value: "#E6F7FF" },
 *       { name: "200", value: "#BAE7FF" }
 *     ]
 *   }
 * ]
 */
function transformColorTokens(colorTokens: ColorTokens): TransformedColor[] {
	return Object.entries(colorTokens).map(([colorName, shades]) => ({
		name: colorName,
		shades: Object.entries(shades).map(([shadeName, shadeInfo]) => ({
			name: shadeName,
			value: shadeInfo.value,
		})),
	}));
}

/**
 * Retrieves and transforms color tokens.
 * @returns Transformed color tokens.
 */
export const getTransformedColorTokens = () => transformColorTokens(colorTokens.bg);

/**
 * Transforms spacing tokens into a simplified format.
 * @param spacingTokens - The spacing tokens object to transform.
 * @returns A record of spacing keys and their values.
 */
/**
 * transformSpacingTokens
 * Input:
 * {
 *   padding: {
 *     small: { value: "4px" },
 *     medium: { value: "8px" }
 *   }
 * }
 *
 * Output:
 * {
 *   small: "4px",
 *   medium: "8px"
 * }
 */
function transformSpacingTokens(spacingTokens: SpacingTokens): Record<string, string> {
	return Object.fromEntries(
		Object.entries(spacingTokens.padding).map(([key, { value }]) => [key, value]),
	);
}

export const getTransformedSpacingTokens = () => transformSpacingTokens(spacingTokens);
