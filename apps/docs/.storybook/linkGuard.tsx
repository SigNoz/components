import { Toaster, toast } from '@signozhq/ui';
import { type ReactElement, useEffect } from 'react';

/**
 * Its own toaster, so the notice never lands in a `Toaster` a story renders, and a story's toasts
 * never land here.
 */
const TOASTER_ID = 'storybook-link-guard';

/**
 * Anything a story renders, including what it portals to `document.body`. The docs page chrome
 * around the stories keeps its links, so the table of contents and the cross-story links work.
 */
function isStoryContent(node: Element): boolean {
	return node.closest('#storybook-docs') === null || node.closest('.docs-story') !== null;
}

function handleClick(event: MouseEvent): void {
	if (!(event.target instanceof Element)) {
		return;
	}

	const anchor = event.target.closest<HTMLAnchorElement>('a[href]');

	if (anchor === null || !isStoryContent(anchor)) {
		return;
	}

	event.preventDefault();
	toast(`Navigation blocked. This link would go to ${anchor.getAttribute('href')}`, {
		toasterId: TOASTER_ID,
	});
}

/**
 * Stops a link inside a story from navigating the preview iframe away from it, and says where it
 * would have gone instead.
 */
export function LinkGuardDecorator(Story: () => ReactElement): ReactElement {
	useEffect(() => {
		document.addEventListener('click', handleClick, true);

		return () => document.removeEventListener('click', handleClick, true);
	}, []);

	return (
		<>
			<Story />
			<Toaster id={TOASTER_ID} position="bottom-center" />
		</>
	);
}
