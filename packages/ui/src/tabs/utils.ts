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
