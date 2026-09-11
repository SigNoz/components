import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button disabled state', () => {
	it('marks itself unavailable through aria-disabled instead of the native attribute', () => {
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={undefined}>
				Delete
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).toBeEnabled();
	});

	it('stays focusable and tabbable, so the reason for it stays reachable', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={undefined}>
				Delete
			</Button>,
		);

		await user.tab();

		expect(screen.getByRole('button')).toHaveFocus();
	});

	it('swallows clicks and double clicks', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onDoubleClick = vi.fn();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={undefined}
				onClick={onClick}
				onDoubleClick={onDoubleClick}
			>
				Delete
			</Button>,
		);

		const button = screen.getByRole('button');
		await user.click(button);
		await user.dblClick(button);

		expect(onClick).not.toHaveBeenCalled();
		expect(onDoubleClick).not.toHaveBeenCalled();
	});

	it.each(['{Enter}', '[Space]'])('swallows %s', async (key) => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={undefined}
				onClick={onClick}
			>
				Delete
			</Button>,
		);

		screen.getByRole('button').focus();
		await user.keyboard(key);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not claim to be busy', () => {
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={undefined}>
				Delete
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
	});

	it('accepts clicks again once it is enabled', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const { rerender } = render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={undefined}
				onClick={onClick}
			>
				Delete
			</Button>,
		);

		await user.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled={false}
				disabledTooltip={undefined}
				onClick={onClick}
			>
				Delete
			</Button>,
		);

		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
