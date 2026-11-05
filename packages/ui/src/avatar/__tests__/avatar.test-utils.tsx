/**
 * Stops every image `load` and `error` in the capture phase, before the handlers React put on the
 * image, so the image reads as one that settled before React attached them. Returns the cleanup.
 */
export function swallowImageEvents(): () => void {
	const swallow = (event: Event): void => {
		if (event.target instanceof HTMLImageElement) {
			event.stopImmediatePropagation();
		}
	};
	document.addEventListener('load', swallow, true);
	document.addEventListener('error', swallow, true);

	return () => {
		document.removeEventListener('load', swallow, true);
		document.removeEventListener('error', swallow, true);
	};
}
