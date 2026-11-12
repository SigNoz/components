import { createContext, type RefCallback, useContext } from 'react';

/**
 * What a `Field` or a `Field.Group` hands the control inside it. The control reads these as
 * defaults: its own props win, so a control that names its own `id` or `status` keeps them.
 *
 * Lives in `lib` so `Field` and every control that can sit inside one share it without importing
 * each other.
 *
 * @access private
 */
export type FieldContextValue = {
	/**
	 * `field` for a `Field`, which holds one control, and `group` for a `Field.Group`, which holds
	 * several and names them with its legend.
	 */
	kind: 'field' | 'group';
	/**
	 * The id the control takes so the field's `<label for>` reaches it. `undefined` inside a
	 * group, which has no single control to point at.
	 */
	controlId: string | undefined;
	/**
	 * The id of the `<label>` or the `<legend>`, for a control whose element is not labelable, or
	 * that is a group itself.
	 */
	labelId: string;
	/**
	 * The ids the control adds to `aria-describedby`, in order: the description or the message that
	 * shows, then the `labelTooltip` text. `undefined` while there is neither.
	 */
	describedBy: string | undefined;
	status: 'success' | 'warning' | 'danger' | undefined;
	/**
	 * Read as `aria-required`, never the native `required`, so the form's own validation stays the
	 * only one. A control's own `required` prop still sets the native one.
	 */
	required: boolean;
	/**
	 * A control that renders a native element calls this with the id it ends up with, so the
	 * `<label for>` points at it. `undefined` when it unmounts. The Base UI controls register with
	 * Base UI's own field instead, and never call it.
	 */
	claimControl: (id: string | undefined) => void;
	/**
	 * Set by a field shorthand over a control that is several elements, a radio group, a slider, a
	 * bar of buttons, whose root is a `<div>` that `focus()` does nothing on. The shorthand's `ref`
	 * reaches this callback instead of the control's `ref`, and the control calls it with the
	 * element whose `focus()` puts the focus on the control, which is how a form library focuses
	 * the first invalid field. `undefined` everywhere else, so a control used by hand keeps its
	 * `ref` on its root.
	 */
	focusTarget?: RefCallback<HTMLElement>;
};

/**
 * @access private
 */
export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * The surrounding `Field` or `Field.Group`, or `null` outside one.
 *
 * @access private
 */
export function useFieldContext(): FieldContextValue | null {
	return useContext(FieldContext);
}

/**
 * `data-invalid` while the field is in `danger`, for a control Base UI does not mark invalid itself:
 * one in a `Field.Group`, which has no Base UI field, or a plain `<div>`, which takes no
 * `aria-invalid`. `undefined` otherwise, so the spread leaves what Base UI sets alone.
 *
 * @access private
 */
export function fieldInvalidDataProps(
	field: FieldContextValue | null,
): { 'data-invalid': '' } | undefined {
	return field?.status === 'danger' ? { 'data-invalid': '' } : undefined;
}
