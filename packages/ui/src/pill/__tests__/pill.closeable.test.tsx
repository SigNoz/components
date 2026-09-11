import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pill } from '../pill.js';

describe('Pill.Closeable rendering', () => {
	it('renders the body and the close button', () => {
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		expect(screen.getByRole('button', { name: 'env:prod' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Remove env:prod' })).toBeInTheDocument();
	});

	it('keeps the close button out of the body accessible name', () => {
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		expect(screen.getByRole('button', { name: 'env:prod' })).toHaveAccessibleName('env:prod');
	});

	it('names the close button "Remove" when the children are not a string', () => {
		render(
			<Pill.Closeable onClose={vi.fn()}>
				<span>env:prod</span>
			</Pill.Closeable>,
		);

		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
	});

	it('names the body by its label even when the children are not a string', () => {
		render(
			<Pill.Closeable onClose={vi.fn()}>
				<span>env:prod</span>
			</Pill.Closeable>,
		);

		expect(screen.getByRole('button', { name: 'env:prod' })).toHaveAccessibleName('env:prod');
	});

	it('takes closeAriaLabel over the derived name', () => {
		render(
			<Pill.Closeable onClose={vi.fn()} closeAriaLabel="Remove the environment filter">
				env:prod
			</Pill.Closeable>,
		);

		expect(
			screen.getByRole('button', { name: 'Remove the environment filter' }),
		).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Remove env:prod' })).not.toBeInTheDocument();
	});

	it('exposes the close button as an enabled button of type button', () => {
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		const close = screen.getByRole('button', { name: 'Remove env:prod' });
		expect(close.tagName).toBe('BUTTON');
		expect(close).toHaveAttribute('type', 'button');
		expect(close).toBeEnabled();
	});

	it('stamps data-slot="pill" on the body and data-slot="pill-close" on the close button', () => {
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		expect(screen.getByRole('button', { name: 'env:prod' })).toHaveAttribute('data-slot', 'pill');
		expect(screen.getByRole('button', { name: 'Remove env:prod' })).toHaveAttribute(
			'data-slot',
			'pill-close',
		);
	});

	it('renders nothing for empty children, the close icon included', () => {
		const { container } = render(<Pill.Closeable onClose={vi.fn()}>{null}</Pill.Closeable>);

		expect(container).toBeEmptyDOMElement();
	});

	it('puts testId on the body, not the close button', () => {
		render(
			<Pill.Closeable onClose={vi.fn()} testId="filter-pill">
				env:prod
			</Pill.Closeable>,
		);

		expect(screen.getByTestId('filter-pill')).toHaveAttribute('data-slot', 'pill');
	});

	it('keeps the component class next to a custom className', () => {
		render(
			<Pill.Closeable onClose={vi.fn()} className="custom-class">
				env:prod
			</Pill.Closeable>,
		);

		const body = screen.getByRole('button', { name: 'env:prod' });
		expect(body).toHaveClass('custom-class');
		expect(body.className.split(' ').length).toBeGreaterThan(1);
	});
});

describe('Pill.Closeable close vs click', () => {
	it('closing does not fire onClick, and clicking the body does not fire onClose', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={onClose}>
				env:prod
			</Pill.Closeable>,
		);

		await user.click(screen.getByRole('button', { name: 'Remove env:prod' }));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: 'env:prod' }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('Pill.Closeable keyboard', () => {
	it.each(['{Enter}', '[Space]'])('the close button activates on %s', async (key) => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={onClose}>
				env:prod
			</Pill.Closeable>,
		);

		screen.getByRole('button', { name: 'Remove env:prod' }).focus();
		await user.keyboard(key);

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
	});

	it.each(['{Enter}', '[Space]'])('the body activates on %s', async (key) => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={onClose}>
				env:prod
			</Pill.Closeable>,
		);

		screen.getByRole('button', { name: 'env:prod' }).focus();
		await user.keyboard(key);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClose).not.toHaveBeenCalled();
	});

	it.each(['{Backspace}', '{Delete}'])('the body removes the chip on %s', async (key) => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={onClose}>
				env:prod
			</Pill.Closeable>,
		);

		screen.getByRole('button', { name: 'env:prod' }).focus();
		await user.keyboard(key);

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
	});

	it.each(['{Backspace}', '{Delete}'])('does not remove a disabled chip on %s', async (key) => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Pill.Closeable onClose={onClose} disabled>
				env:prod
			</Pill.Closeable>,
		);

		screen.getByRole('button', { name: 'env:prod' }).focus();
		await user.keyboard(key);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('ignores keydowns that bubble up from the close button', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Pill.Closeable onClick={onClick} onClose={vi.fn()}>
				env:prod
			</Pill.Closeable>,
		);

		screen.getByRole('button', { name: 'Remove env:prod' }).focus();
		await user.keyboard('{Enter}');

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('Pill.Closeable focus', () => {
	it('has two independent focus stops', async () => {
		const user = userEvent.setup();
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		await user.tab();
		expect(screen.getByRole('button', { name: 'env:prod' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Remove env:prod' })).toHaveFocus();
	});
});
