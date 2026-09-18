/**
 * How far the viewport has scrolled along the bar's axis, and how much is left.
 *
 * @access private
 */
export type TabsAxis = {
	scrollSize: number;
	clientSize: number;
	/** How far the strip has already travelled from its start, on either writing direction. */
	travelled: number;
	/** How much is left before the far end. */
	remaining: number;
};

/**
 * Measures the scroll viewport along the bar's axis.
 *
 * An RTL viewport counts `scrollLeft` down from zero, so `travelled` is the absolute value and
 * neither end flag has to know which direction it is on.
 *
 * @access private
 */
export function readTabsAxis(viewport: HTMLElement): TabsAxis {
	const scrollSize = viewport.scrollWidth;
	const clientSize = viewport.clientWidth;
	const travelled = Math.abs(viewport.scrollLeft);

	return { scrollSize, clientSize, travelled, remaining: scrollSize - clientSize - travelled };
}

/**
 * Takes the hover mark off the bar.
 *
 * @access private
 */
export function hideHoverSlider(slider: HTMLDivElement | null): void {
	if (slider) {
		slider.style.opacity = '0';
	}
}

/**
 * Sizes the hover mark to `trigger` and moves it there, or hides it when there is nothing to track.
 *
 * Both rects are read from the same scrolled box, so the delta holds however far the strip has
 * travelled.
 *
 * @access private
 */
export function moveHoverSlider(
	slider: HTMLDivElement | null,
	list: HTMLElement | null,
	trigger: HTMLElement | null,
): void {
	if (!slider) {
		return;
	}

	if (!list || !trigger) {
		hideHoverSlider(slider);
		return;
	}

	const listRect = list.getBoundingClientRect();
	const triggerRect = trigger.getBoundingClientRect();

	slider.style.transform = `translateX(${triggerRect.left - listRect.left}px)`;
	slider.style.width = `${triggerRect.width}px`;
	slider.style.opacity = '1';
}
