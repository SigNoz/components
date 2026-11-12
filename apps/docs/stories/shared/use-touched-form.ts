import { type ChangeEvent, type FormEvent, useRef, useState } from 'react';

type Errors<Values> = Partial<Record<keyof Values, string>>;

/**
 * Plain React state with the validation timing `Form` documents, so the stories need no form
 * library: a field validates when it loses focus, again on every change once it has been left, and
 * every field validates on submit. This is what react-hook-form calls `mode: 'onTouched'`.
 *
 * `bind(name)` spreads onto a field the way `register(name)` does, `handleSubmit` wraps the save
 * the way react-hook-form's does, and `reset` is for `onReset`.
 */
export function useTouchedForm<Values extends Record<string, string>>(
	initial: Values,
	validate: (values: Values) => Errors<Values>,
) {
	const names = Object.keys(initial) as (keyof Values & string)[];
	const [values, setValues] = useState(initial);
	const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
	const elements = useRef<Partial<Record<keyof Values, HTMLInputElement | null>>>({});
	const errors = validate(values);

	function bind(name: keyof Values & string) {
		return {
			name,
			value: values[name],
			error: touched[name] ? errors[name] : undefined,
			ref: (node: HTMLInputElement | null) => {
				elements.current[name] = node;
			},
			onChange: (event: ChangeEvent<HTMLInputElement>) => {
				const { value } = event.target;
				setValues((current) => ({ ...current, [name]: value }));
			},
			onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
		};
	}

	function handleSubmit(save: (values: Values) => void) {
		return (_event: FormEvent<HTMLFormElement>) => {
			setTouched(
				Object.fromEntries(names.map((name) => [name, true])) as Record<keyof Values, boolean>,
			);

			const firstInvalid = names.find((name) => errors[name] !== undefined);

			if (firstInvalid !== undefined) {
				elements.current[firstInvalid]?.focus();
				return;
			}

			save(values);
		};
	}

	function reset(next: Values = initial) {
		setValues(next);
		setTouched({});
	}

	return { values, bind, handleSubmit, reset };
}
