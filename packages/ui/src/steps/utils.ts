import { isValidElement } from 'react';
import { isBlankText } from '../lib/blank-text.js';
import { STEPS_EMPTY_LABEL, StepsStatus } from './constants.js';
import type { StepsListItem, StepsStatusType } from './types.js';

/**
 * The step number `Steps` renders for `current`: `1` for a number below 1 or one that is not an
 * integer, the number itself otherwise. A number above the count of steps is kept, so every step
 * reads as done.
 *
 * @access private
 */
export function toCurrentStep(current: number): number {
	return isValidCurrent(current) ? current : 1;
}

/**
 * @access private
 */
export function isValidCurrent(current: number): boolean {
	return Number.isInteger(current) && current >= 1;
}

/**
 * The state of the step numbered `step` (from 1) while `current` is the current step.
 *
 * @access private
 */
export function getStepStatus(step: number, current: number): StepsStatusType {
	if (step < current) {
		return StepsStatus.Done;
	}

	return step === current ? StepsStatus.Current : StepsStatus.Waiting;
}

/**
 * The label a step shows: `<No label>` for an empty one, or one with only spaces.
 *
 * @access private
 */
export function toStepLabel(label: string): string {
	return isBlankText(label) ? STEPS_EMPTY_LABEL : label;
}

/**
 * The React key of a step of `Steps.List`: the `key` of its content when it has one, its position
 * otherwise. Keyed by its content, a step keeps its state, such as a value typed in its form, when a
 * step before it is removed or moved. The prefixes keep a content key such as `'0'` apart from a
 * position.
 *
 * @access private
 */
export function toListStepKey(item: StepsListItem, index: number): string {
	return isValidElement(item.children) && item.children.key !== null
		? `key:${item.children.key}`
		: `index:${index}`;
}

/**
 * The rest props of `Steps.List`, split between its two elements: `id` and every `aria-*` go to the
 * `ol`, so an `aria-label` names the list of steps, and every `data-*` goes to the root. Any other
 * key is dropped, so a prop that gets past the types never reaches the DOM.
 *
 * @access private
 */
export function splitListAttributes(props: object): {
	root: Record<string, unknown>;
	list: Record<string, unknown>;
} {
	const root: Record<string, unknown> = {};
	const list: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (key === 'id' || key.startsWith('aria-')) {
			list[key] = value;
		} else if (key.startsWith('data-')) {
			root[key] = value;
		}
	}

	return { root, list };
}
