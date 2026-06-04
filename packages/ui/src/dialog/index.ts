// #region css-tokens
/**
 * CSS Tokens for dialog
 * Prefix: `--dialog-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--dialog-close-button-size` | `2rem` |
 * | `--dialog-description-color` | `var(--l2-foreground)` |
 * | `--dialog-description-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dialog-description-margin` | `0px` |
 * | `--dialog-description-padding` | `var(--spacing-8, 1rem)` |
 * | `--dialog-footer-border-color` | `var(--border)` |
 * | `--dialog-footer-border-style` | `solid` |
 * | `--dialog-footer-border-width` | `1px 0px 0px 0px` |
 * | `--dialog-footer-flex-direction` | `column-reverse` |
 * | `--dialog-footer-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--dialog-footer-padding` | `var(--spacing-6, .75rem) var(--spacing-8, 1rem)...` |
 * | `--dialog-header-border-color` | `var(--l2-border)` |
 * | `--dialog-header-border-style` | `solid` |
 * | `--dialog-header-border-width` | `0px 0px 1px 0px` |
 * | `--dialog-header-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--dialog-header-padding` | `var(--spacing-8, 1rem)` |
 * | `--dialog-subtitle-color` | `var(--l2-foreground)` |
 * | `--dialog-subtitle-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dialog-subtitle-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--dialog-subtitle-line-height` | `100%` |
 * | `--dialog-subtitle-margin` | `0` |
 * | `--dialog-subtitle-padding` | `0` |
 * | `--dialog-title-color` | `var(--l1-foreground)` |
 * | `--dialog-title-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dialog-title-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--dialog-title-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--dialog-title-line-height` | `100%` |
 * | `--dialog-title-margin` | `0` |
 */
// #endregion css-tokens

export { ConfirmDialog, type ConfirmDialogProps } from './presets/confirm-dialog.js';
export { ConfirmDialogUrl, type ConfirmDialogUrlProps } from './presets/confirm-dialog-url.js';
export { DialogWrapper, type DialogWrapperProps } from './presets/dialog-wrapper.js';
export { Dialog, type DialogProps } from './subcomponents/dialog.js';
export { DialogClose, type DialogCloseProps } from './subcomponents/dialog-close.js';
export {
	DialogCloseButton,
	type DialogCloseButtonProps,
} from './subcomponents/dialog-close-button.js';
export {
	DialogContent,
	type DialogContentProps,
	type DialogHeightMode,
	type DialogPosition,
	DialogPositionValue,
	type DialogSize,
} from './subcomponents/dialog-content.js';
export {
	DialogDescription,
	type DialogDescriptionProps,
} from './subcomponents/dialog-description.js';
export { DialogFooter, type DialogFooterProps } from './subcomponents/dialog-footer.js';
export { DialogHeader, type DialogHeaderProps } from './subcomponents/dialog-header.js';
export { DialogOverlay, type DialogOverlayProps } from './subcomponents/dialog-overlay.js';
export { DialogPortal, type DialogPortalProps } from './subcomponents/dialog-portal.js';
export { DialogSubtitle, type DialogSubtitleProps } from './subcomponents/dialog-subtitle.js';
export { DialogTitle, type DialogTitleProps } from './subcomponents/dialog-title.js';
export { DialogTrigger, type DialogTriggerProps } from './subcomponents/dialog-trigger.js';
