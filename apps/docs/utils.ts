import { colorTokens, spacingTokens, typographyTokens } from '@signozhq/design-tokens';

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

type TypographyToken = {
	value: string;
};

type TypographyTokens = {
	fontSize: Record<string, TypographyToken>;
	fontWeight: Record<string, TypographyToken>;
};

type TransformedTypography = {
	FONTSIZE: Record<string, string>;
	FONTWEIGHT: Record<string, string>;
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
		Object.entries(spacingTokens.padding).map(([key, { value }]) => [key, value])
	);
}

export const getTransformedSpacingTokens = () => transformSpacingTokens(spacingTokens);

/**
 * Transforms typography tokens into a structured format.
 * @param typographyTokens - The typography tokens object to transform.
 * @returns An object containing FONTSIZE and FONTWEIGHT records.
 */
/**
 * Retrieves and transforms spacing tokens.
 * @returns Transformed spacing tokens.
 */
/**
 * transformTypographyTokens
 * Input:
 * {
 *   fontSize: {
 *     small: { value: "12px" },
 *     medium: { value: "16px" }
 *   },
 *   fontWeight: {
 *     regular: { value: "400" },
 *     bold: { value: "700" }
 *   }
 * }
 *
 * Output:
 * {
 *   FONTSIZE: {
 *     SMALL: "12px",
 *     MEDIUM: "16px"
 *   },
 *   FONTWEIGHT: {
 *     REGULAR: "400",
 *     BOLD: "700"
 *   }
 * }
 */
function transformTypographyTokens(typographyTokens: TypographyTokens): TransformedTypography {
	// Helper function to transform a specific property
	const transformProperty = (property: 'fontSize' | 'fontWeight') =>
		Object.fromEntries(
			Object.entries(typographyTokens[property]).map(([key, { value }]) => [
				key.toUpperCase(),
				value,
			])
		);

	return {
		FONTSIZE: transformProperty('fontSize'),
		FONTWEIGHT: transformProperty('fontWeight'),
	};
}

/**
 * Retrieves and transforms typography tokens.
 * @returns Transformed typography tokens.
 */
export const getTransformedTypographyTokens = () => transformTypographyTokens(typographyTokens);
