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
