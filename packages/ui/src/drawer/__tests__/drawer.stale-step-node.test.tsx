import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerTrailStepType } from '../types.js';

const titled = (name: string): DrawerTrailStepType => ({ title: <span>{name}</span> });
const linked = (to: string): DrawerTrailStepType => ({
	title: 'Node',
	render: <a href={to} onClick={() => {}} />,
});

it.each([
	{
		description: 'a JSX title, rebuilt',
		first: titled('Node'),
		next: titled('Node'),
		selected: true,
	},
	{
		description: 'an inline render, rebuilt',
		first: linked('/node'),
		next: linked('/node'),
		selected: true,
	},
	{
		description: 'a JSX title, replaced at the same index',
		first: titled('Node'),
		next: titled('Cluster'),
		selected: false,
	},
	{
		description: 'an inline render, replaced at the same index',
		first: linked('/node'),
		next: linked('/cluster'),
		selected: false,
	},
])('rechecks a pending crumb with no href and $description', async ({ first, next, selected }) => {
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
	const { rerender } = render(page([first]));
	// A crumb with no link is a button.
	const role = first.render === undefined ? 'button' : 'link';
	await userEvent.click(await screen.findByRole(role, { name: 'Node' }));
	expect(decide).toHaveBeenCalledOnce();

	rerender(page([next]));
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
