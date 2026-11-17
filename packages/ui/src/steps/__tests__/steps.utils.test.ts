import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { STEPS_EMPTY_LABEL, StepsStatus } from '../constants.js';
import {
	getStepStatus,
	isValidCurrent,
	splitListAttributes,
	toCurrentStep,
	toListStepKey,
	toStepLabel,
} from '../utils.js';

describe('getStepStatus', () => {
	it('is done before current, current at it and waiting after it', () => {
		expect(getStepStatus(1, 3)).toBe(StepsStatus.Done);
		expect(getStepStatus(2, 3)).toBe(StepsStatus.Done);
		expect(getStepStatus(3, 3)).toBe(StepsStatus.Current);
		expect(getStepStatus(4, 3)).toBe(StepsStatus.Waiting);
		expect(getStepStatus(5, 3)).toBe(StepsStatus.Waiting);
	});

	it('makes the first step current for a current of 1, and none done', () => {
		expect(getStepStatus(1, 1)).toBe(StepsStatus.Current);
		expect(getStepStatus(2, 1)).toBe(StepsStatus.Waiting);
	});

	it('marks every step done for a current above the count of steps', () => {
		for (const step of [1, 2, 3]) {
			expect(getStepStatus(step, 4)).toBe(StepsStatus.Done);
		}
	});
});

describe('isValidCurrent', () => {
	it.each([1, 2, 3, 10, 1000])('accepts the step number %i', (current) => {
		expect(isValidCurrent(current)).toBe(true);
	});

	it.each([
		0,
		-1,
		-100,
		0.5,
		1.5,
		2.5,
		Number.NaN,
		Number.POSITIVE_INFINITY,
		Number.NEGATIVE_INFINITY,
	])('rejects %s', (current) => {
		expect(isValidCurrent(current)).toBe(false);
	});
});

describe('toCurrentStep', () => {
	it('keeps a valid current, above the count of steps too', () => {
		expect(toCurrentStep(1)).toBe(1);
		expect(toCurrentStep(3)).toBe(3);
		expect(toCurrentStep(99)).toBe(99);
	});

	it.each([0, -1, 2.5, Number.NaN, Number.POSITIVE_INFINITY])(
		'falls back to 1 for %s',
		(current) => {
			expect(toCurrentStep(current)).toBe(1);
		},
	);
});

describe('toStepLabel', () => {
	it('keeps a label with text, spaces around it included', () => {
		expect(toStepLabel('Configure')).toBe('Configure');
		expect(toStepLabel(' Configure ')).toBe(' Configure ');
	});

	it.each(['', ' ', '   ', '\t', '\n', ' \n\t '])('shows <No label> for %j', (label) => {
		expect(toStepLabel(label)).toBe(STEPS_EMPTY_LABEL);
		expect(toStepLabel(label)).toBe('<No label>');
	});
});

describe('toListStepKey', () => {
	it('takes the key of the content when it has one', () => {
		expect(toListStepKey({ children: createElement('input', { key: 'step-a' }) }, 3)).toBe(
			'key:step-a',
		);
	});

	it('falls back to the position for content with no key, or that is not an element', () => {
		expect(toListStepKey({ children: createElement('input') }, 3)).toBe('index:3');
		expect(toListStepKey({ children: 'text' }, 0)).toBe('index:0');
		expect(toListStepKey({ children: null }, 1)).toBe('index:1');
	});

	it('keeps a content key apart from a position with the same digits', () => {
		expect(toListStepKey({ children: createElement('input', { key: '0' }) }, 1)).not.toBe(
			toListStepKey({ children: 'text' }, 0),
		);
	});
});

describe('splitListAttributes', () => {
	it('sends id and every aria-* to the list, and every data-* to the root', () => {
		expect(
			splitListAttributes({
				id: 'funnel',
				'aria-label': 'Funnel steps',
				'aria-describedby': 'hint',
				'data-foo': 'bar',
				'data-analytics-id': 'steps',
			}),
		).toEqual({
			root: { 'data-foo': 'bar', 'data-analytics-id': 'steps' },
			list: { id: 'funnel', 'aria-label': 'Funnel steps', 'aria-describedby': 'hint' },
		});
	});

	it('sends every other key to the root', () => {
		const onClick = (): void => {};

		expect(splitListAttributes({ title: 'x', onClick, tabIndex: 0 })).toEqual({
			root: { title: 'x', onClick, tabIndex: 0 },
			list: {},
		});
	});

	it('returns two empty records for no props', () => {
		expect(splitListAttributes({})).toEqual({ root: {}, list: {} });
	});
});
