import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useControlledValue } from './use-controlled-value.js';

function Probe({
	value,
	defaultValue,
}: {
	value?: string | null;
	defaultValue?: string;
}): ReactNode {
	const [shown, set, isControlled] = useControlledValue({
		component: 'Probe',
		value,
		defaultValue,
		empty: '',
	});
	return (
		<>
			<output data-testid="probe" data-controlled={String(isControlled)}>
				{shown}
			</output>
			<button type="button" onClick={() => set('b')}>
				pick b
			</button>
		</>
	);
}

function shown(): { text: string | null; controlled: string | null } {
	const probe = document.querySelector('[data-testid="probe"]');

	return {
		text: probe?.textContent ?? null,
		controlled: probe?.getAttribute('data-controlled') ?? null,
	};
}

function pickB(): void {
	const button = document.querySelector('button');
	if (button) {
		fireEvent.click(button);
	}
}

describe('useControlledValue', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('keeps its own state while value is undefined on the first render', () => {
		render(<Probe defaultValue="a" />);
		pickB();

		expect(shown()).toEqual({ text: 'b', controlled: 'false' });
	});

	it('follows value and ignores its own setter while controlled', () => {
		render(<Probe value="a" />);
		pickB();

		expect(shown()).toEqual({ text: 'a', controlled: 'true' });
	});

	it('follows a value that arrives after the first render, with one warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(<Probe />);
		rerender(<Probe value="a" />);
		rerender(<Probe value="b" />);

		expect(shown()).toEqual({ text: 'b', controlled: 'true' });
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain('Probe: `value` was `undefined` on the first render');
	});

	it('stays controlled and empty once value turns undefined or null', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(<Probe value="a" />);
		rerender(<Probe value={undefined} />);
		expect(shown()).toEqual({ text: '', controlled: 'true' });

		rerender(<Probe value={null} />);
		expect(shown()).toEqual({ text: '', controlled: 'true' });
		expect(warn).not.toHaveBeenCalled();
	});

	it('treats null on the first render as controlled and empty', () => {
		render(<Probe value={null} defaultValue="a" />);
		pickB();

		expect(shown()).toEqual({ text: '', controlled: 'true' });
	});
});
