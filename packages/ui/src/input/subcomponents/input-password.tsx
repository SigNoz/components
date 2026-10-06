import { Eye, EyeOff } from '@signozhq/icons';
import { forwardRef, useState } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../input.module.scss';
import type { InputPasswordProps } from '../types.js';
import { InputBase } from './input-base.js';

/**
 * A password field with a visibility toggle at its trailing edge. Reached as `Input.Password`, not
 * imported on its own.
 *
 * The toggle owns the suffix slot, so there is no `suffix` prop, and no `type`: the toggle is what
 * switches it between `password` and `text`. Everything else is `Input`.
 *
 * The toggle is out of the tab order: the eye is a pointer affordance, and keyboard users would
 * otherwise meet an extra stop after every password field.
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `input-password-toggle` | always, disabled with the field | `${testId}-toggle` |
 *
 * @example
 * ```tsx
 * <Input.Password placeholder="Enter password" autoComplete="current-password" />
 * ```
 */
export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
	function InputPassword({ disabled, readOnly, testId, ...props }, ref) {
		const [visible, setVisible] = useState(false);
		const isDisabled = (disabled ?? false) && !(readOnly ?? false);

		return (
			<InputBase
				{...props}
				ref={ref}
				disabled={disabled}
				readOnly={readOnly}
				testId={testId}
				member="password"
				type={visible ? 'text' : 'password'}
				suffix={
					<button
						type="button"
						className={styles['input__password-toggle']}
						data-slot="input-password-toggle"
						data-testid={partTestId(testId, 'toggle')}
						onClick={() => setVisible((previous) => !previous)}
						aria-label={visible ? 'Hide password' : 'Show password'}
						tabIndex={-1}
						disabled={isDisabled}
					>
						{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
					</button>
				}
			/>
		);
	},
);

InputPassword.displayName = 'Input.Password';
