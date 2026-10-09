import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';

afterEach(() => {
	act(() => toast.dismiss());
});

// What a press on the middle of the toast button lands on.
async function hitOnAction(): Promise<{ action: HTMLElement; hit: Element | null }> {
	act(() => {
		toast.danger('Could not save the dashboard', { action: { label: 'Close' } });
	});
	const action = await vi.waitFor(() => {
		const element = document.querySelector<HTMLElement>('[data-slot="toast-action"]');
		expect(element).not.toBeNull();

		return element as HTMLElement;
	});
	const { left, top, width, height } = action.getBoundingClientRect();

	return { action, hit: document.elementFromPoint(left + width / 2, top + height / 2) };
}

// antd 5.11 puts a modal and a drawer at 1000, and adds 1000 for each one opened inside another.
// Its modal wrap covers the window, so a toast under it can be neither seen nor pressed.
describe('Toaster over antd overlays', () => {
	it('stays above an antd modal', async () => {
		render(
			<>
				<Toaster />
				<div className="ant-modal-wrap" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />
			</>,
		);

		const { action, hit } = await hitOnAction();

		expect(hit).toBe(action);
	});

	it('stays above an antd modal opened from another one', async () => {
		render(
			<>
				<Toaster />
				<div className="ant-modal-wrap" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />
				<div className="ant-modal-wrap" style={{ position: 'fixed', inset: 0, zIndex: 2000 }} />
			</>,
		);

		const { action, hit } = await hitOnAction();

		expect(hit).toBe(action);
	});
});
