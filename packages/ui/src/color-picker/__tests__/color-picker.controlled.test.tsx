import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../index.js';
import { getHexField, getTrigger, MID_RED, openPicker } from './color-picker.test-utils.js';

type PlainProps = {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string | undefined) => void;
	onAfterChange?: (value: string | undefined) => void;
	allowClear?: boolean;
};

// Spreading the props keeps a `value` that is left out apart from one written as `undefined`.
function Plain(props: PlainProps) {
	return (
		<ColorPicker nativeButton side="bottom" align="start" {...props}>
			<button type="button">Color</button>
		</ColorPicker>
	);
}

type NullableProps = {
	value?: string | null;
	onChange?: (value: string | null) => void;
	onAfterChange?: (value: string | null) => void;
	allowClear?: boolean;
};

function Nullable(props: NullableProps) {
	return (
		<ColorPicker nativeButton side="bottom" align="start" nullable {...props}>
			<button type="button">Color</button>
		</ColorPicker>
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('ColorPicker value rule', () => {
	it('keeps its own state and starts at defaultValue while value is undefined on the first render', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Plain value={undefined} defaultValue={MID_RED} onChange={onChange} />);
		await openPicker();

		expect(getHexField()).toHaveValue('804040');

		await userEvent.keyboard('{ArrowUp}');

		const next = onChange.mock.lastCall?.[0] as string;

		expect(next).toMatch(/^#[0-9a-f]{6}$/);
		expect(next).not.toBe(MID_RED);
		expect(getHexField()).toHaveValue(next.slice(1));
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives later, and warns once', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Plain value={undefined} />);

		rerender(<Plain value="#3a2a63" />);
		rerender(<Plain value="#00ff00" />);
		await openPicker();

		expect(getHexField()).toHaveValue('00ff00');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain(
			'ColorPicker: `value` was `undefined` on the first render and is set now',
		);
	});

	it('stays controlled once set, so value={undefined} then shows no color', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		const { rerender } = render(<Plain value={MID_RED} onChange={onChange} />);

		rerender(<Plain value={undefined} onChange={onChange} />);
		await openPicker();

		expect(getHexField()).toHaveValue('');

		await userEvent.keyboard('{ArrowUp}');

		expect(onChange).toHaveBeenLastCalledWith('#030303');
		expect(getHexField()).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
	});
});

describe('ColorPicker nullable', () => {
	it('takes null as a controlled picker with no color, without a warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Nullable value={null} onChange={onChange} />);
		await openPicker();

		expect(getHexField()).toHaveValue('');
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{ArrowUp}');

		expect(onChange).toHaveBeenLastCalledWith('#030303');
		expect(getHexField()).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a color that replaces null, without a warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Nullable value={null} />);

		rerender(<Nullable value="#3a2a63" />);
		await openPicker();

		expect(getHexField()).toHaveValue('3a2a63');
		expect(warn).not.toHaveBeenCalled();
	});

	it('reports null when the color is cleared', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<Nullable value={MID_RED} allowClear onChange={onChange} onAfterChange={onAfterChange} />,
		);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(null);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(null);
	});

	it('still reports undefined when the color is cleared without nullable', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(<Plain value={MID_RED} allowClear onChange={onChange} onAfterChange={onAfterChange} />);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');

		expect(onChange).toHaveBeenCalledWith(undefined);
		expect(onAfterChange).toHaveBeenCalledWith(undefined);
	});
});
