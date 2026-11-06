import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../index.js';

describe('AlertDialog forwardRef', () => {
	const props = {
		open: true,
		title: 'Delete this view?',
		color: 'danger',
		confirmText: 'Delete view',
		onConfirm: () => {},
		onCancel: () => {},
		testId: 'alert',
	} as const;

	it('forwards the ref to the panel', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<AlertDialog {...props} ref={ref}>
				Gone for good.
			</AlertDialog>,
		);
		await screen.findByRole('alertdialog');

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('alertdialog'));
		expect(ref.current).toBe(screen.getByTestId('alert'));
		expect(ref.current).toHaveAttribute('data-slot', 'alert-dialog-popup');
	});

	it('calls a callback ref with the panel, and with null when it unmounts', async () => {
		const ref = vi.fn();
		const { rerender } = render(
			<AlertDialog {...props} ref={ref}>
				Gone for good.
			</AlertDialog>,
		);
		const panel = await screen.findByRole('alertdialog');

		expect(ref).toHaveBeenCalledWith(panel);

		rerender(
			<AlertDialog {...props} open={false} ref={ref}>
				Gone for good.
			</AlertDialog>,
		);
		await vi.waitFor(() => expect(ref).toHaveBeenLastCalledWith(null));
	});

	it('leaves the ref empty while it is closed', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<AlertDialog {...props} open={false} ref={ref}>
				Gone for good.
			</AlertDialog>,
		);

		expect(ref.current).toBeNull();
	});

	it('keeps the ref on the panel when the ref prop changes between renders', async () => {
		const first = createRef<HTMLDivElement>();
		const second = createRef<HTMLDivElement>();
		const { rerender } = render(
			<AlertDialog {...props} ref={first}>
				Gone for good.
			</AlertDialog>,
		);
		const panel = await screen.findByRole('alertdialog');

		rerender(
			<AlertDialog {...props} ref={second}>
				Gone for good.
			</AlertDialog>,
		);

		expect(second.current).toBe(panel);
	});

	it('lands the id on the panel, where the ref points', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<AlertDialog {...props} id="delete-alert" ref={ref}>
				Gone for good.
			</AlertDialog>,
		);
		await screen.findByRole('alertdialog');

		expect(ref.current).toHaveAttribute('id', 'delete-alert');
	});
});
