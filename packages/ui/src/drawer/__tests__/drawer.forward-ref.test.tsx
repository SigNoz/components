import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../index.js';

describe('Drawer forwardRef', () => {
	it('forwards the ref to the panel', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer type="task" open onClose={() => {}} title="Edit member" testId="drawer" ref={ref}>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('dialog'));
		expect(ref.current).toBe(screen.getByTestId('drawer'));
		expect(ref.current).toHaveAttribute('data-slot', 'drawer-popup');
	});

	it('forwards the ref to the panel of an inspector', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer type="inspector" open onClose={() => {}} title="Span details" ref={ref}>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		expect(ref.current).toBe(screen.getByRole('dialog'));
		expect(ref.current).toHaveAttribute('data-slot', 'drawer-popup');
	});

	it('calls a callback ref with the panel, and with null when it unmounts', async () => {
		const ref = vi.fn();
		const { rerender } = render(
			<Drawer type="task" open onClose={() => {}} title="Edit member" ref={ref}>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		expect(ref).toHaveBeenCalledWith(panel);

		rerender(
			<Drawer type="task" open={false} onClose={() => {}} title="Edit member" ref={ref}>
				Body
			</Drawer>,
		);
		await vi.waitFor(() => expect(ref).toHaveBeenLastCalledWith(null));
	});

	it('empties an object ref once the drawer closes', async () => {
		const ref = createRef<HTMLDivElement>();
		const { rerender } = render(
			<Drawer type="task" open onClose={() => {}} title="Edit member" ref={ref}>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		rerender(
			<Drawer type="task" open={false} onClose={() => {}} title="Edit member" ref={ref}>
				Body
			</Drawer>,
		);
		await vi.waitFor(() => expect(ref.current).toBeNull());
	});

	it('leaves the ref empty while it is closed', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer type="task" open={false} onClose={() => {}} title="Edit member" ref={ref}>
				Body
			</Drawer>,
		);

		expect(ref.current).toBeNull();
	});

	it('keeps the ref on the panel when the ref prop changes between renders', async () => {
		const first = createRef<HTMLDivElement>();
		const second = createRef<HTMLDivElement>();
		const { rerender } = render(
			<Drawer type="task" open onClose={() => {}} title="Edit member" ref={first}>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		rerender(
			<Drawer type="task" open onClose={() => {}} title="Edit member" ref={second}>
				Body
			</Drawer>,
		);

		expect(second.current).toBe(panel);
	});

	it('lands the id on the panel, where the ref points', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer type="task" open onClose={() => {}} title="Edit member" id="edit-member" ref={ref}>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		expect(ref.current).toHaveAttribute('id', 'edit-member');
	});
});
