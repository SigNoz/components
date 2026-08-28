import * as React from 'react';

interface PortalComponentProps {
	container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null;
	keepMounted?: boolean;
	children?: React.ReactNode;
}

/**
 * Renders a Base UI portal into an element placed at the call site.
 *
 * Base UI requires a `*.Portal` above the positioner, so our `withPortal={false}`
 * option cannot simply omit it the way it could with Radix. Pointing the portal
 * at an in-place container keeps the content in the local DOM — which is what
 * callers use the option for — while satisfying the primitive.
 */
export function InlinePortal({
	Portal,
	keepMounted,
	children,
}: {
	Portal: React.ComponentType<PortalComponentProps>;
	keepMounted?: boolean;
	children?: React.ReactNode;
}) {
	const [container, setContainer] = React.useState<HTMLElement | null>(null);

	return (
		<>
			<span ref={setContainer} style={{ display: 'contents' }} />
			{container !== null && (
				<Portal container={container} keepMounted={keepMounted}>
					{children}
				</Portal>
			)}
		</>
	);
}
