// #region css-tokens
/**
 * CSS Tokens for typography
 * Prefix: `--typography-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--typography-code-background` | `var(--l3-background)` |
 * | `--typography-code-border` | `1px solid var(--l3-border)` |
 * | `--typography-code-font-family` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Co...` |
 * | `--typography-code-font-size` | `0.9em` |
 * | `--typography-code-padding` | `0.125em 0.25em` |
 * | `--typography-code-radius` | `var(--radius-sm)` |
 * | `--typography-color` | `var(--typography-interactive-hover-color, var(-...` |
 * | `--typography-copy-align-items` | `center` |
 * | `--typography-copy-bg` | `transparent` |
 * | `--typography-copy-border` | `none` |
 * | `--typography-copy-cursor` | `pointer` |
 * | `--typography-copy-display` | `inline-flex` |
 * | `--typography-copy-hover-color` | `var(--l2-foreground)` |
 * | `--typography-copy-icon-size` | `14px` |
 * | `--typography-copy-margin` | `0px 0px 0px var(--spacing-2, 8px)` |
 * | `--typography-copy-padding` | `var(--spacing-1, 4px)` |
 * | `--typography-copy-vertical-align` | `middle` |
 * | `--typography-font-family` | `inherit` |
 * | `--typography-font-size` | `var(--periscope-font-size-h5, 16px)` |
 * | `--typography-font-weight` | `var(--font-weight-semibold, 600)` |
 * | `--typography-interactive-hover-color` | `var(--primary-background)` |
 * | `--typography-line-clamp` | `1` |
 * | `--typography-line-height` | `var(--line-height-normal, 1.5)` |
 * | `--typography-margin` | `0` |
 * | `--typography-padding` | `0` |
 * | `--typography-text-align` | `right` |
 * | `--typography-text-display` | `inline` |
 * | `--typography-title-margin-bottom` | `9px` |
 * | `--typography-title-margin-top` | `9px` |
 */
// #endregion css-tokens

/**
 * A flexible typography component for rendering text with consistent styling.
 * Supports variants (title/text), semantic colors, truncation, and copy-to-clipboard.
 *
 * @example Basic text
 * ```tsx
 * <Typography>Default paragraph text</Typography>
 * ```
 *
 * @example Title with level
 * ```tsx
 * <Typography variant="title" level={1}>Page Heading</Typography>
 * <Typography variant="title" level={2}>Section Heading</Typography>
 * ```
 *
 * @example Using compound components
 * ```tsx
 * <Typography.Title level={1}>Main Title</Typography.Title>
 * <Typography.Text>Body text content</Typography.Text>
 * <Typography.Link href="/docs">Documentation</Typography.Link>
 * ```
 *
 * @example Text with styling props
 * ```tsx
 * <Typography size="lg" weight="semibold">Large semibold text</Typography>
 * <Typography color="muted">Secondary text</Typography>
 * <Typography color="danger">Error message</Typography>
 * <Typography strong>Bold text</Typography>
 * <Typography italic>Italic text</Typography>
 * ```
 *
 * @example Truncation
 * ```tsx
 * <Typography truncate={1}>Single line with ellipsis overflow...</Typography>
 * <Typography truncate={3}>Multi-line text that truncates after 3 lines...</Typography>
 * ```
 *
 * @example Code styling with copy
 * ```tsx
 * <Typography code copyable>npm install @signoz/ui</Typography>
 * ```
 *
 * @example Link styling
 * ```tsx
 * <Typography href="https://signoz.io" target="_blank" rel="noopener noreferrer">
 *   Visit SigNoz
 * </Typography>
 * ```
 *
 * @example Custom element
 * ```tsx
 * <Typography as="label" htmlFor="input-id">Form Label</Typography>
 * <Typography as="span">Inline text</Typography>
 * ```
 */

export type * from './typography.js';
export { Typography } from './typography.js';
