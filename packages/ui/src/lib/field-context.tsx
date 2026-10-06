import { createContext, useContext } from 'react';

/**
 * What a `Field` hands the one control inside it. The control reads these as defaults: its own
 * props win, so a control that names its own `id` or `status` keeps them.
 *
 * Lives in `lib` so `Field` and every control that can sit inside one share it without importing
 * each other.
 *
 * @access private
 */
export type FieldContextValue = {
	/**
	 * The id the control takes so the field's `<label htmlFor>` reaches it.
	 */
	controlId: string;
	/**
	 * The id of the rendered message row, for the control's `aria-describedby`. `undefined` while
	 * the field shows no message.
	 */
	messageId: string | undefined;
	status: 'success' | 'warning' | 'danger' | undefined;
	size: 'base' | 'large';
	required: boolean;
};

/**
 * @access private
 */
export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * The surrounding `Field`, or `null` outside one.
 *
 * @access private
 */
export function useFieldContext(): FieldContextValue | null {
	return useContext(FieldContext);
}
