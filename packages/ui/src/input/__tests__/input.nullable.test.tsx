import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Input } from '../input.js';
import { InputField } from '../presets/input-field.js';

const noop = (): void => {};

type TextMember = ComponentType<Record<string, unknown>>;

const textMembers: [string, TextMember][] = [
	['Input', Input as unknown as TextMember],
	['Input.Password', Input.Password as unknown as TextMember],
	['Input.TextArea', Input.TextArea as unknown as TextMember],
];

let error: MockInstance<typeof console.error>;

beforeEach(() => {
	error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	error.mockRestore();
});

describe.each(textMembers)('%s with nullable', (_name, Member) => {
	it('draws a null value as an empty field and takes a string later without a warning', () => {
		const { rerender } = render(
			<Member aria-label="Nickname" nullable value={null} onChange={noop} />,
		);

		expect(screen.getByLabelText('Nickname')).toHaveValue('');

		rerender(<Member aria-label="Nickname" nullable value="Ada" onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(error).not.toHaveBeenCalled();
	});

	it('is controlled while the value is null: typing changes nothing until the parent writes it', async () => {
		const user = userEvent.setup();
		render(<Member aria-label="Nickname" nullable value={null} onChange={noop} />);

		await user.type(screen.getByLabelText('Nickname'), 'a');

		expect(screen.getByLabelText('Nickname')).toHaveValue('');
		expect(error).not.toHaveBeenCalled();
	});

	it('is uncontrolled for an undefined value, as it is without nullable', async () => {
		const user = userEvent.setup();
		render(<Member aria-label="Nickname" nullable value={undefined} />);

		await user.type(screen.getByLabelText('Nickname'), 'Ada');

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(error).not.toHaveBeenCalled();
	});

	it('goes back to the empty field when the value turns null again', () => {
		const { rerender } = render(
			<Member aria-label="Nickname" nullable value="Ada" onChange={noop} />,
		);

		rerender(<Member aria-label="Nickname" nullable value={null} onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('');
		expect(error).not.toHaveBeenCalled();
	});

	it('is controlled by a nullable state: typing reports the native event', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();

		function Harness() {
			const [value, setValue] = useState<string | null>(null);

			return (
				<Member
					aria-label="Nickname"
					nullable
					value={value}
					onChange={(event: { target: { value: string } }) => {
						onChange(event);
						setValue(event.target.value);
					}}
				/>
			);
		}

		render(<Harness />);
		await user.type(screen.getByLabelText('Nickname'), 'Ada');

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(onChange).toHaveBeenCalledTimes(3);
		expect(onChange.mock.calls[0]?.[0]).toHaveProperty('target');
		expect(error).not.toHaveBeenCalled();
	});

	it('does not write nullable on the element', () => {
		render(<Member aria-label="Nickname" nullable value={null} onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).not.toHaveAttribute('nullable');
		expect(error).not.toHaveBeenCalled();
	});

	it('stays uncontrolled without a value, the way a register() spread leaves it', async () => {
		const onChange = vi.fn();
		const onBlur = vi.fn();
		const user = userEvent.setup();
		render(
			<Member aria-label="Nickname" nullable name="nickname" onChange={onChange} onBlur={onBlur} />,
		);

		const field = screen.getByLabelText('Nickname');
		await user.type(field, 'Ada');

		expect(field).toHaveValue('Ada');
		expect(onChange).toHaveBeenCalledTimes(3);

		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(error).not.toHaveBeenCalled();
	});

	it('keeps a defaultValue on an uncontrolled field', () => {
		render(<Member aria-label="Nickname" nullable defaultValue="Ada" />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(error).not.toHaveBeenCalled();
	});
});

describe.each(textMembers)('%s without nullable', (_name, Member) => {
	it('draws the value it is given', () => {
		render(<Member aria-label="Nickname" value="Ada" onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(error).not.toHaveBeenCalled();
	});

	it('is still uncontrolled for an undefined value', async () => {
		const user = userEvent.setup();
		render(<Member aria-label="Plain" value={undefined} />);

		await user.type(screen.getByLabelText('Plain'), 'Ada');

		expect(screen.getByLabelText('Plain')).toHaveValue('Ada');
		expect(error).not.toHaveBeenCalled();
	});
});

describe('Input.Number with nullable', () => {
	it('draws a null value as an empty field and takes a number later without a warning', () => {
		const { rerender } = render(<Input.Number aria-label="Count" nullable value={null} />);

		expect(screen.getByRole('textbox', { name: 'Count' })).toHaveValue('');

		rerender(<Input.Number aria-label="Count" nullable value={5} />);

		expect(screen.getByRole('textbox', { name: 'Count' })).toHaveValue('5');
		expect(error).not.toHaveBeenCalled();
	});

	it('is controlled while the value is null: typing is taken back on blur', async () => {
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" nullable value={null} onChange={noop} />);

		const field = screen.getByRole('textbox', { name: 'Count' });
		await user.type(field, '7');
		await user.tab();

		expect(field).toHaveValue('');
		expect(error).not.toHaveBeenCalled();
	});

	it('is uncontrolled for an undefined value, as it is without nullable', async () => {
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" nullable value={undefined} />);

		const field = screen.getByRole('textbox', { name: 'Count' });
		await user.type(field, '7');
		await user.tab();

		expect(field).toHaveValue('7');
		expect(error).not.toHaveBeenCalled();
	});

	it('reports the number while typing and null once cleared', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();

		function Harness() {
			const [value, setValue] = useState<number | null>(null);

			return (
				<Input.Number
					aria-label="Count"
					nullable
					value={value}
					onChange={(next) => {
						onChange(next);
						setValue(next);
					}}
				/>
			);
		}

		render(<Harness />);

		const field = screen.getByRole('textbox', { name: 'Count' });
		await user.type(field, '42');

		expect(field).toHaveValue('42');
		expect(onChange).toHaveBeenLastCalledWith(42);

		await user.clear(field);

		expect(field).toHaveValue('');
		expect(onChange).toHaveBeenLastCalledWith(null);
		expect(error).not.toHaveBeenCalled();
	});

	it('stays uncontrolled without a value', async () => {
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" nullable defaultValue={3} />);

		const field = screen.getByRole('textbox', { name: 'Count' });

		expect(field).toHaveValue('3');

		await user.clear(field);
		await user.type(field, '8');

		expect(field).toHaveValue('8');
		expect(error).not.toHaveBeenCalled();
	});
});

describe('Input.Number without nullable', () => {
	it('is still uncontrolled for an undefined value', async () => {
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" value={undefined} />);

		const field = screen.getByRole('textbox', { name: 'Count' });
		await user.type(field, '7');

		expect(field).toHaveValue('7');
		expect(error).not.toHaveBeenCalled();
	});

	it('is still controlled for null', () => {
		render(<Input.Number aria-label="Count" value={null} />);

		expect(screen.getByRole('textbox', { name: 'Count' })).toHaveValue('');
		expect(error).not.toHaveBeenCalled();
	});
});

describe('InputField with nullable', () => {
	it('spreads the field of a react-hook-form Controller whose value is null', async () => {
		const field = {
			name: 'nickname',
			value: null,
			onChange: vi.fn(),
			onBlur: vi.fn(),
			ref: vi.fn(),
		};
		const user = userEvent.setup();
		render(<InputField label="Nickname" {...field} nullable />);

		const input = screen.getByRole('textbox', { name: 'Nickname' });

		expect(input).toHaveValue('');
		expect(input).toHaveAttribute('name', 'nickname');
		expect(field.ref).toHaveBeenCalledWith(input);

		await user.type(input, 'A');
		await user.tab();

		expect(input).toHaveValue('');
		expect(field.onChange).toHaveBeenCalledTimes(1);
		expect(field.onChange.mock.calls[0]?.[0]).toHaveProperty('target');
		expect(field.onBlur).toHaveBeenCalledTimes(1);
		expect(error).not.toHaveBeenCalled();
	});

	it('draws null as empty and takes a string later, on every member', () => {
		const { rerender } = render(
			<>
				<InputField label="Text" nullable value={null} onChange={noop} />
				<InputField.Password label="Secret" nullable value={null} onChange={noop} />
				<InputField.TextArea label="Notes" nullable value={null} onChange={noop} />
				<InputField.Number label="Count" nullable value={null} />
			</>,
		);

		expect(screen.getByLabelText('Text')).toHaveValue('');
		expect(screen.getByLabelText('Secret')).toHaveValue('');
		expect(screen.getByLabelText('Notes')).toHaveValue('');
		expect(screen.getByLabelText('Count')).toHaveValue('');

		rerender(
			<>
				<InputField label="Text" nullable value="a" onChange={noop} />
				<InputField.Password label="Secret" nullable value="b" onChange={noop} />
				<InputField.TextArea label="Notes" nullable value="c" onChange={noop} />
				<InputField.Number label="Count" nullable value={4} />
			</>,
		);

		expect(screen.getByLabelText('Text')).toHaveValue('a');
		expect(screen.getByLabelText('Secret')).toHaveValue('b');
		expect(screen.getByLabelText('Notes')).toHaveValue('c');
		expect(screen.getByLabelText('Count')).toHaveValue('4');
		expect(error).not.toHaveBeenCalled();
	});

	it('stays uncontrolled for a register() spread, with or without nullable', async () => {
		const registration = { name: 'nickname', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() };
		const user = userEvent.setup();
		render(
			<>
				<InputField label="Plain" {...registration} />
				<InputField label="Nullable" nullable {...registration} />
			</>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Plain' }), 'Ada');
		await user.type(screen.getByRole('textbox', { name: 'Nullable' }), 'Bo');

		expect(screen.getByRole('textbox', { name: 'Plain' })).toHaveValue('Ada');
		expect(screen.getByRole('textbox', { name: 'Nullable' })).toHaveValue('Bo');
		expect(error).not.toHaveBeenCalled();
	});
});
