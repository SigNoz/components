// #region css-tokens
/**
 * CSS Tokens for tabs
 * Prefix: `--tabs-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tabs-active-accent-color` | `var(--primary)` |
 * | `--tabs-active-slider-border-radius` | `2px` |
 * | `--tabs-active-slider-bottom` | `calc(var(--spacing-4, 8px) * -1)` |
 * | `--tabs-active-slider-height` | `2px` |
 * | `--tabs-active-slider-left` | `0` |
 * | `--tabs-active-slider-position` | `absolute` |
 * | `--tabs-active-slider-transition` | `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),   ...` |
 * | `--tabs-active-slider-will-change` | `transform, width, opacity` |
 * | `--tabs-active-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-bar-content-gap` | `var(--spacing-8, 16px)` |
 * | `--tabs-border-color` | `var(--l1-border)` |
 * | `--tabs-border-spacer-border-width` | `1px` |
 * | `--tabs-border-spacer-flex` | `0` |
 * | `--tabs-border-spacer-grow-flex-grow` | `1` |
 * | `--tabs-border-spacer-grow-flex-shrink` | `0` |
 * | `--tabs-border-spacer-min-width` | `var(--spacing-8, 16px)` |
 * | `--tabs-content-focus-visible-box-shadow` | `0 0 0 2px var(--ring),       0 0 0 4px var(--ri...` |
 * | `--tabs-content-focus-visible-outline` | `none` |
 * | `--tabs-content-margin` | `var(--spacing-4, 8px) 0px 0px 0px` |
 * | `--tabs-content-padding` | `var(--spacing-4, 8px)` |
 * | `--tabs-display` | `flex` |
 * | `--tabs-extra-content-align-items` | `center` |
 * | `--tabs-extra-content-display` | `flex` |
 * | `--tabs-extra-content-flex-shrink` | `0` |
 * | `--tabs-flex-direction` | `column` |
 * | `--tabs-gap` | `var(--spacing-4, 8px)` |
 * | `--tabs-hover-slider-bg` | `color-mix(in srgb, var(--l1-foreground) 10%, tr...` |
 * | `--tabs-hover-slider-border-radius` | `2px` |
 * | `--tabs-hover-slider-left` | `0` |
 * | `--tabs-hover-slider-position` | `absolute` |
 * | `--tabs-hover-slider-transition` | `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),   ...` |
 * | `--tabs-hover-slider-will-change` | `transform, width, opacity` |
 * | `--tabs-hover-slider-z-index` | `0` |
 * | `--tabs-hover-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-icon-flex-shrink` | `0` |
 * | `--tabs-list-inner-align-items` | `flex-start` |
 * | `--tabs-list-inner-display` | `inline-flex` |
 * | `--tabs-list-inner-position` | `relative` |
 * | `--tabs-list-primary-align-items` | `center` |
 * | `--tabs-list-primary-display` | `inline-flex` |
 * | `--tabs-list-primary-gap` | `var(--spacing-12, 24px)` |
 * | `--tabs-list-secondary-display` | `flex` |
 * | `--tabs-list-wrapper-primary-align-items` | `center` |
 * | `--tabs-list-wrapper-primary-display` | `inline-flex` |
 * | `--tabs-list-wrapper-primary-extra-content-display` | `flex` |
 * | `--tabs-list-wrapper-primary-text-align` | `left` |
 * | `--tabs-list-wrapper-secondary-display` | `flex` |
 * | `--tabs-list-wrapper-secondary-padding-left` | `var(--spacing-8, 16px)` |
 * | `--tabs-list-wrapper-secondary-width` | `100%` |
 * | `--tabs-text-color` | `var(--l1-foreground)` |
 * | `--tabs-trigger-background-color` | `transparent` |
 * | `--tabs-trigger-border` | `none` |
 * | `--tabs-trigger-cursor` | `pointer` |
 * | `--tabs-trigger-primary-align-items` | `center` |
 * | `--tabs-trigger-primary-border-radius` | `2px` |
 * | `--tabs-trigger-primary-disabled-color` | `color-mix(in srgb, var(--tabs-text-color, var(-...` |
 * | `--tabs-trigger-primary-disabled-cursor` | `not-allowed` |
 * | `--tabs-trigger-primary-display` | `inline-flex` |
 * | `--tabs-trigger-primary-focus-visible-outline` | `var(--ring) solid 2px` |
 * | `--tabs-trigger-primary-focus-visible-outline-offset` | `2px` |
 * | `--tabs-trigger-primary-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--tabs-trigger-primary-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--tabs-trigger-primary-gap` | `var(--spacing-4, 8px)` |
 * | `--tabs-trigger-primary-line-height` | `20px` |
 * | `--tabs-trigger-primary-padding` | `var(--spacing-2, 4px) var(--spacing-3, 6px)` |
 * | `--tabs-trigger-primary-position` | `relative` |
 * | `--tabs-trigger-primary-white-space` | `nowrap` |
 * | `--tabs-trigger-primary-z-index` | `10` |
 * | `--tabs-trigger-secondary-active-bg` | `transparent` |
 * | `--tabs-trigger-secondary-active-border-bottom-color` | `transparent` |
 * | `--tabs-trigger-secondary-align-items` | `center` |
 * | `--tabs-trigger-secondary-bg` | `var(--l2-background)` |
 * | `--tabs-trigger-secondary-border-color` | `var(--l1-border)` |
 * | `--tabs-trigger-secondary-border-radius` | `4px` |
 * | `--tabs-trigger-secondary-border-right-width` | `0px` |
 * | `--tabs-trigger-secondary-border-style` | `solid` |
 * | `--tabs-trigger-secondary-border-width` | `1px` |
 * | `--tabs-trigger-secondary-cursor` | `pointer` |
 * | `--tabs-trigger-secondary-disabled-child-position` | `relative` |
 * | `--tabs-trigger-secondary-disabled-child-z-index` | `2` |
 * | `--tabs-trigger-secondary-disabled-color` | `color-mix(in srgb, var(--tabs-text-color, var(-...` |
 * | `--tabs-trigger-secondary-disabled-cursor` | `not-allowed` |
 * | `--tabs-trigger-secondary-disabled-position` | `relative` |
 * | `--tabs-trigger-secondary-disabled-stripe-after-mask-image` | `linear-gradient(to right, transparent 0%, black...` |
 * | `--tabs-trigger-secondary-disabled-stripe-after-right` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-background-image` | `repeating-linear-gradient(             -45deg, ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-before-left` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-before-mask-image` | `linear-gradient(to left, transparent 0%, black ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-bottom` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-content` | `""` |
 * | `--tabs-trigger-secondary-disabled-stripe-height` | `100%` |
 * | `--tabs-trigger-secondary-disabled-stripe-position` | `absolute` |
 * | `--tabs-trigger-secondary-disabled-stripe-top` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-width` | `25px` |
 * | `--tabs-trigger-secondary-disabled-stripe-z-index` | `1` |
 * | `--tabs-trigger-secondary-disabled-z-index` | `0` |
 * | `--tabs-trigger-secondary-display` | `inline-flex` |
 * | `--tabs-trigger-secondary-flex` | `0` |
 * | `--tabs-trigger-secondary-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--tabs-trigger-secondary-gap` | `var(--spacing-2, 4px)` |
 * | `--tabs-trigger-secondary-height` | `100%` |
 * | `--tabs-trigger-secondary-icon-flex-shrink` | `0` |
 * | `--tabs-trigger-secondary-icon-height` | `16px` |
 * | `--tabs-trigger-secondary-icon-width` | `16px` |
 * | `--tabs-trigger-secondary-justify-content` | `center` |
 * | `--tabs-trigger-secondary-last-border-right-width` | `var(--tabs-trigger-secondary-border-width, 1px)` |
 * | `--tabs-trigger-secondary-padding` | `var(--spacing-2, 4px) var(--spacing-10, 20px)` |
 * | `--tabs-trigger-secondary-transition` | `color 150ms ease` |
 * | `--tabs-trigger-secondary-white-space` | `nowrap` |
 */
// #endregion css-tokens

export {
	type TabItemProps,
	Tabs,
	type TabsAlignment,
	TabsContent,
	type TabsContentProps,
	TabsList,
	type TabsListProps,
	type TabsProps,
	TabsRoot,
	type TabsRootProps,
	TabsTrigger,
	type TabsTriggerProps,
	type TabVariants,
} from './tabs.js';
