import { act, renderHook, waitFor } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it } from 'vitest';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';
import { useTooltipLazyOpen } from '../use-tooltip-lazy-open.js';

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function renderLazyOpen(hasContent = true) {
	const element = document.createElement('span');
	const { result, rerender } = renderHook(
		(props: { hasContent: boolean }) => useTooltipLazyOpen(props.hasContent),
		{
			initialProps: { hasContent },
			wrapper: ({ children }: { children: React.ReactNode }) => (
				<TooltipProvider delay={100}>{children}</TooltipProvider>
			),
		},
	);

	return { element, result, rerender };
}

describe('useTooltipLazyOpen', () => {
	it('mounts nothing while the pointer only passes over the trigger', async () => {
		const { element, result } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));
		await wait(50);
		act(() => result.current.leaveTrigger());
		await wait(200);

		expect(result.current.anchor).toBeNull();
		expect(result.current.open).toBe(false);
	});

	it('sets the anchor and opens together once the delay has passed', async () => {
		const { element, result } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));

		expect(result.current.anchor).toBeNull();
		await waitFor(() => expect(result.current.open).toBe(true));
		expect(result.current.anchor).toBe(element);
	});

	it('keeps the anchor until the popup has finished closing', async () => {
		const { element, result } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));
		await waitFor(() => expect(result.current.open).toBe(true));
		act(() => result.current.leaveTrigger());
		await waitFor(() => expect(result.current.open).toBe(false));

		expect(result.current.anchor).toBe(element);

		act(() => result.current.onClosed());

		expect(result.current.anchor).toBeNull();
	});

	it('stays open while the pointer crosses from the trigger to the popup', async () => {
		const { element, result } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));
		await waitFor(() => expect(result.current.open).toBe(true));
		act(() => {
			result.current.leaveTrigger();
			result.current.enterPopup();
		});
		await wait(200);

		expect(result.current.open).toBe(true);
	});

	it('never opens over a trigger with no content', async () => {
		const { element, result } = renderLazyOpen(false);

		act(() => result.current.enterTrigger(element));
		await wait(200);

		expect(result.current.anchor).toBeNull();
		expect(result.current.open).toBe(false);
	});

	it('drops the popup at once when the content goes while it is open', async () => {
		const { element, result, rerender } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));
		await waitFor(() => expect(result.current.open).toBe(true));
		rerender({ hasContent: false });

		expect(result.current.open).toBe(false);
		expect(result.current.anchor).toBeNull();

		act(() => result.current.leaveTrigger());
		await wait(200);
		rerender({ hasContent: true });

		expect(result.current.open).toBe(false);
		expect(result.current.anchor).toBeNull();
	});

	it('stays closed after a dismiss until the pointer comes back', async () => {
		const { element, result } = renderLazyOpen();

		act(() => result.current.enterTrigger(element));
		await waitFor(() => expect(result.current.open).toBe(true));
		act(() => {
			result.current.dismiss();
			result.current.moveOverTrigger(element);
		});
		await wait(200);

		expect(result.current.open).toBe(false);

		act(() => {
			result.current.leaveTrigger();
			result.current.enterTrigger(element);
		});

		await waitFor(() => expect(result.current.open).toBe(true));
	});
});
