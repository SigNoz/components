import { isInaccessible, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../skeleton.js';

interface PartCase {
	name: string;
	ui: (extra?: object) => ReactElement;
}

const parts: PartCase[] = [
	{ name: 'Skeleton', ui: (extra) => <Skeleton testId="part" {...extra} /> },
	{
		name: 'Skeleton.Input',
		ui: (extra) => <Skeleton.Input size="md" testId="part" {...extra} />,
	},
	{
		name: 'Skeleton.Button',
		ui: (extra) => <Skeleton.Button size="md" testId="part" {...extra} />,
	},
	{
		name: 'Skeleton.Avatar',
		ui: (extra) => <Skeleton.Avatar size="md" testId="part" {...extra} />,
	},
];

const exposedRoles = [
	'group',
	'img',
	'none',
	'presentation',
	'progressbar',
	'status',
	'region',
	'article',
];

function accessibleTags(container: HTMLElement): string[] {
	return [...container.querySelectorAll('*')]
		.filter((element) => !isInaccessible(element))
		.map((element) => element.tagName);
}

describe.each(parts)('$name accessibility', ({ ui }) => {
	it('is hidden from assistive technology', () => {
		render(ui());
		const element = screen.getByTestId('part');

		expect(element).toHaveAttribute('aria-hidden', 'true');
		expect(isInaccessible(element)).toBe(true);
	});

	it('stays hidden without the shimmer', () => {
		render(ui({ active: false }));

		expect(screen.getByTestId('part')).toHaveAttribute('aria-hidden', 'true');
	});

	it('keeps aria-hidden true when a caller aria-hidden gets past the types', () => {
		render(ui({ ...({ 'aria-hidden': 'false' } as object) }));

		expect(screen.getByTestId('part')).toHaveAttribute('aria-hidden', 'true');
	});

	it('keeps aria-hidden true when a caller aria-hidden is the boolean false', () => {
		render(ui({ ...({ 'aria-hidden': false } as object) }));

		expect(screen.getByTestId('part')).toHaveAttribute('aria-hidden', 'true');
	});

	it('is not focusable', async () => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">before</button>
				{ui()}
				<button type="button">after</button>
			</>,
		);
		const element = screen.getByTestId('part');

		expect(element).not.toHaveAttribute('tabindex');

		element.focus();
		expect(element).not.toHaveFocus();

		screen.getByRole('button', { name: 'before' }).focus();
		await user.tab();

		expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
	});

	it('exposes nothing to a role query', () => {
		render(
			<>
				{ui()}
				<button type="button">Save</button>
			</>,
		);

		expect(screen.getByTestId('part')).toBeInTheDocument();
		expect(screen.getAllByRole('button')).toHaveLength(1);
		for (const role of exposedRoles) {
			expect(screen.queryAllByRole(role)).toEqual([]);
		}
	});

	it('leaves only the control beside it in the accessibility tree', () => {
		const { container } = render(
			<>
				{ui()}
				<button type="button">Save</button>
			</>,
		);

		expect(accessibleTags(container)).toEqual(['BUTTON']);
	});
});

describe('Skeleton accessibility tree', () => {
	it('hides the title, the paragraph and every row with the root', () => {
		render(<Skeleton testId="card" />);

		expect(isInaccessible(screen.getByTestId('card-title'))).toBe(true);
		expect(isInaccessible(screen.getByTestId('card-paragraph'))).toBe(true);
		expect(isInaccessible(screen.getByTestId('card-row-0'))).toBe(true);
		expect(isInaccessible(screen.getByTestId('card-row-1'))).toBe(true);
		expect(isInaccessible(screen.getByTestId('card-row-2'))).toBe(true);
	});

	it('exposes no role for the root, the title or the rows', () => {
		const { container } = render(<Skeleton testId="card" />);

		expect(accessibleTags(container)).toEqual([]);
		for (const role of exposedRoles) {
			expect(screen.queryAllByRole(role)).toEqual([]);
		}
	});

	it('keeps a placeholder composition out of the tree', () => {
		const { container } = render(
			<main aria-busy="true">
				<Skeleton.Avatar size="md" />
				<Skeleton paragraph={{ rows: 2 }} />
				<Skeleton.Input size="md" />
				<Skeleton.Button size="sm" />
			</main>,
		);

		expect(accessibleTags(container)).toEqual(['MAIN']);
		expect(screen.getAllByRole('main')).toHaveLength(1);
	});

	it('does not set a role or a live region of its own', () => {
		const { container } = render(<Skeleton testId="card" />);

		expect(container.querySelectorAll('[role]')).toHaveLength(0);
		expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
		expect(container.querySelectorAll('[aria-busy]')).toHaveLength(0);
	});
});
