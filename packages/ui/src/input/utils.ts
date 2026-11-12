import type { AriaAttributes, ReactNode } from 'react';
import { useFieldContext } from '../lib/field-context.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { joinIdRefs } from '../lib/utils.js';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';
import type { InputStatusType } from './types.js';

/**
 * A props rest split between the two elements: `data-*` for the frame, everything else (the native
 * attributes and the remaining `aria-*`) for the control. The aria attributes the input resolves
 * against the surrounding `Field` are destructured away before the rest reaches this.
 *
 * @access private
 */
export function splitAttributes(props: Record<string, unknown>): {
	control: Record<string, unknown>;
	data: Record<string, unknown>;
} {
	const control: Record<string, unknown> = {};
	const data: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (key.startsWith('data-')) {
			data[key] = value;
		} else {
			control[key] = value;
		}
	}

	return { control, data };
}

/**
 * @access private
 */
export type FieldControlProps = {
	id: string | undefined;
	status: InputStatusType | undefined;
	required: boolean | undefined;
	ariaRequired: AriaAttributes['aria-required'];
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
};

/**
 * The control's own props resolved against the surrounding `Field` or `Field.Group`, which supplies
 * the defaults: the id its label points at, the status it shows a message for and whether it is
 * required. The control's own props win.
 *
 * `required` is the native attribute and comes from the control's own prop only. A `required` field
 * reaches the control as `ariaRequired` alone: the form's validation (react-hook-form, zod) owns
 * the rules, and a native `required` makes the browser stop the submit with its own bubble before
 * the schema runs whenever the form is a plain `<form>` without `noValidate`. A call site that
 * wants the browser check passes `required` to the control itself, which sets both attributes.
 * `ariaRequired` is the control's own `aria-required`, else its own `required`, else the field's.
 *
 * The id the input ends up with is handed back to the field, so its `<label for>` points at it
 * also when the call site names its own `id`. A group has no single control to name, so an input
 * inside one keeps its own id, or none.
 *
 * `aria-describedby` gains the field's description ids, and `aria-invalid` follows a `danger`
 * status unless the call site writes it.
 *
 * @access private
 */
export function useFieldControl(own: FieldControlProps): {
	id: string | undefined;
	status: InputStatusType | undefined;
	required: boolean | undefined;
	ariaRequired: AriaAttributes['aria-required'];
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
} {
	const field = useFieldContext();
	const status = own.status ?? field?.status;
	const id = own.id ?? field?.controlId;
	const claimControl = field?.claimControl;

	useIsomorphicLayoutEffect(() => {
		if (claimControl === undefined) {
			return undefined;
		}

		claimControl(id);

		return () => claimControl(undefined);
	}, [claimControl, id]);

	const required = own.required ?? field?.required;

	return {
		id,
		status,
		required: own.required,
		ariaRequired: own.ariaRequired ?? (required === true ? true : undefined),
		ariaDescribedBy: joinIdRefs(own.ariaDescribedBy, field?.describedBy),
		ariaInvalid: own.ariaInvalid ?? (status === 'danger' ? true : undefined),
	};
}

/**
 * The reason tooltip of a locked control: the read-only reason while `readOnly`, the disabled one
 * while `disabled`, and whether an anchor should mount at all. The anchor mounts from the props,
 * not from whether there is a reason right now, so the control never remounts and keeps its focus
 * when a reason appears.
 *
 * @access private
 */
export function getReasonTooltip({
	disabled,
	disabledTooltip,
	readOnly,
	readOnlyTooltip,
}: {
	disabled: boolean;
	disabledTooltip: ReactNode;
	readOnly: boolean;
	readOnlyTooltip: ReactNode;
}): { reason: ReactNode; hasReasonAnchor: boolean } {
	const hasReadOnlyTooltip = readOnly && hasTooltipContent(readOnlyTooltip);
	const hasDisabledTooltip = disabled && !readOnly && hasTooltipContent(disabledTooltip);

	return {
		reason: hasReadOnlyTooltip ? readOnlyTooltip : hasDisabledTooltip ? disabledTooltip : null,
		hasReasonAnchor: disabledTooltip != null || readOnlyTooltip != null,
	};
}
