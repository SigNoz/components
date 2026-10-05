import { type RefCallback, useCallback, useId, useRef, useState } from 'react';

function findLabel(field: HTMLElement, id: string | undefined): HTMLLabelElement | null {
	if (field instanceof HTMLButtonElement) {
		return field.labels[0] ?? null;
	}

	// A `<div>` is not a labelable element, so the browser does not link a `<label for>` to it and
	// `labels` does not exist on it. The label is looked up by the `id` instead, in the document or
	// the shadow root the field lives in.
	if (id === undefined || id === '') {
		return null;
	}

	const root = field.getRootNode() as ParentNode;

	return root.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
}

/**
 * The id of the `<label>` that names a field, for a field whose name has to reach elements the
 * browser does not link to that label: a `<div>` trigger, and the popup of any trigger. Both carry
 * it in `aria-labelledby`. A label without an id gets one.
 *
 * A click on the label focuses a `<div>` field, which the browser only does for a labelable one.
 *
 * @access private
 */
export function useLabelFor(
	id: string | undefined,
): [labelId: string | undefined, fieldRef: RefCallback<HTMLElement>] {
	const generatedId = useId();
	const [labelId, setLabelId] = useState<string | undefined>(undefined);
	const removeListener = useRef<(() => void) | null>(null);

	const fieldRef = useCallback(
		(field: HTMLElement | null): void => {
			removeListener.current?.();
			removeListener.current = null;

			if (field === null) {
				return;
			}

			const label = findLabel(field, id);

			if (label === null) {
				setLabelId(undefined);
				return;
			}

			if (label.id === '') {
				label.id = `${generatedId}label`;
			}

			setLabelId(label.id);

			if (!(field instanceof HTMLButtonElement)) {
				const focusField = (): void => field.focus();

				label.addEventListener('click', focusField);
				removeListener.current = () => label.removeEventListener('click', focusField);
			}
		},
		[id, generatedId],
	);

	return [labelId, fieldRef];
}
