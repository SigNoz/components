import type { ReactNode } from 'react';

/**
 * Renders `children`, calling it with `payload` when it is a function.
 *
 * A component of its own so the call happens only when React renders it. Inside the dialog's
 * portal that is only while the dialog is mounted, so a dialog that was never opened never calls
 * the function with a payload it was not given.
 *
 * @access private
 */
export function DialogPayload<Payload>({
	children,
	payload,
}: {
	children: ReactNode | ((payload: Payload) => ReactNode);
	payload: Payload;
}): ReactNode {
	return typeof children === 'function' ? children(payload) : children;
}
