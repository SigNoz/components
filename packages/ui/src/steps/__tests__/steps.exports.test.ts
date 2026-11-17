import { describe, expect, it } from 'vitest';
import * as steps from '../index.js';

describe('steps exports', () => {
	it('exports Steps and StepsStatus only', () => {
		expect(Object.keys(steps).sort()).toEqual(['Steps', 'StepsStatus']);
	});

	it('does not export the parts', () => {
		for (const name of [
			'StepsList',
			'StepsStep',
			'StepsText',
			'StepsListStep',
			'StepsRoot',
			'STEPS_EMPTY_LABEL',
			'STEPS_DONE_TEXT',
			'getStepStatus',
			'toCurrentStep',
			'isValidCurrent',
			'toStepLabel',
			'toListStepKey',
		]) {
			expect(steps, name).not.toHaveProperty(name);
		}
	});

	it('reaches the list as a static of Steps', () => {
		expect(steps.Steps.List).toBeDefined();
		expect(steps.Steps.List.displayName).toBe('Steps.List');
	});

	it('exports the three states of a step', () => {
		expect(steps.StepsStatus).toEqual({ Done: 'done', Current: 'current', Waiting: 'waiting' });
	});
});
