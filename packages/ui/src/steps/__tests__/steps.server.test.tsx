import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Steps } from '../index.js';
import { ONBOARDING } from './steps.test-utils.js';

let error: MockInstance<typeof console.error>;

beforeEach(() => {
	error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Steps on the server', () => {
	it('renders the row with no warning', () => {
		const html = renderToString(<Steps current={2} items={ONBOARDING} testId="steps" />);

		expect(html).toContain('data-slot="steps"');
		expect(html).toContain('data-current="2"');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders every step with its status, the current one in aria-current', () => {
		const html = renderToString(<Steps current={2} items={ONBOARDING} testId="steps" />);

		expect(html.match(/data-slot="steps-item"/g)).toHaveLength(3);
		expect(html).toContain('data-status="done"');
		expect(html).toContain('data-status="current"');
		expect(html).toContain('data-status="waiting"');
		expect(html.match(/aria-current="step"/g)).toHaveLength(1);
		expect(html).toContain('Completed');
	});

	it('renders no cut text, since nothing can be measured yet', () => {
		const html = renderToString(<Steps current={1} items={ONBOARDING} testId="steps" />);

		expect(html).not.toContain('data-truncated');
		expect(html).not.toContain('tabindex');
	});

	it('renders Steps.List with no warning', () => {
		const html = renderToString(
			<Steps.List items={[{ label: 'One', children: 'a' }, { children: 'b' }]} testId="list" />,
		);

		expect(html).toContain('data-slot="steps-list"');
		expect(html).toContain('data-slot="steps-list-items"');
		expect(html).toContain('data-testid="list-items"');
		expect(html.match(/data-slot="steps-list-item"/g)).toHaveLength(2);
		expect(html).toContain('data-testid="list-item-2-content"');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders the footer of Steps.List after the ol, and the footer alone for an empty items', () => {
		const withSteps = renderToString(
			<Steps.List items={[{ children: 'a' }]} footer={<button type="button">Add</button>} />,
		);
		const alone = renderToString(
			<Steps.List items={[]} footer={<button type="button">Add</button>} aria-label="Steps" />,
		);

		expect(withSteps.indexOf('</ol>')).toBeGreaterThan(-1);
		expect(withSteps.indexOf('</ol>')).toBeLessThan(
			withSteps.indexOf('data-slot="steps-list-footer"'),
		);
		expect(withSteps).not.toContain('role="none"');
		expect(alone).not.toContain('<ol');
		expect(alone).not.toContain('aria-label');
		expect(alone).toContain('data-slot="steps-list-footer"');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders nothing for an empty items', () => {
		expect(renderToString(<Steps current={1} items={[]} />)).toBe('');
		expect(renderToString(<Steps.List items={[]} />)).toBe('');
	});
});
