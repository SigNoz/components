import { Toaster, toast } from '@signozhq/ui';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';

/**
 * The one `Toaster` of the preview. The toast stack is global, so a second `Toaster` would draw
 * every toast twice, and the docs page mounts every story at once. It lives in a root of its own
 * rather than in a story, so no story's lifecycle decides whether it is there.
 *
 * A story that renders a `Toaster` of its own, to drive its props, opts out with
 * `parameters.ownToaster` and runs in an iframe on the docs page.
 */
let sharedToaster: { root: Root; host: HTMLElement } | undefined;

function setSharedToaster(enabled: boolean): void {
	if (enabled && sharedToaster === undefined) {
		const host = document.createElement('div');
		document.body.append(host);
		const root = createRoot(host);
		root.render(<Toaster />);
		sharedToaster = { root, host };
	} else if (!enabled && sharedToaster !== undefined) {
		sharedToaster.root.unmount();
		sharedToaster.host.remove();
		sharedToaster = undefined;
	}
}

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
	toast.info(`Navigation blocked. This link would go to ${anchor.getAttribute('href')}`);
}

/**
 * Stops a link inside a story from navigating the preview iframe away from it, and says where it
 * would have gone instead. It also mounts the shared `Toaster` for every story that does not
 * bring its own.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LinkGuardDecorator(Story: () => ReactElement, context: any): ReactElement {
	const ownToaster = context.parameters?.ownToaster === true;

	useEffect(() => {
		document.addEventListener('click', handleClick, true);

		return () => document.removeEventListener('click', handleClick, true);
	}, []);

	useEffect(() => {
		setSharedToaster(!ownToaster);
	}, [ownToaster]);

	return <Story />;
}
