import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { ToggleGroup, ToggleGroupItem } from './index.js';

/**
 * BREAKING (Base UI migration): a `type="single"` group used to expose radio
 * semantics — `role="radiogroup"` with `role="radio"` / `aria-checked` items.
 * Base UI models both modes as pressed toggles, so items are now
 * `role="button"` with `aria-pressed`, and the group is `role="group"`.
 * Selection behaviour and the public single/multiple value shapes are unchanged.
 */

const items = (
	<>
		<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
		<ToggleGroupItem value="traces">Traces</ToggleGroupItem>
	</>
);

describe('ToggleGroup single selection', () => {
	it('reports a bare string, not an array', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
	});

	it('honours defaultValue', () => {
		render(
			<ToggleGroup type="single" defaultValue="traces">
				{items}
			</ToggleGroup>,
		);

		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('moves selection rather than accumulating it', () => {
		render(
			<ToggleGroup type="single" defaultValue="logs">
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('reports an empty selection when the active item is pressed again', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" defaultValue="logs" onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith('');
	});
});

describe('ToggleGroup multiple selection', () => {
	it('reports an array', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="multiple" onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith(['traces']);
	});

	it('accumulates selections', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="multiple" defaultValue={['logs']} onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith(['logs', 'traces']);
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('removes a selection when pressed again', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="multiple" defaultValue={['logs', 'traces']} onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith(['traces']);
	});
});

describe('ToggleGroup controlled vs uncontrolled', () => {
	it('stays pinned to the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" value="logs" onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState('logs');
			return (
				<ToggleGroup type="single" value={value} onChange={setValue}>
					{items}
				</ToggleGroup>
			);
		}
		render(<Controlled />);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('ToggleGroup disabled', () => {
	it('does not change when the whole group is disabled', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" disabled onChange={onChange}>
				{items}
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not change for a disabled item but leaves siblings usable', () => {
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" onChange={onChange}>
				<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
				<ToggleGroupItem value="traces" disabled>
					Traces
				</ToggleGroupItem>
			</ToggleGroup>,
		);

		activate(screen.getByRole('button', { name: 'Traces' }));
		expect(onChange).not.toHaveBeenCalled();

		activate(screen.getByRole('button', { name: 'Logs' }));
		expect(onChange).toHaveBeenCalledWith('logs');
	});
});

describe('ToggleGroup prop forwarding', () => {
	it('exposes testId, size and color on the group', () => {
		render(
			<ToggleGroup type="single" testId="signal-toggles" size="sm" color="primary">
				{items}
			</ToggleGroup>,
		);

		const root = screen.getByTestId('signal-toggles');
		expect(root).toHaveAttribute('data-size', 'sm');
		expect(root).toHaveAttribute('data-color', 'primary');
	});

	it('puts testId on an individual item', () => {
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="logs" testId="logs-item">
					Logs
				</ToggleGroupItem>
			</ToggleGroup>,
		);

		expect(screen.getByTestId('logs-item')).toHaveAccessibleName('Logs');
	});
});
