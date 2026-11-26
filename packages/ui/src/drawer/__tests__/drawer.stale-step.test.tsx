import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerTrailStepType } from '../types.js';

const target = { title: 'Node', href: '#node' };

it.each([
	{ description: 'removed', next: [], selected: false },
	{
		description: 'replaced at the same index',
		next: [{ ...target, href: '#other' }],
		selected: false,
	},
	{ description: 'rebuilt with the same destination', next: [{ ...target }], selected: true },
])('rechecks a pending crumb when its destination is $description', async ({ next, selected }) => {
	const { promise, resolve } = Promise.withResolvers<void>();
	const decide = vi.fn(() => promise);
	const onSelect = vi.fn();
	const page = (trail: readonly DrawerTrailStepType[]) => (
		<Drawer
			type="inspector"
			stack="overlay"
			open
			title="Pod"
			onClose={() => {}}
			trail={trail}
			onTrailSelect={onSelect}
		>
			<Drawer type="inspector" stack="overlay" open title="Logs" onClose={decide}>
				Log details
			</Drawer>
		</Drawer>
	);
	const { rerender } = render(page([target]));
	await userEvent.click(await screen.findByRole('link', { name: 'Node' }));
	expect(decide).toHaveBeenCalledOnce();

	rerender(page(next));
	await act(async () => {
		resolve();
		await new Promise((done) => {
			setTimeout(done, 20);
		});
	});

	if (selected) {
		expect(onSelect).toHaveBeenCalledExactlyOnceWith(0, 'crumb-press');
	} else {
		expect(onSelect).not.toHaveBeenCalled();
	}
});
