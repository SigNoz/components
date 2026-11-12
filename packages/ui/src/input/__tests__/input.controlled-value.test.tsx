import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Input } from '../input.js';

const noop = (): void => {};

type TextMember = ComponentType<Record<string, unknown>>;

const textMembers: [string, TextMember][] = [
	['Input', Input as unknown as TextMember],
	['Input.Password', Input.Password as unknown as TextMember],
	['Input.TextArea', Input.TextArea as unknown as TextMember],
];

let warn: MockInstance<typeof console.warn>;
let error: MockInstance<typeof console.error>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	warn.mockRestore();
	error.mockRestore();
});

describe.each(textMembers)('%s value rule', (name, Member) => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		render(<Member aria-label="Nickname" defaultValue="Ada" />);

		await user.type(screen.getByLabelText('Nickname'), '!');

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada!');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});

	it('ignores a defaultValue that arrives after the first render', () => {
		const { rerender } = render(<Member aria-label="Nickname" />);

		rerender(<Member aria-label="Nickname" defaultValue="Ada" />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});

	it('keeps the first defaultValue when it changes', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Member aria-label="Nickname" defaultValue="Ada" />);

		rerender(<Member aria-label="Nickname" defaultValue="Bo" />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');

		await user.type(screen.getByLabelText('Nickname'), '!');
		rerender(<Member aria-label="Nickname" defaultValue="Cy" />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada!');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Member aria-label="Nickname" onChange={noop} />);

		rerender(<Member aria-label="Nickname" value="Ada" onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining(name));

		await user.type(screen.getByLabelText('Nickname'), '!');

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');

		rerender(<Member aria-label="Nickname" value="Bo" onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Bo');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('shows an empty field when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Member aria-label="Nickname" value="Ada" onChange={noop} />);

		rerender(<Member aria-label="Nickname" value={undefined} onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('');

		await user.type(screen.getByLabelText('Nickname'), 'a');

		expect(screen.getByLabelText('Nickname')).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});

	it('is controlled and empty for a null value with nullable, and stays controlled', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Member aria-label="Nickname" nullable value={null} onChange={noop} />,
		);

		await user.type(screen.getByLabelText('Nickname'), 'a');

		expect(screen.getByLabelText('Nickname')).toHaveValue('');

		rerender(<Member aria-label="Nickname" nullable value="Ada" onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('Ada');

		rerender(<Member aria-label="Nickname" nullable value={undefined} onChange={noop} />);

		expect(screen.getByLabelText('Nickname')).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	});
});

describe('Input.Number value rule', () => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" defaultValue={3} />);

		const field = screen.getByRole('textbox', { name: 'Count' });

		expect(field).toHaveValue('3');

		await user.clear(field);
		await user.type(field, '8');
		await user.tab();

		expect(field).toHaveValue('8');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Input.Number aria-label="Count" onChange={noop} />);

		rerender(<Input.Number aria-label="Count" value={5} onChange={noop} />);

		const field = screen.getByRole('textbox', { name: 'Count' });

		expect(field).toHaveValue('5');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Input.Number'));

		await user.type(field, '7');
		await user.tab();

		expect(field).toHaveValue('5');

		rerender(<Input.Number aria-label="Count" value={9} onChange={noop} />);

		expect(field).toHaveValue('9');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('shows an empty field when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Input.Number aria-label="Count" value={5} onChange={noop} />);

		rerender(<Input.Number aria-label="Count" value={undefined} onChange={noop} />);

		const field = screen.getByRole('textbox', { name: 'Count' });

		expect(field).toHaveValue('');

		await user.type(field, '7');
		await user.tab();

		expect(field).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
	});

	it('is controlled and empty for a null value, and stays controlled', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Input.Number aria-label="Count" value={null} onChange={noop} />);

		const field = screen.getByRole('textbox', { name: 'Count' });
		await user.type(field, '7');
		await user.tab();

		expect(field).toHaveValue('');

		rerender(<Input.Number aria-label="Count" value={5} onChange={noop} />);

		expect(field).toHaveValue('5');

		rerender(<Input.Number aria-label="Count" value={undefined} onChange={noop} />);

		expect(field).toHaveValue('');
		expect(warn).not.toHaveBeenCalled();
	});
});
