import type { ReactElement } from 'react';

/**
 * The props a link component sets on the element it renders as, filled in only where the element
 * leaves them `undefined`.
 *
 * @access private
 */
export type LinkElementProps = {
	href?: string;
	target?: string;
	rel?: string;
};

/**
 * `rel` with `noopener` and `noreferrer` added, for a link that opens in a new tab. The values it
 * already holds are kept.
 */
function withBlankTargetRel(rel: string | undefined): string {
	const values = new Set(rel?.split(/\s+/).filter(Boolean));

	values.add('noopener');
	values.add('noreferrer');

	return [...values].join(' ');
}

/**
 * The `href`, `target` and `rel` to set on the `render` element of a link. An `href` or `target`
 * the element sets wins, and a `_blank` target from either side adds `noopener` and `noreferrer`
 * to the `rel` of the element, keeping its other values.
 *
 * Only the props that are set: an `undefined` one is still passed to the element, and a router
 * link that spreads its props after its own `href` would lose it.
 *
 * `hasDestination` is false when neither the link nor the element says where it goes, through an
 * `href` or the `to` of a router link.
 *
 * @access private
 */
export function getLinkProps(
	element: ReactElement,
	{ href, target }: { href?: string | undefined; target?: string | undefined },
): { props: LinkElementProps; hasDestination: boolean } {
	const elementProps = element.props as Record<string, unknown>;
	const resolvedHref = (elementProps['href'] as string | undefined) ?? href;
	const resolvedTarget = (elementProps['target'] as string | undefined) ?? target;

	return {
		props: {
			...(resolvedHref == null ? {} : { href: resolvedHref }),
			...(resolvedTarget == null ? {} : { target: resolvedTarget }),
			...(resolvedTarget === '_blank'
				? { rel: withBlankTargetRel(elementProps['rel'] as string | undefined) }
				: {}),
		},
		hasDestination: resolvedHref != null || elementProps['to'] != null,
	};
}
