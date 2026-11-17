import { type ReactElement, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../lib/use-isomorphic-layout-effect.js';
import styles from '../date-picker.module.scss';

/**
 * @access private
 */
export type DatePickerHiddenInputProps = {
	trigger: HTMLElement | null;
	name: string | undefined;
	form: string | undefined;
	value: string;
	timezone: string | undefined;
	showTimezone: boolean;
	required: boolean;
	disabled: boolean;
	onReset: () => void;
};

/**
 * The inputs the date picker submits with its form, and the one the browser checks `required`
 * against.
 *
 * Not `type="hidden"`: a hidden input takes no part in the form's validation. It sits under the
 * trigger, out of reach of the pointer and the keyboard, so the browser's message points at the
 * trigger, and the focus the browser gives it on a failed submit goes on to the trigger.
 *
 * @access private
 */
export function DatePickerHiddenInput({
	trigger,
	name,
	form,
	value,
	timezone,
	showTimezone,
	required,
	disabled,
	onReset,
}: DatePickerHiddenInputProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);
	const onResetRef = useRef(onReset);

	useIsomorphicLayoutEffect(() => {
		onResetRef.current = onReset;
	});

	useEffect(() => {
		const input = inputRef.current;

		if (input == null) {
			return undefined;
		}

		// Heard on the root, and matched against the form the input belongs to when the reset
		// happens: a form named by `form` can mount after the date picker, or be swapped for another
		// one with the same id, and neither changes a prop this effect could follow. `reset` bubbles,
		// and capture keeps a form that stops it from hiding it.
		const root = input.getRootNode();
		let pending: ReturnType<typeof setTimeout> | undefined;

		// This listener runs before React's `onReset` on the form, which can still cancel the reset,
		// so the reset is read once the event is over. A microtask would run between two listeners of
		// a reset the browser dispatches, before React's.
		function handleReset(event: Event): void {
			if (input?.form == null || event.target !== input.form) {
				return;
			}

			pending = setTimeout(() => {
				if (!event.defaultPrevented) {
					onResetRef.current();
				}
			});
		}

		root.addEventListener('reset', handleReset, true);

		return () => {
			root.removeEventListener('reset', handleReset, true);
			clearTimeout(pending);
		};
	}, []);

	return (
		<>
			<input
				ref={inputRef}
				type="text"
				aria-hidden
				tabIndex={-1}
				name={name}
				form={form}
				value={value}
				required={required}
				disabled={disabled}
				data-slot="date-picker-input"
				className={styles['date-picker__input']}
				onChange={() => undefined}
				onFocus={() => trigger?.focus()}
			/>
			{showTimezone && name !== undefined && (
				<input
					type="hidden"
					name={`${name}-timezone`}
					form={form}
					value={timezone ?? ''}
					disabled={disabled}
				/>
			)}
		</>
	);
}
