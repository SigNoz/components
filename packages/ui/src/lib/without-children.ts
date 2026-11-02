import { createElement, type ReactElement } from 'react';
import { getElementRef } from './merge-refs.js';

/**
 * A copy of the element without its own children.
 *
 * Base UI merges the props of a `render` element over the ones of the component, children
 * included, so `<a>Docs</a>` would replace the label, the icons and the truncation the component
 * renders inside it. The key and the ref are kept, and a key the element does not have stays unset,
 * where `createElement` would turn `null` into the string `"null"`.
 *
 * @access private
 */
export function withoutChildren(element: ReactElement): ReactElement {
	const { children: _children, ...props } = element.props as Record<string, unknown>;
	const ref = getElementRef(element);

	return createElement(element.type, {
		...props,
		...(element.key === null ? {} : { key: element.key }),
		...(ref == null ? {} : { ref }),
	});
}
