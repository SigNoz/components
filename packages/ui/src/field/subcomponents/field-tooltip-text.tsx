import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';

/**
 * The `labelTooltip` content again, hidden, for the control's `aria-describedby`: the tooltip only
 * opens on hover of the info icon, which is not a tab stop.
 *
 * @access private
 */
export function FieldTooltipText({
	id,
	registered,
	children,
}: {
	id: string;
	registered: boolean;
	children: ReactNode;
}) {
	return registered ? (
		<BaseField.Description id={id} render={<span hidden />}>
			{children}
		</BaseField.Description>
	) : (
		<span id={id} hidden>
			{children}
		</span>
	);
}
