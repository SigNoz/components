import { forwardRef, useEffect, type ReactElement, type RefAttributes } from 'react';
import { Button } from '../../button/button.js';
import type { ButtonBaseProps, TextButtonProps, ValidateButtonProps } from '../../button/types.js';
import { useCalloutColor } from '../callout-context.js';

export type CalloutButtonProps = Omit<ButtonBaseProps, 'size' | 'width' | 'maxWidth'> &
	Omit<TextButtonProps, 'icon'>;

/**
 * The props the callout sets on the button. Rejected by {@link ValidateCalloutButtonProps} with
 * a message of their own, so they are not reported as unknown props.
 */
type CalloutOwnedProps = 'variant' | 'color' | 'size';

/**
 * Same shape as the rules of {@link ValidateButtonProps}: the single key is the sentence the
 * compiler prints when the rule fails.
 */
interface TheCalloutPicksTheLookOfItsButton {
	'`Callout.Button` is a solid `sm` button in the color of the callout around it, drop `variant`, `color` and `size`': never;
}

/**
 * The rules of {@link ValidateButtonProps}, plus `variant`, `color` and `size`, which belong to the
 * callout. Resolves to `unknown` while the props are valid.
 */
export type ValidateCalloutButtonProps<T> = ValidateButtonProps<T> &
	(Extract<keyof T, CalloutOwnedProps> extends never ? unknown : TheCalloutPicksTheLookOfItsButton);

/**
 * A solid button in the color of the callout around it, for the `action` of `Callout.Action`.
 * Reached as `Callout.Button`, not imported on its own.
 *
 * It is a `Button` with `variant="solid"`, the `color` of the callout and `size="sm"`, which fits
 * the first line of both callout sizes. It takes every other prop of `Button`. There is no
 * `variant`, `color`, `size`, `className` or `style`: the button takes its look from the callout.
 *
 * A button outside a callout is a bug: it renders as `secondary` and warns on the console.
 *
 * ### Asserting on it
 *
 * `data-slot="callout-button"`, and `testId` as `data-testid`.
 *
 * @example
 * ```tsx
 * <Callout.Action
 *   color="warning"
 *   size="sm"
 *   icon={<SolidAlertTriangle />}
 *   action={<Callout.Button onClick={refetch}>Refresh</Callout.Button>}
 * >
 *   New data is available.
 * </Callout.Action>
 * ```
 */
const CalloutButtonImpl = forwardRef<HTMLButtonElement, CalloutButtonProps>(
	function CalloutButton(props, ref) {
		const color = useCalloutColor();

		useEffect(() => {
			if (color === undefined) {
				console.warn('Callout.Button needs a callout around it, it takes its color from it.');
			}
		}, [color]);

		// `Button` drops a `className` or `style` that gets past the types, and the props below win
		// over a `variant`, `color` or `size` that does.
		return (
			<Button
				{...props}
				ref={ref}
				data-slot="callout-button"
				variant="solid"
				color={color ?? 'secondary'}
				size="sm"
			/>
		);
	},
);
CalloutButtonImpl.displayName = 'Callout.Button';

export const CalloutButton = CalloutButtonImpl as <T extends CalloutButtonProps>(
	props: T &
		ValidateCalloutButtonProps<T> &
		// As on `Button`, `T` is inferred from the call site, so every key outside the props is pinned
		// to `never` to keep the excess property check. The callout props have their own rule.
		Record<
			Exclude<
				keyof T,
				keyof CalloutButtonProps | CalloutOwnedProps | keyof RefAttributes<HTMLButtonElement>
			>,
			never
		> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
