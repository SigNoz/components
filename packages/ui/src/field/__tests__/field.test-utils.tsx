export function describedByIds(element: Element): string[] {
	return element.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? [];
}

export function slot(root: ParentNode, name: string): HTMLElement | null {
	return root.querySelector<HTMLElement>(`[data-slot="${name}"]`);
}

/**
 * The markup with every generated id (`:r1a:`, `base-ui-:r4:`) replaced by one token, so two
 * renders of the same tree compare equal.
 */
export function withoutGeneratedIds(html: string): string {
	return html.replace(/:r[0-9a-z]+:/g, ':id:');
}
