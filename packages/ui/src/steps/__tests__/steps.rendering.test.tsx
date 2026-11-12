import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Steps } from '../index.js';
import { ONBOARDING, PLAIN, stepElements } from './steps.test-utils.js';

function slotsIn(element: Element): string[] {
	return Array.from(element.querySelectorAll('[data-slot]')).map(
		(slot) => slot.getAttribute('data-slot') ?? '',
	);
}

function testIdsIn(root: Element): string[] {
	return [root, ...Array.from(root.querySelectorAll('[data-testid]:not(svg)'))]
		.map((element) => element.getAttribute('data-testid') ?? '')
		.filter(Boolean);
}

describe('Steps root', () => {
	it('renders an ol with the steps slot', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		const root = screen.getByTestId('steps');

		expect(root.tagName).toBe('OL');
		expect(root).toHaveAttribute('data-slot', 'steps');
	});

	it('forwards the id, aria-* and data-* props to the ol', () => {
		render(
			<Steps
				current={1}
				items={PLAIN}
				id="setup"
				aria-label="Setup progress"
				aria-describedby="hint"
				data-foo="bar"
				testId="steps"
			/>,
		);

		const root = screen.getByTestId('steps');

		expect(root.tagName).toBe('OL');
		expect(root).toHaveAttribute('id', 'setup');
		expect(root).toHaveAttribute('aria-label', 'Setup progress');
		expect(root).toHaveAttribute('aria-describedby', 'hint');
		expect(root).toHaveAttribute('data-foo', 'bar');
	});

	it('keeps data-slot, data-current and the test ID on the ol whatever data-* the consumer passes', () => {
		render(
			<Steps
				current={2}
				items={PLAIN}
				data-slot="other"
				data-current="9"
				data-testid="other"
				testId="steps"
			/>,
		);

		const root = screen.getByTestId('steps');

		expect(root).toHaveAttribute('data-slot', 'steps');
		expect(root).toHaveAttribute('data-current', '2');
		expect(screen.queryByTestId('other')).toBeNull();
	});

	it('does not forward the steps, the current or the test ID as attributes', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const root = screen.getByTestId('steps');

		expect(root).not.toHaveAttribute('items');
		expect(root).not.toHaveAttribute('current');
		expect(root).not.toHaveAttribute('testid');
		expect(root).not.toHaveAttribute('testId');
	});

	it('writes the step number that renders as current to data-current', () => {
		const { rerender } = render(<Steps current={1} items={PLAIN} testId="steps" />);
		expect(screen.getByTestId('steps')).toHaveAttribute('data-current', '1');

		rerender(<Steps current={3} items={PLAIN} testId="steps" />);
		expect(screen.getByTestId('steps')).toHaveAttribute('data-current', '3');
	});

	it('renders no wrapper around the ol', () => {
		const { container } = render(<Steps current={1} items={PLAIN} />);

		expect(container.firstElementChild?.tagName).toBe('OL');
		expect(container.children).toHaveLength(1);
	});
});

describe('Steps test IDs', () => {
	it('names every step and part after the step number, from 1', () => {
		render(<Steps current={2} items={ONBOARDING} testId="my-steps" />);

		expect(testIdsIn(screen.getByTestId('my-steps'))).toEqual([
			'my-steps',
			'my-steps-item-1',
			'my-steps-item-1-marker',
			'my-steps-item-1-label',
			'my-steps-item-1-description',
			'my-steps-item-2',
			'my-steps-item-2-marker',
			'my-steps-item-2-label',
			'my-steps-item-2-description',
			'my-steps-item-3',
			'my-steps-item-3-marker',
			'my-steps-item-3-label',
		]);
	});

	it('puts every test ID on the part it names', () => {
		render(<Steps current={2} items={ONBOARDING} testId="my-steps" />);

		expect(screen.getByTestId('my-steps-item-1').tagName).toBe('LI');
		expect(screen.getByTestId('my-steps-item-1')).toHaveAttribute('data-slot', 'steps-item');
		expect(screen.getByTestId('my-steps-item-1-marker')).toHaveAttribute(
			'data-slot',
			'steps-marker',
		);
		expect(screen.getByTestId('my-steps-item-1-label')).toHaveAttribute('data-slot', 'steps-label');
		expect(screen.getByTestId('my-steps-item-1-description')).toHaveAttribute(
			'data-slot',
			'steps-description',
		);
		expect(
			within(screen.getByTestId('my-steps-item-2')).getByTestId('my-steps-item-2-label'),
		).toBeInTheDocument();
	});

	it('numbers the test IDs the way the markers number the steps', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		expect(screen.getByTestId('steps-item-2-marker')).toHaveTextContent('2');
		expect(screen.getByTestId('steps-item-3-marker')).toHaveTextContent('3');
		expect(screen.getByTestId('steps-item-2-label')).toHaveTextContent('Two');
		expect(screen.queryByTestId('steps-item-0')).toBeNull();
		expect(screen.queryByTestId('steps-item-4')).toBeNull();
	});

	it('does not give the description a test ID when the step has none', () => {
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		expect(screen.getByTestId('steps-item-2-description')).toBeInTheDocument();
		expect(screen.queryByTestId('steps-item-3-description')).toBeNull();
	});

	it('gives no part a data-testid without testId', () => {
		const { container } = render(<Steps current={2} items={ONBOARDING} />);

		expect(container.querySelectorAll('[data-testid]:not(svg)')).toHaveLength(0);
		expect(container.querySelectorAll('[data-slot]').length).toBeGreaterThan(0);
	});

	it('gives no part a data-testid without testId whatever the state', () => {
		for (const current of [1, 2, 3, 4, 0]) {
			const { container, unmount } = render(<Steps current={current} items={ONBOARDING} />);

			expect(
				container.querySelectorAll('[data-testid]:not(svg)'),
				`current ${current}`,
			).toHaveLength(0);
			unmount();
		}
	});
});

describe('Steps slots', () => {
	it('names the parts of a step', () => {
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		expect(slotsIn(screen.getByTestId('steps-item-1'))).toEqual([
			'steps-marker',
			'steps-label',
			'steps-description',
			'steps-connector',
		]);
	});

	it('names the slots of the whole row', () => {
		render(<Steps current={1} items={ONBOARDING} />);

		expect(new Set(slotsIn(document.body))).toEqual(
			new Set([
				'steps',
				'steps-item',
				'steps-marker',
				'steps-label',
				'steps-description',
				'steps-connector',
			]),
		);
	});

	it('gives every step but the last a connector', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		const connectors = stepElements('steps').map((step) =>
			step.querySelector('[data-slot="steps-connector"]'),
		);

		expect(connectors[0]).not.toBeNull();
		expect(connectors[1]).not.toBeNull();
		expect(connectors[2]).toBeNull();
	});

	it('gives a single step no connector', () => {
		render(<Steps current={1} items={[{ label: 'Only' }]} />);

		expect(document.querySelector('[data-slot="steps-connector"]')).toBeNull();
	});

	it('keeps the connector out of the test IDs', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		const connector = document.querySelector('[data-slot="steps-connector"]');

		expect(connector).not.toBeNull();
		expect(connector).not.toHaveAttribute('data-testid');
	});

	it('writes data-status on every step and on nothing else', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const withStatus = Array.from(document.querySelectorAll('[data-status]'));

		expect(withStatus).toEqual(stepElements('steps'));
	});

	it('puts the number in the marker of a current and a waiting step, and the done mark in a done one', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const done = screen.getByTestId('steps-item-1-marker');

		expect(done).toHaveTextContent('');
		expect(done.querySelector('svg')).not.toBeNull();
		expect(screen.getByTestId('steps-item-2-marker')).toHaveTextContent('2');
		expect(screen.getByTestId('steps-item-2-marker').querySelector('svg')).toBeNull();
		expect(screen.getByTestId('steps-item-3-marker')).toHaveTextContent('3');
		expect(screen.getByTestId('steps-item-3-marker').querySelector('svg')).toBeNull();
	});

	it('shows the done mark on every step once current is above the count', () => {
		render(<Steps current={4} items={PLAIN} testId="steps" />);

		for (const n of [1, 2, 3]) {
			const marker = screen.getByTestId(`steps-item-${n}-marker`);

			expect(marker.querySelector('svg'), `step ${n}`).not.toBeNull();
			expect(marker).toHaveTextContent('');
		}
	});

	it('renders the labels in the order of the items', () => {
		render(<Steps current={1} items={ONBOARDING} />);

		expect(
			Array.from(document.querySelectorAll('[data-slot="steps-label"]')).map((l) => l.textContent),
		).toEqual(['Select data source', 'Configure', 'Send data']);
	});

	it('renders the label and the description as plain text', () => {
		render(
			<Steps
				current={1}
				items={[{ label: '<b>bold</b>', description: '<i>it</i>' }]}
				testId="steps"
			/>,
		);

		expect(screen.getByTestId('steps-item-1-label')).toHaveTextContent('<b>bold</b>');
		expect(screen.getByTestId('steps-item-1-description')).toHaveTextContent('<i>it</i>');
		expect(document.querySelector('b, i')).toBeNull();
	});
});

describe('Steps empty text', () => {
	it.each([
		['an empty label', ''],
		['a label of spaces', '   '],
		['a label of a tab and a newline', '\t\n'],
	])('shows <No label> for %s', (_name, label) => {
		render(<Steps current={1} items={[{ label }, { label: 'Two' }]} testId="steps" />);

		expect(screen.getByTestId('steps-item-1-label')).toHaveTextContent('<No label>');
		expect(screen.getByTestId('steps-item-1-label').textContent).toBe('<No label>');
	});

	it('shows <No label> for a label that is missing at runtime', () => {
		render(
			<Steps current={1} items={[{} as { label: string }, { label: 'Two' }]} testId="steps" />,
		);

		expect(screen.getByTestId('steps-item-1-label')).toHaveTextContent('<No label>');
	});

	it('keeps a step with no label, so the numbers after it do not move', () => {
		render(
			<Steps
				current={2}
				items={[{ label: '' }, { label: 'Two' }, { label: 'Three' }]}
				testId="steps"
			/>,
		);

		expect(stepElements('steps')).toHaveLength(3);
		expect(screen.getByTestId('steps-item-3-marker')).toHaveTextContent('3');
		expect(screen.getByTestId('steps-item-2-label')).toHaveTextContent('Two');
	});

	it('does not touch a label that has text around its spaces', () => {
		render(<Steps current={1} items={[{ label: '  Select  ' }]} testId="steps" />);

		expect(screen.getByTestId('steps-item-1-label').textContent).toBe('  Select  ');
	});

	it('keeps the connector and the status of a step with no label', () => {
		render(<Steps current={1} items={[{ label: ' ' }, { label: 'Two' }]} testId="steps" />);

		expect(screen.getByTestId('steps-item-1')).toHaveAttribute('data-status', 'current');
		expect(
			screen.getByTestId('steps-item-1').querySelector('[data-slot="steps-connector"]'),
		).not.toBeNull();
	});

	it.each([
		['an empty description', ''],
		['a description of spaces', '   '],
		['no description', undefined],
	])('does not render %s', (_name, description) => {
		render(
			<Steps
				current={1}
				items={[
					{ label: 'One', description },
					{ label: 'Two', description: 'Two desc' },
				]}
				testId="steps"
			/>,
		);

		expect(screen.queryByTestId('steps-item-1-description')).toBeNull();
		expect(
			screen.getByTestId('steps-item-1').querySelector('[data-slot="steps-description"]'),
		).toBeNull();
		expect(screen.getByTestId('steps-item-2-description')).toHaveTextContent('Two desc');
	});

	it('renders nothing for an empty items', () => {
		const { container } = render(<Steps current={1} items={[]} testId="steps" />);

		expect(container).toBeEmptyDOMElement();
		expect(screen.queryByTestId('steps')).toBeNull();
		expect(screen.queryByRole('list')).toBeNull();
	});

	it('renders the row again when the items arrive', () => {
		const { rerender, container } = render(<Steps current={1} items={[]} testId="steps" />);
		expect(container).toBeEmptyDOMElement();

		rerender(<Steps current={1} items={PLAIN} testId="steps" />);

		expect(stepElements('steps')).toHaveLength(3);
	});
});

describe('Steps reserved description line', () => {
	function placeholders(): Element[] {
		return Array.from(
			document.querySelectorAll('li > [aria-hidden="true"]:not([data-slot])'),
		).filter((element) => element.textContent === ' ');
	}

	it('reserves the line on the steps without a description when one step has a description', () => {
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		const found = placeholders();

		expect(found).toHaveLength(1);
		expect(screen.getByTestId('steps-item-3')).toContainElement(found[0] as HTMLElement);
	});

	it('reserves a line on every step that has no description', () => {
		render(
			<Steps
				current={1}
				items={[{ label: 'One' }, { label: 'Two', description: 'x' }, { label: 'Three' }]}
				testId="steps"
			/>,
		);

		const found = placeholders();

		expect(found).toHaveLength(2);
		expect(screen.getByTestId('steps-item-1')).toContainElement(found[0] as HTMLElement);
		expect(screen.getByTestId('steps-item-3')).toContainElement(found[1] as HTMLElement);
	});

	it('reserves nothing when no step has a description', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		expect(placeholders()).toHaveLength(0);
	});

	it('reserves nothing when every step has a description', () => {
		render(
			<Steps
				current={1}
				items={[
					{ label: 'One', description: 'a' },
					{ label: 'Two', description: 'b' },
				]}
				testId="steps"
			/>,
		);

		expect(placeholders()).toHaveLength(0);
	});

	it('reserves nothing when the descriptions are all blank', () => {
		render(
			<Steps
				current={1}
				items={[
					{ label: 'One', description: '' },
					{ label: 'Two', description: '   ' },
				]}
				testId="steps"
			/>,
		);

		expect(placeholders()).toHaveLength(0);
	});

	it('hides the reserved line from assistive technology and gives it no slot nor test ID', () => {
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		const [placeholder] = placeholders();

		expect(placeholder).toHaveAttribute('aria-hidden', 'true');
		expect(placeholder).not.toHaveAttribute('data-slot');
		expect(placeholder).not.toHaveAttribute('data-testid');
	});

	it('does not read the reserved line as a description', () => {
		render(<Steps current={1} items={ONBOARDING} testId="steps" />);

		expect(
			screen.getByTestId('steps-item-3').querySelector('[data-slot="steps-description"]'),
		).toBeNull();
	});

	it('takes the reserved line away when the last description goes', () => {
		const { rerender } = render(<Steps current={1} items={ONBOARDING} testId="steps" />);
		expect(placeholders()).toHaveLength(1);

		rerender(<Steps current={1} items={PLAIN} testId="steps" />);

		expect(placeholders()).toHaveLength(0);
	});

	it('puts the line of the first description in when it arrives, and reserves the others', () => {
		const { rerender } = render(<Steps current={1} items={PLAIN} testId="steps" />);
		expect(placeholders()).toHaveLength(0);

		rerender(
			<Steps
				current={1}
				items={[{ label: 'One', description: 'Kubernetes' }, { label: 'Two' }, { label: 'Three' }]}
				testId="steps"
			/>,
		);

		expect(placeholders()).toHaveLength(2);
		expect(screen.getByTestId('steps-item-1-description')).toHaveTextContent('Kubernetes');
	});
});
