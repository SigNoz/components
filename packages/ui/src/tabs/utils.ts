/**
 * How far the viewport has scrolled along one axis, and how much is left.
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
 * Measures the scroll viewport along the axis the bar runs on.
 *
 * An RTL viewport counts `scrollLeft` down from zero, so `travelled` is the absolute value and
 * neither end flag has to know which direction it is on.
 *
 * @access private
 */
export function readTabsAxis(viewport: HTMLElement, isVertical: boolean): TabsAxis {
	const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
	const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
	const travelled = isVertical ? viewport.scrollTop : Math.abs(viewport.scrollLeft);

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
 * travelled. The size of the other axis is cleared rather than left behind, or an orientation flip
 * keeps whatever the previous axis wrote.
 *
 * @access private
 */
export function moveHoverSlider(
	slider: HTMLDivElement | null,
	list: HTMLElement | null,
	trigger: HTMLElement | null,
	isVertical: boolean,
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

	if (isVertical) {
		slider.style.transform = `translateY(${triggerRect.top - listRect.top}px)`;
		slider.style.height = `${triggerRect.height}px`;
		slider.style.width = '';
	} else {
		slider.style.transform = `translateX(${triggerRect.left - listRect.left}px)`;
		slider.style.width = `${triggerRect.width}px`;
		slider.style.height = '';
	}

	slider.style.opacity = '1';
}
