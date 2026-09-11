import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button pointer interaction', () => {
	it('calls onClick with the button as the event target', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onClick={onClick}>
				Click me
			</Button>,
		);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick.mock.calls[0]?.[0].target).toBe(button);
	});

	it('calls onClick once per click', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onClick={onClick}>
				Click me
			</Button>,
		);

		const button = screen.getByRole('button');
		await user.click(button);
		await user.click(button);
		await user.click(button);

		expect(onClick).toHaveBeenCalledTimes(3);
	});

	it('calls onDoubleClick once and onClick twice on a double click', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onDoubleClick = vi.fn();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				onClick={onClick}
				onDoubleClick={onDoubleClick}
			>
				Double
			</Button>,
		);

		await user.dblClick(screen.getByRole('button'));

		expect(onDoubleClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it('does not activate on hover alone', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onClick={onClick}>
				Hover me
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('Button keyboard interaction', () => {
	it('activates on Enter', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onClick={onClick}>
				Save
			</Button>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('activates on Space', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onClick={onClick}>
				Save
			</Button>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('[Space]');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('forwards onKeyDown and onKeyUp with the pressed key', async () => {
		const user = userEvent.setup();
		const onKeyDown = vi.fn();
		const onKeyUp = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
				Save
			</Button>,
		);

		screen.getByRole('button').focus();
		await user.keyboard('{Escape}');

		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onKeyDown.mock.calls[0]?.[0].key).toBe('Escape');
		expect(onKeyUp).toHaveBeenCalledTimes(1);
	});
});

describe('Button focus', () => {
	it('is reachable by Tab', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary">
				Save
			</Button>,
		);

		await user.tab();

		expect(screen.getByRole('button')).toHaveFocus();
	});

	it('is skipped by Tab when tabIndex is -1', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Button size="md" variant="solid" color="primary" tabIndex={-1}>
					Skipped
				</Button>
				<input data-testid="input" />
			</>,
		);

		await user.tab();

		expect(screen.getByTestId('input')).toHaveFocus();
	});

	it('takes focus on mount with autoFocus', () => {
		render(
			// eslint-disable-next-line jsx-a11y/no-autofocus -- the prop is what this test covers
			<Button size="md" variant="solid" color="primary" autoFocus>
				Save
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveFocus();
	});
});
