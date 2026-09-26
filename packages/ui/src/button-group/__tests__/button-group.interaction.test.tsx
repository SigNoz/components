import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import { BASE, MANY_ITEMS, noop, renderInFrame } from './button-group.test-utils.js';

describe('ButtonGroup interaction', () => {
	it('calls the pressed member onClick', async () => {
		const user = userEvent.setup();
		const onDay = vi.fn();
		const onWeek = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'day', label: 'Day', onClick: onDay },
					{ value: 'week', label: 'Week', onClick: onWeek },
				]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Week' }));

		expect(onWeek).toHaveBeenCalledOnce();
		expect(onDay).not.toHaveBeenCalled();
	});

	it('activates a member with Enter', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<ButtonGroup {...BASE} items={[{ value: 'day', label: 'Day', onClick }]} />);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Day' })).toHaveFocus();

		await user.keyboard('{Enter}');
		expect(onClick).toHaveBeenCalledOnce();
	});

	it('blocks every member while the group is disabled, and keeps them focusable', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip="Read only"
				items={[
					{ value: 'day', label: 'Day', onClick },
					{ value: 'week', label: 'Week', onClick },
				]}
			/>,
		);

		for (const button of screen.getAllByRole('button')) {
			expect(button).toHaveAttribute('aria-disabled', 'true');
			await user.click(button);
		}

		expect(onClick).not.toHaveBeenCalled();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Day' })).toHaveFocus();
	});

	it('blocks only the disabled member', async () => {
		const user = userEvent.setup();
		const onDay = vi.fn();
		const onWeek = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'day', label: 'Day', onClick: onDay, disabled: true, disabledTooltip: 'Nope' },
					{ value: 'week', label: 'Week', onClick: onWeek },
				]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Day' }));
		await user.click(screen.getByRole('button', { name: 'Week' }));

		expect(onDay).not.toHaveBeenCalled();
		expect(onWeek).toHaveBeenCalledOnce();
	});

	it('marks every member busy and blocks it while the group is loading', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<ButtonGroup {...BASE} loading items={[{ value: 'day', label: 'Day', onClick }]} />);

		const button = screen.getByRole('button', { name: 'Day' });
		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(button).toHaveAttribute('aria-disabled', 'true');

		await user.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('marks only the loading member busy', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'day', label: 'Day', onClick: noop, loading: true, loadingTooltip: undefined },
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-busy', 'true');
		expect(screen.getByRole('button', { name: 'Week' })).not.toHaveAttribute('aria-busy');
	});
});

describe('ButtonGroup keeps focus', () => {
	it('keeps an icon member mounted when it starts loading', async () => {
		function Harness(): ReactElement {
			const [loading, setLoading] = useState(false);

			return (
				<ButtonGroup
					{...BASE}
					items={[
						{
							value: 'refresh',
							icon: <svg />,
							ariaLabel: 'Refresh',
							loading,
							loadingTooltip: 'Refreshing',
							onClick: () => setLoading(true),
						},
					]}
				/>
			);
		}

		const user = userEvent.setup();
		render(<Harness />);

		const button = screen.getByRole('button', { name: 'Refresh' });
		await user.click(button);

		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(button).toBeInTheDocument();
		expect(button).toHaveFocus();
	});

	it('keeps a text member mounted when it is disabled with a reason, in hidden mode', () => {
		const { rerender } = render(
			<ButtonGroup
				{...BASE}
				textOverflow="hidden"
				items={[{ value: 'day', label: 'Day', onClick: noop }]}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Day' });
		act(() => button.focus());

		rerender(
			<ButtonGroup
				{...BASE}
				textOverflow="hidden"
				items={[
					{ value: 'day', label: 'Day', onClick: noop, disabled: true, disabledTooltip: 'Nope' },
				]}
			/>,
		);

		expect(button).toBeInTheDocument();
		expect(button).toHaveFocus();
	});

	it('keeps the ellipsis mounted when the group starts loading', async () => {
		// The types reject `disabledTooltip` without `disabled`, but this is the prop set that makes
		// the ellipsis swap its menu tooltip for `false` once loading starts.
		const props = { ...BASE, items: MANY_ITEMS, disabledTooltip: 'Read only', testId: 'group' };
		const { rerender } = renderInFrame(<ButtonGroup {...props} loading={false} />, { size: 300 });

		const overflow = await screen.findByTestId('group-overflow');
		act(() => overflow.focus());

		rerender(<ButtonGroup {...props} loading />);

		expect(overflow).toBeInTheDocument();
		expect(overflow).toHaveFocus();
	});
});
