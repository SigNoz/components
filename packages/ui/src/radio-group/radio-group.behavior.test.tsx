import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { RadioGroup, RadioGroupItem } from './index.js';

const group = (props: Record<string, unknown> = {}) => (
	<RadioGroup {...props}>
		<RadioGroupItem value="logs">Logs</RadioGroupItem>
		<RadioGroupItem value="traces">Traces</RadioGroupItem>
	</RadioGroup>
);

describe('RadioGroup selection', () => {
	it('exposes a radiogroup with one radio per item', () => {
		render(group());

		expect(screen.getByRole('radiogroup')).toBeInTheDocument();
		expect(screen.getAllByRole('radio')).toHaveLength(2);
	});

	it('selects nothing by default', () => {
		render(group());
		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).toHaveAttribute('aria-checked', 'false');
		}
	});

	it('honours defaultValue', () => {
		render(group({ defaultValue: 'traces' }));

		const [logs, traces] = screen.getAllByRole('radio');
		expect(traces).toHaveAttribute('aria-checked', 'true');
		expect(logs).toHaveAttribute('aria-checked', 'false');
	});

	it('selects on activation and reports the value', () => {
		const onChange = vi.fn();
		render(group({ onChange }));

		activate(screen.getAllByRole('radio')[1]);

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'true');
	});

	it('moves selection between items rather than accumulating it', () => {
		render(group({ defaultValue: 'logs' }));
		const [logs, traces] = screen.getAllByRole('radio');

		activate(traces);

		expect(traces).toHaveAttribute('aria-checked', 'true');
		expect(logs).toHaveAttribute('aria-checked', 'false');
	});
});

describe('RadioGroup controlled vs uncontrolled', () => {
	it('stays pinned to the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(group({ value: 'logs', onChange }));

		activate(screen.getAllByRole('radio')[1]);

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState('logs');
			return group({ value, onChange: setValue });
		}
		render(<Controlled />);

		activate(screen.getAllByRole('radio')[1]);

		expect(screen.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'true');
	});
});

describe('RadioGroup label association', () => {
	it('links an auto-generated id so the label selects the radio', () => {
		render(group());

		activate(screen.getByText('Traces'));

		expect(screen.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'true');
	});

	it('uses a supplied id for the association', () => {
		// BREAKING (Base UI migration): `id` now lands on the hidden radio input
		// that carries the value into a form, not on the interactive root. The
		// label points at that input and the root is linked via aria-labelledby.
		const { container } = render(
			<RadioGroup>
				<RadioGroupItem value="logs" id="logs-radio">
					Logs
				</RadioGroupItem>
			</RadioGroup>,
		);

		expect(container.querySelector('input[type="radio"]')).toHaveAttribute('id', 'logs-radio');
		expect(screen.getByText('Logs')).toHaveAttribute('for', 'logs-radio');
	});

	it('renders no wrapper or label when the item has no children', () => {
		render(
			<RadioGroup>
				<RadioGroupItem value="logs" testId="bare" />
			</RadioGroup>,
		);

		expect(screen.getByTestId('bare')).toHaveAttribute('role', 'radio');
		expect(screen.queryByText('Logs')).not.toBeInTheDocument();
	});
});

describe('RadioGroup disabled', () => {
	it('does not select when the whole group is disabled', () => {
		const onChange = vi.fn();
		render(group({ disabled: true, onChange }));

		const radios = screen.getAllByRole('radio');
		// The interactive root is not a native control; it conveys the state
		// with aria-disabled while the hidden input carries `disabled`.
		expect(radios[0]).toHaveAttribute('aria-disabled', 'true');
		activate(radios[1]);

		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not select a single disabled item but leaves siblings usable', () => {
		const onChange = vi.fn();
		render(
			<RadioGroup onChange={onChange}>
				<RadioGroupItem value="logs">Logs</RadioGroupItem>
				<RadioGroupItem value="traces" disabled>
					Traces
				</RadioGroupItem>
			</RadioGroup>,
		);
		const [logs, traces] = screen.getAllByRole('radio');

		activate(traces);
		expect(onChange).not.toHaveBeenCalled();

		activate(logs);
		expect(onChange).toHaveBeenCalledWith('logs');
	});
});

describe('RadioGroup prop forwarding', () => {
	it('separates control props from container props on an item', () => {
		render(
			<RadioGroup>
				<RadioGroupItem
					value="logs"
					testId="logs-radio"
					className="control-class"
					style={{ opacity: 0.5 }}
					containerTestId="logs-container"
					containerId="logs-container-id"
					containerClassName="container-class"
					containerStyle={{ marginBlock: '12px' }}
				>
					Logs
				</RadioGroupItem>
			</RadioGroup>,
		);

		const control = screen.getByTestId('logs-radio');
		const container = screen.getByTestId('logs-container');

		expect(control).toHaveClass('control-class');
		expect(control).toHaveStyle({ opacity: '0.5' });
		expect(container).toHaveAttribute('id', 'logs-container-id');
		expect(container).toHaveClass('container-class');
		expect(container).toHaveStyle({ marginBlock: '12px' });
		expect(container).toContainElement(control);
	});

	it('exposes testId, orientation and color on the group', () => {
		render(group({ testId: 'signal-radios', orientation: 'vertical', color: 'forest' }));

		const root = screen.getByTestId('signal-radios');
		expect(root).toHaveAttribute('aria-orientation', 'vertical');
		expect(root).toHaveAttribute('data-color', 'forest');
	});
});
