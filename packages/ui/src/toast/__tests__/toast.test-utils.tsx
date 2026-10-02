import { act, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { toast } from '../toast.js';

// The manager is a module singleton, so a toast left over would show up in the next test.
afterEach(() => {
	act(() => toast.dismiss());
});

export function toasts(): HTMLElement[] {
	return [...document.querySelectorAll<HTMLElement>('[data-slot="toast"]')];
}

export function slot(name: string, root: ParentNode = document): HTMLElement | null {
	return root.querySelector<HTMLElement>(`[data-slot="${name}"]`);
}

export function raise<Result>(call: () => Result): Result {
	let result!: Result;
	act(() => {
		result = call();
	});

	return result;
}

export async function findToast(title: string): Promise<HTMLElement> {
	const element = await screen.findByText(title, { selector: '[data-slot="toast-title"]' });

	return element.closest<HTMLElement>('[data-slot="toast"]') as HTMLElement;
}

export async function advance(ms: number): Promise<void> {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(ms);
	});
}

export function titles(): (string | null)[] {
	return toasts().map((item) => slot('toast-title', item)?.textContent ?? null);
}

/**
 * The button of the toast whose button says `label`. Queried by slot, since Base UI hides it from
 * assistive technology until the stack is spread or the button has focus.
 */
export function actionButton(label: string): HTMLElement | undefined {
	return [...document.querySelectorAll<HTMLElement>('[data-slot="toast-action"]')].find(
		(button) => button.textContent === label,
	);
}
