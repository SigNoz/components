/**
 * A host page with a font default nobody would pick. Every value is one no text style produces, so
 * a text that shows one took it from the page instead of from its component. The second rule plays
 * a host that styles bare form controls, which is what a control without a font of its own picks up.
 */
const HOSTILE_HOST = `
html, body {
	font-family: 'Hostile Host', cursive !important;
	font-size: 23px !important;
	font-weight: 800 !important;
	line-height: 37px !important;
	letter-spacing: 3px !important;
	text-transform: math-auto !important;
	font-feature-settings: 'smcp' 1 !important;
	font-variant-numeric: oldstyle-nums !important;
}

button, input, select, textarea, optgroup {
	font-family: 'Hostile Control', cursive;
	font-size: 19px;
	letter-spacing: 5px;
}
`;

const LEAKS: [keyof CSSStyleDeclaration, (value: string) => boolean][] = [
	['fontFamily', (value) => value.includes('Hostile')],
	['fontSize', (value) => value === '23px' || value === '19px'],
	['fontWeight', (value) => value === '800'],
	['lineHeight', (value) => value === '37px'],
	['letterSpacing', (value) => value === '3px' || value === '5px'],
	['textTransform', (value) => value === 'math-auto'],
	['fontFeatureSettings', (value) => value.includes('smcp') || !value.includes('ss01')],
	['fontVariantNumeric', (value) => value.includes('oldstyle')],
];

/**
 * Slots whose own text takes the font of the text around it by design, so a page default reaching
 * it is the point. Each one wraps content the caller brings, inline in the caller's own text. A
 * component the caller puts inside one, such as a `Button` as the trigger, is still checked.
 */
const INHERITS_BY_DESIGN = new Set(['divider-label', 'dropdown-trigger', 'tooltip-trigger']);

function isVisuallyHidden(element: Element): boolean {
	const rect = element.getBoundingClientRect();
	return rect.width <= 1 && rect.height <= 1;
}

function findLeaks(root: HTMLElement): string[] {
	const leaks: string[] = [];
	const checked = new Set<Element>();
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const element = node.parentElement;

		if (!node.textContent?.trim() || !element || checked.has(element)) {
			continue;
		}

		checked.add(element);

		const slot = element.closest<HTMLElement>('[data-slot]');

		if (
			!slot ||
			element.closest('script, style, #storybook-docs') ||
			INHERITS_BY_DESIGN.has(slot.dataset.slot ?? '') ||
			!element.checkVisibility({ visibilityProperty: true }) ||
			isVisuallyHidden(element)
		) {
			continue;
		}

		const style = getComputedStyle(element);
		const properties = LEAKS.filter(([property, leaked]) => leaked(String(style[property])));

		if (properties.length > 0) {
			const text = node.textContent.trim().slice(0, 30);
			const values = properties.map(
				([property]) => `${String(property)}: ${String(style[property])}`,
			);
			leaks.push(`[${slot.dataset.slot}] <${element.localName}> "${text}": ${values.join('; ')}`);
		}
	}

	return leaks;
}

/**
 * Fails a story whose component text takes a text style property or its numerals from the page
 * around it. Each component declares its whole text style and pins the numerals (open digits,
 * proportional figures) on its root, so it renders the same in every app that installs it,
 * whatever that app sets on `body`. Smoothing, kerning, optical sizing and font synthesis belong
 * to the app root, as the design sets them, and are not checked here.
 *
 * Runs after the play function, with the popups the story opened still on screen, and takes the
 * hostile page away again in the same task, before anything paints.
 */
export function hostFontGuard(): void {
	const sheet = document.createElement('style');
	sheet.textContent = HOSTILE_HOST;
	document.head.append(sheet);

	try {
		const leaks = findLeaks(document.body);

		if (leaks.length > 0) {
			throw new Error(
				`Text takes its font from the host page (${leaks.length}):\n${leaks.slice(0, 25).join('\n')}`,
			);
		}
	} finally {
		sheet.remove();
	}
}
