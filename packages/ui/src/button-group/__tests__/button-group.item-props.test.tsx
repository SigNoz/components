import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import { BASE, ITEMS, noop, renderInFrame, TOKENS } from './button-group.test-utils.js';

describe('ButtonGroup item double click', () => {
	it('runs the onDoubleClick of the member that is double clicked', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'day', label: 'Day', onClick: noop, onDoubleClick },
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Week' }));
		expect(onDoubleClick).not.toHaveBeenCalled();

		await user.dblClick(screen.getByRole('button', { name: 'Day' }));
		expect(onDoubleClick).toHaveBeenCalledOnce();
	});

	it('is blocked while the member is disabled, as onClick is', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();
		const onClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'day',
						label: 'Day',
						onClick,
						onDoubleClick,
						disabled: true,
						disabledTooltip: 'Nope',
					},
				]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Day' }));

		expect(onDoubleClick).not.toHaveBeenCalled();
		expect(onClick).not.toHaveBeenCalled();
	});

	it('is blocked while the group is disabled', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip="Read only"
				items={[{ value: 'day', label: 'Day', onClick: noop, onDoubleClick }]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Day' }));

		expect(onDoubleClick).not.toHaveBeenCalled();
	});

	it('is blocked while the group is loading', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				loading
				items={[{ value: 'day', label: 'Day', onClick: noop, onDoubleClick }]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Day' }));

		expect(onDoubleClick).not.toHaveBeenCalled();
	});

	it('is blocked while the member is loading', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'day',
						label: 'Day',
						onClick: noop,
						onDoubleClick,
						loading: true,
						loadingTooltip: undefined,
					},
				]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Day' }));

		expect(onDoubleClick).not.toHaveBeenCalled();
	});

	it('reaches an icon member too', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'next', icon: <svg />, 'aria-label': 'Next', onClick: noop, onDoubleClick },
				]}
			/>,
		);

		await user.dblClick(screen.getByRole('button', { name: 'Next' }));

		expect(onDoubleClick).toHaveBeenCalledOnce();
	});
});

describe('ButtonGroup item focus and pointer handlers', () => {
	it('runs onFocus and onBlur as focus moves through the members', async () => {
		const user = userEvent.setup();
		const onFocus = vi.fn();
		const onBlur = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{ value: 'day', label: 'Day', onClick: noop, onFocus, onBlur },
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Day' })).toHaveFocus();
		expect(onFocus).toHaveBeenCalledOnce();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();
		expect(onFocus).toHaveBeenCalledOnce();
		expect(onBlur).toHaveBeenCalledOnce();
	});

	it('runs onFocus on a member the group disabled, which stays focusable', async () => {
		const user = userEvent.setup();
		const onFocus = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip="Read only"
				items={[{ value: 'day', label: 'Day', onClick: noop, onFocus }]}
			/>,
		);

		await user.tab();

		expect(screen.getByRole('button', { name: 'Day' })).toHaveFocus();
		expect(onFocus).toHaveBeenCalledOnce();
	});

	it('runs the mouse and key handlers of the member they happen on', async () => {
		const user = userEvent.setup();
		const onMouseEnter = vi.fn();
		const onMouseLeave = vi.fn();
		const onKeyDown = vi.fn();
		const onKeyUp = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'day',
						label: 'Day',
						onClick: noop,
						onMouseEnter,
						onMouseLeave,
						onKeyDown,
						onKeyUp,
					},
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Day' }));
		expect(onMouseEnter).toHaveBeenCalledOnce();

		await user.hover(screen.getByRole('button', { name: 'Week' }));
		expect(onMouseLeave).toHaveBeenCalledOnce();

		act(() => screen.getByRole('button', { name: 'Day' }).focus());
		await user.keyboard('a');
		expect(onKeyDown).toHaveBeenCalledOnce();
		expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'a' }));
		expect(onKeyUp).toHaveBeenCalledOnce();
	});
});

describe('ButtonGroup item attributes', () => {
	it('puts data-*, aria-*, id and tabIndex on the member', () => {
		render(
			<>
				<p id="hint">Last 24 hours</p>
				<ButtonGroup
					{...BASE}
					items={[
						{
							value: 'day',
							label: 'Day',
							onClick: noop,
							id: 'day-member',
							tabIndex: -1,
							'aria-describedby': 'hint',
							'data-owner': 'alerts',
						},
						{ value: 'week', label: 'Week', onClick: noop },
					]}
				/>
			</>,
		);

		const day = screen.getByRole('button', { name: 'Day' });
		expect(day).toHaveAttribute('id', 'day-member');
		expect(day).toHaveAttribute('tabindex', '-1');
		expect(day).toHaveAttribute('data-owner', 'alerts');
		expect(day).toHaveAccessibleDescription('Last 24 hours');

		const week = screen.getByRole('button', { name: 'Week' });
		expect(week).not.toHaveAttribute('data-owner');
		expect(week).not.toHaveAttribute('aria-describedby');
	});

	it('puts the aria-label of an icon member on it, as its name', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[{ value: 'next', icon: <svg />, 'aria-label': 'Next page', onClick: noop }]}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute(
			'aria-label',
			'Next page',
		);
	});

	it('puts the attributes of a link member on the anchor', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'docs',
						label: 'Docs',
						render: <a href="/docs" />,
						'data-owner': 'nav',
						'aria-describedby': 'hint',
					},
				]}
			/>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveAttribute('data-owner', 'nav');
		expect(link).toHaveAttribute('aria-describedby', 'hint');
	});
});

describe('ButtonGroup item type and form', () => {
	it('is a plain button unless the member says otherwise, so it never submits', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

		render(
			<form onSubmit={onSubmit}>
				<ButtonGroup {...BASE} items={[{ value: 'day', label: 'Day', onClick: noop }]} />
			</form>,
		);

		const button = screen.getByRole('button', { name: 'Day' });
		expect(button).toHaveAttribute('type', 'button');

		await user.click(button);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('submits the form around it with type="submit"', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const onClick = vi.fn();

		render(
			<form onSubmit={onSubmit}>
				<ButtonGroup
					{...BASE}
					items={[
						{ value: 'save', label: 'Save', type: 'submit', onClick },
						{ value: 'cancel', label: 'Cancel', onClick: noop },
					]}
				/>
			</form>,
		);

		const save = screen.getByRole('button', { name: 'Save' });
		expect(save).toHaveAttribute('type', 'submit');

		await user.click(screen.getByRole('button', { name: 'Cancel' }));
		expect(onSubmit).not.toHaveBeenCalled();

		await user.click(save);
		expect(onClick).toHaveBeenCalledOnce();
		expect(onSubmit).toHaveBeenCalledOnce();
	});

	it('submits the form it names with `form`, from outside it', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

		render(
			<>
				<form id="filters" onSubmit={onSubmit} />
				<ButtonGroup
					{...BASE}
					items={[
						{ value: 'apply', label: 'Apply', type: 'submit', form: 'filters', onClick: noop },
					]}
				/>
			</>,
		);

		await user.click(screen.getByRole('button', { name: 'Apply' }));

		expect(onSubmit).toHaveBeenCalledOnce();
	});
});

describe('ButtonGroup item layout props', () => {
	it('gives a member the width it asks for', () => {
		render(
			<div style={TOKENS}>
				<ButtonGroup
					{...BASE}
					items={[
						{ value: 'day', label: 'Day', onClick: noop, width: 200 },
						{ value: 'week', label: 'Week', onClick: noop },
					]}
				/>
			</div>,
		);

		expect(screen.getByRole('button', { name: 'Day' }).getBoundingClientRect().width).toBe(200);
		expect(screen.getByRole('button', { name: 'Week' }).getBoundingClientRect().width).toBeLessThan(
			120,
		);
	});

	// Fails today: `.button-group .button-group__item { max-width: var(--button-group-item-max-width,
	// none) }` outranks the `max-width` of `Button` that reads `--button-internal-max-width`.
	it('caps a member at its maxWidth', () => {
		render(
			<div style={TOKENS}>
				<ButtonGroup
					{...BASE}
					items={[
						{
							value: 'long',
							label: 'Everything in the last day',
							onClick: noop,
							maxWidth: 60,
						},
					]}
				/>
			</div>,
		);

		const button = screen.getByRole('button');
		expect(button.getBoundingClientRect().width).toBeLessThanOrEqual(60);
	});

	it('lets a member set its own textOverflow, over the group one', () => {
		render(
			<ButtonGroup
				{...BASE}
				textOverflow="ellipsis"
				items={[
					{ value: 'day', label: 'Day', onClick: noop, textOverflow: 'hidden' },
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute(
			'data-text-overflow',
			'hidden',
		);
		expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute(
			'data-text-overflow',
			'ellipsis',
		);
	});

	it('lets a member opt back into ellipsis in a hidden group', () => {
		render(
			<ButtonGroup
				{...BASE}
				textOverflow="hidden"
				items={[
					{ value: 'day', label: 'Day', onClick: noop, textOverflow: 'ellipsis' },
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute(
			'data-text-overflow',
			'ellipsis',
		);
		expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute(
			'data-text-overflow',
			'hidden',
		);
	});

	it('collapses a member wider than the group, whatever width it asks for', async () => {
		renderInFrame(
			<ButtonGroup
				{...BASE}
				testId="group"
				items={[{ value: 'wide', label: 'Wide', onClick: noop, width: 240 }, ...ITEMS]}
			/>,
			{ size: 200, style: TOKENS },
		);

		// 240px cannot fit in 200px, so the member collapses and the ellipsis stays alone. The first
		// measure can still show a member, so wait for the group to settle.
		await waitFor(() =>
			expect(screen.getByTestId('group-overflow')).toHaveAttribute('data-position', 'only'),
		);
	});
});
