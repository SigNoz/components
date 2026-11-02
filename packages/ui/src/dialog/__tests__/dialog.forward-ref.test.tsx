import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../index.js';

describe('Dialog forwardRef', () => {
	it('forwards the ref to the panel', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Dialog open onClose={() => {}} title="Rename view" testId="dialog" ref={ref}>
				Body
			</Dialog>,
		);
		await screen.findByRole('dialog');

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('dialog'));
		expect(ref.current).toBe(screen.getByTestId('dialog'));
		expect(ref.current).toHaveAttribute('data-slot', 'dialog-popup');
	});

	it('calls a callback ref with the panel, and with null when it unmounts', async () => {
		const ref = vi.fn();
		const { rerender } = render(
			<Dialog open onClose={() => {}} title="Rename view" ref={ref}>
				Body
			</Dialog>,
		);
		const panel = await screen.findByRole('dialog');

		expect(ref).toHaveBeenCalledWith(panel);

		rerender(
			<Dialog open={false} onClose={() => {}} title="Rename view" ref={ref}>
				Body
			</Dialog>,
		);
		await vi.waitFor(() => expect(ref).toHaveBeenLastCalledWith(null));
	});

	it('leaves the ref empty while it is closed', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Dialog open={false} onClose={() => {}} title="Rename view" ref={ref}>
				Body
			</Dialog>,
		);

		expect(ref.current).toBeNull();
	});

	it('keeps the ref on the panel when the ref prop changes between renders', async () => {
		const first = createRef<HTMLDivElement>();
		const second = createRef<HTMLDivElement>();
		const { rerender } = render(
			<Dialog open onClose={() => {}} title="Rename view" ref={first}>
				Body
			</Dialog>,
		);
		const panel = await screen.findByRole('dialog');

		rerender(
			<Dialog open onClose={() => {}} title="Rename view" ref={second}>
				Body
			</Dialog>,
		);

		expect(second.current).toBe(panel);
	});

	it('lands the id on the panel, where the ref points', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Dialog open onClose={() => {}} title="Rename view" id="rename-dialog" ref={ref}>
				Body
			</Dialog>,
		);
		await screen.findByRole('dialog');

		expect(ref.current).toHaveAttribute('id', 'rename-dialog');
	});
});
