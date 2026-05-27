import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../input/index.js';
import { Textarea } from './index.js';

describe('Textarea', () => {
	it('passes onChange through as a standard textarea ChangeEvent', () => {
		const onChange = vi.fn();
		render(<Textarea onChange={onChange} testId="ta" />);
		const el = screen.getByTestId('ta') as HTMLTextAreaElement;
		fireEvent.change(el, { target: { value: 'hello' } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0].target.value).toBe('hello');
		expect(el.value).toBe('hello');
	});

	it('honors the rows and placeholder props', () => {
		render(<Textarea rows={6} placeholder="Write your feedback here..." testId="ta" />);
		const el = screen.getByTestId('ta') as HTMLTextAreaElement;
		expect(el.rows).toBe(6);
		expect(el.placeholder).toBe('Write your feedback here...');
	});

	it('reflects size and status on the wrapper as data attributes', () => {
		render(<Textarea size="small" status="error" testId="ta" />);
		const wrapper = screen.getByTestId('ta').parentElement;
		expect(wrapper).toHaveAttribute('data-size', 'small');
		expect(wrapper).toHaveAttribute('data-status', 'error');
	});

	it('exposes itself as Input.TextArea (AntD-style compound)', () => {
		expect(Input.TextArea).toBe(Textarea);
		render(<Input.TextArea testId="ta" placeholder="via Input.TextArea" />);
		expect(screen.getByPlaceholderText('via Input.TextArea')).toBeInTheDocument();
	});

	it('marks the wrapper for autoSize and mirrors the value', () => {
		render(<Textarea autoSize defaultValue="abc" testId="ta" />);
		const wrapper = screen.getByTestId('ta').parentElement;
		expect(wrapper).toHaveAttribute('data-autosize', 'true');
		expect(wrapper).toHaveAttribute('data-replicated-value', 'abc ');
	});

	it('does not mark autoSize when the prop is absent', () => {
		render(<Textarea testId="ta" defaultValue="abc" />);
		const wrapper = screen.getByTestId('ta').parentElement;
		expect(wrapper).not.toHaveAttribute('data-autosize');
		expect(wrapper).not.toHaveAttribute('data-replicated-value');
	});

	it('updates the replicated value as the user types (uncontrolled)', () => {
		render(<Textarea autoSize testId="ta" />);
		const el = screen.getByTestId('ta') as HTMLTextAreaElement;
		const wrapper = el.parentElement!;
		fireEvent.change(el, { target: { value: 'line one\nline two' } });
		expect(wrapper).toHaveAttribute('data-replicated-value', 'line one\nline two ');
	});

	it('updates the replicated value from a controlled value prop', () => {
		const { rerender } = render(
			<Textarea autoSize value="first" onChange={() => {}} testId="ta" />
		);
		const wrapper = screen.getByTestId('ta').parentElement!;
		expect(wrapper).toHaveAttribute('data-replicated-value', 'first ');
		rerender(<Textarea autoSize value="second pass" onChange={() => {}} testId="ta" />);
		expect(wrapper).toHaveAttribute('data-replicated-value', 'second pass ');
	});

	it('exposes maxRows on the wrapper as a CSS variable', () => {
		render(<Textarea autoSize={{ maxRows: 6 }} testId="ta" />);
		const wrapper = screen.getByTestId('ta').parentElement!;
		expect(wrapper).toHaveAttribute('data-has-max', 'true');
		expect(wrapper.style.getPropertyValue('--textarea-max-rows')).toBe('6');
	});

	it('passes minRows through to the textareas `rows` attribute', () => {
		render(<Textarea autoSize={{ minRows: 3 }} testId="ta" />);
		const el = screen.getByTestId('ta') as HTMLTextAreaElement;
		expect(el.rows).toBe(3);
	});

	it('passes name, required and maxLength through for native form integration', () => {
		render(
			<form data-testid="form">
				<Textarea name="description" required maxLength={200} testId="ta" />
			</form>
		);
		const el = screen.getByTestId('ta') as HTMLTextAreaElement;
		expect(el.name).toBe('description');
		expect(el.required).toBe(true);
		expect(el.maxLength).toBe(200);
	});
});
