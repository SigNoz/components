import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import { Button } from '../../button/button.js';
import type { ButtonBaseProps, TextButtonProps, ValidateButtonProps } from '../../button/types.js';

export type AlertStripButtonProps = Omit<ButtonBaseProps, 'size' | 'width' | 'maxWidth'> &
	Omit<TextButtonProps, 'icon' | 'suffix'>;

/**
 * The props the strip sets on the button, and `suffix`, which Figma does not draw. Rejected by
 * {@link ValidateAlertStripButtonProps} with a message of their own, so they are not reported as
 * unknown props.
 */
type AlertStripOwnedProps = 'variant' | 'color' | 'size' | 'suffix';

/**
 * Same shape as the rules of {@link ValidateButtonProps}: the single key is the sentence the
 * compiler prints when the rule fails.
 */
interface TheStripDrawsItsButton {
	'`AlertStrip.Button` takes its look from the strip, drop `variant`, `color` and `size`, and put the icon in `prefix`, not `suffix`': never;
}

/**
 * The rules of {@link ValidateButtonProps}, plus `variant`, `color`, `size` and `suffix`, which
 * belong to the strip. Resolves to `unknown` while the props are valid.
 */
export type ValidateAlertStripButtonProps<T> = ValidateButtonProps<T> &
	(Extract<keyof T, AlertStripOwnedProps> extends never ? unknown : TheStripDrawsItsButton);

/**
 * An action the user can take about the message, for the `suffix` of a strip, or inside its
 * `children`. Reached as `AlertStrip.Button`, not imported on its own.
 *
 * It is a `Button` with `size="sm"` that the strip paints the same way on every `color`, so it
 * never drifts from the strip. It takes every other prop of `Button`, `disabled`, `loading` and
 * their tooltips included. There is no `variant`, `color`, `size`, `suffix`, `className` or
 * `style`.
 *
 * The `prefix` icon inherits the color of the label through `currentColor`.
 *
 * ### Asserting on it
 *
 * `data-slot="alert-strip-button"`, and `testId` as `data-testid`.
 *
 * @example
 * ```tsx
 * <AlertStrip
 *   color="danger"
 *   side="bottom"
 *   suffix={
 *     <AlertStrip.Button prefix={<CreditCard />} onClick={payBill}>
 *       Pay the bill
 *     </AlertStrip.Button>
 *   }
 * >
 *   Payment failed. Pay the bill to keep your workspace.
 * </AlertStrip>
 * ```
 */
const AlertStripButtonImpl = forwardRef<HTMLButtonElement, AlertStripButtonProps>(
	function AlertStripButton(
		{ suffix: _suffix, ...props }: AlertStripButtonProps & { suffix?: unknown },
		ref,
	) {
		// `Button` drops a `className` or `style` that gets past the types, and the props below win
		// over a `variant`, `color` or `size` that does. The strip paints the `secondary` button
		// through its custom properties.
		return (
			<Button
				{...props}
				ref={ref}
				data-slot="alert-strip-button"
				variant="solid"
				color="secondary"
				size="sm"
			/>
		);
	},
);
AlertStripButtonImpl.displayName = 'AlertStrip.Button';

export const AlertStripButton = AlertStripButtonImpl as <T extends AlertStripButtonProps>(
	props: T &
		ValidateAlertStripButtonProps<T> &
		// As on `Button`, `T` is inferred from the call site, so every key outside the props is pinned
		// to `never` to keep the excess property check. The strip props have their own rule.
		Record<
			Exclude<
				keyof T,
				keyof AlertStripButtonProps | AlertStripOwnedProps | keyof RefAttributes<HTMLButtonElement>
			>,
			never
		> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
