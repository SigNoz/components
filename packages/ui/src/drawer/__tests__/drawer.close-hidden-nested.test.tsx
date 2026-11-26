import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, Suspense, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType } from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

const pending = new Promise<never>(() => {});

function Details({
	suspends,
	onFormClose,
}: {
	suspends: boolean;
	onFormClose: (reason: DrawerCloseReasonType) => void;
}): ReactNode {
	if (suspends) {
		throw pending;
	}

	return (
		<Drawer
			type="inspector"
			stack="overlay"
			open
			title="Edit"
			testId="form"
			onClose={(reason) => {
				onFormClose(reason);
			}}
		>
			<input aria-label="Name" />
		</Drawer>
	);
}

/**
 * A pod whose body loads its details in a Suspense boundary, with a form drawer over the pod that
 * the details render. The pod closes on every request.
 */
function LoadingDetailsPage({
	suspends,
	onPodClose,
	onFormClose,
	onTrailSelect,
}: {
	suspends: boolean;
	onPodClose: (reason: DrawerCloseReasonType) => void;
	onFormClose: (reason: DrawerCloseReasonType) => void;
	onTrailSelect?: (index: number) => void;
}): ReactNode {
	const [podOpen, setPodOpen] = useState(true);

	return (
		<Drawer
			type="inspector"
			stack="overlay"
			open={podOpen}
			title="Pod"
			testId="pod"
			onClose={(reason) => {
				onPodClose(reason);
				setPodOpen(false);
			}}
			trail={[{ title: 'Node', href: '#node' }]}
			onTrailSelect={onTrailSelect}
		>
			<Suspense fallback={<p>Loading</p>}>
				<Details suspends={suspends} onFormClose={onFormClose} />
			</Suspense>
		</Drawer>
	);
}

describe('Drawer with a drawer over it that a Suspense fallback hides', () => {
	it('stays open on a press until that drawer shows again, then asks it first', async () => {
		const onPodClose = vi.fn();
		const onFormClose = vi.fn();
		const page = (suspends: boolean) => (
			<LoadingDetailsPage suspends={suspends} onPodClose={onPodClose} onFormClose={onFormClose} />
		);
		const { rerender } = render(page(false));
		await waitForSettled();

		act(() => {
			rerender(page(true));
		});
		expect(screen.getByText('Loading')).toBeInTheDocument();

		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForSettled();

		expect(onPodClose).not.toHaveBeenCalled();
		expect(onFormClose).not.toHaveBeenCalled();

		act(() => {
			rerender(page(false));
		});
		await waitForSettled();
		await userEvent.click(screen.getByTestId('pod-close'));

		expect(onFormClose.mock.calls).toEqual([['close-press']]);
	});

	it('shows no earlier step on a crumb press until that drawer shows again', async () => {
		const onFormClose = vi.fn();
		const onTrailSelect = vi.fn();
		const page = (suspends: boolean) => (
			<LoadingDetailsPage
				suspends={suspends}
				onPodClose={() => {}}
				onFormClose={onFormClose}
				onTrailSelect={onTrailSelect}
			/>
		);
		const { rerender } = render(page(false));
		await waitForSettled();

		act(() => {
			rerender(page(true));
		});
		await userEvent.click(screen.getByRole('link', { name: 'Node' }));
		await waitForSettled();

		expect(onTrailSelect).not.toHaveBeenCalled();
		expect(onFormClose).not.toHaveBeenCalled();
	});
});
