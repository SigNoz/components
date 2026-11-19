// #region css-tokens
/**
 * CSS Tokens for button-group
 * Prefix: `--button-group-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--button-group-display` | `inline-flex` |
 * | `--button-group-flex-direction` | `column` |
 * | `--button-group-gap-margin` | `var(--spacing-2)` |
 * | `--button-group-item-collapsed-inline-size` | `max-content` |
 * | `--button-group-item-collapsed-inset-block-start` | `0` |
 * | `--button-group-item-collapsed-inset-inline-start` | `0` |
 * | `--button-group-item-collapsed-pointer-events` | `none` |
 * | `--button-group-item-collapsed-position` | `absolute` |
 * | `--button-group-item-collapsed-visibility` | `hidden` |
 * | `--button-group-item-flex` | `0 0 auto` |
 * | `--button-group-item-focus-z-index` | `2` |
 * | `--button-group-item-max-width` | `var(--button-internal-max-width, none)` |
 * | `--button-group-item-position` | `relative` |
 * | `--button-group-label-content` | `attr(data-label)` |
 * | `--button-group-label-max-inline-size` | `120px` |
 * | `--button-group-max-width` | `var(--button-group-internal-max-width, 100%)` |
 * | `--button-group-measure-display` | `flex` |
 * | `--button-group-measure-height` | `0` |
 * | `--button-group-measure-max-inline-size` | `100%` |
 * | `--button-group-measure-overflow` | `hidden` |
 * | `--button-group-measure-overflow-display` | `flex` |
 * | `--button-group-measure-overflow-inset-block-start` | `0` |
 * | `--button-group-measure-overflow-inset-inline-start` | `0` |
 * | `--button-group-measure-overflow-position` | `absolute` |
 * | `--button-group-measure-pointer-events` | `none` |
 * | `--button-group-measure-position` | `relative` |
 * | `--button-group-measure-visibility` | `hidden` |
 * | `--button-group-min-width` | `0` |
 * | `--button-group-row-align-items` | `center` |
 * | `--button-group-row-display` | `flex` |
 * | `--button-group-row-position` | `relative` |
 * | `--button-group-seam-margin` | `1px` |
 * | `--button-group-slot-align-items` | `center` |
 * | `--button-group-slot-display` | `flex` |
 * | `--button-group-slot-flex` | `0 0 auto` |
 * | `--button-group-vertical-align` | `middle` |
 * | `--button-group-wide-gap-margin` | `var(--spacing-4)` |
 * | `--button-group-width` | `var(--button-group-internal-width, auto)` |
 */
// #endregion css-tokens

export { ButtonGroup } from './button-group.js';
export {
	BUTTON_GROUP_EMPTY_LABEL,
	ButtonGroupColor,
	ButtonGroupSize,
	ButtonGroupTextOverflow,
	ButtonGroupVariant,
} from './constants.js';
export type {
	ButtonGroupActionItemType,
	ButtonGroupColorType,
	ButtonGroupIconItemType,
	ButtonGroupItemButtonProps,
	ButtonGroupItemDisabledType,
	ButtonGroupItemLoadingType,
	ButtonGroupItemMenuType,
	ButtonGroupItemType,
	ButtonGroupItemVariantType,
	ButtonGroupLinkItemType,
	ButtonGroupMenuItemType,
	ButtonGroupProps,
	ButtonGroupSizeType,
	ButtonGroupTextItemType,
	ButtonGroupTextOverflowType,
	ButtonGroupVariantColorType,
	ButtonGroupVariantType,
	ValidateButtonGroupProps,
} from './types.js';
