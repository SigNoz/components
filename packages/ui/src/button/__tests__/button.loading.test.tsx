import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button loading state', () => {
	it('announces itself as busy and unavailable', () => {
		render(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(button).toHaveAttribute('aria-disabled', 'true');
	});

	it('never sets the native disabled attribute, so the click does not throw focus away', () => {
		render(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toBeEnabled();
		button.focus();
		expect(button).toHaveFocus();
	});

	it('keeps aria-busy off while idle', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Save
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).not.toHaveAttribute('aria-busy');
		expect(button).toHaveAttribute('aria-disabled', 'false');
	});

	it('keeps the label as the accessible name while busy', () => {
		render(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAccessibleName('Saving…');
	});
});

describe('Button loading spinner', () => {
	it('hides the spinner from screen readers, aria-busy already says it', () => {
		render(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);

		const slot = document.querySelector('[data-slot="button-prefix-loading"]');
		expect(slot).toHaveAttribute('aria-hidden', 'true');
		expect(slot).toContainElement(document.querySelector('[data-slot="spinner"]'));
	});

	it('keeps the spinner mounted while idle, the swap is a css cross-fade', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Save
			</Button>,
		);

		expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
	});

	it('keeps the prefix and suffix mounted next to the spinner', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading
				prefix={<span data-testid="prefix" />}
				suffix={<span data-testid="suffix" />}
			>
				Saving…
			</Button>,
		);

		expect(screen.getByTestId('prefix')).toBeInTheDocument();
		expect(screen.getByTestId('suffix')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
	});

	it('leaves the prefix wrapper collapsed when there is no prefix to make room for', () => {
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);
		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toHaveAttribute(
			'data-empty',
			'true',
		);

		rerender(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading
				prefix={<span data-testid="prefix" />}
			>
				Saving…
			</Button>,
		);
		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toHaveAttribute(
			'data-empty',
			'false',
		);
	});
});

describe('Button loading activation', () => {
	it('swallows clicks and double clicks', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onDoubleClick = vi.fn();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				loading
				onClick={onClick}
				onDoubleClick={onDoubleClick}
			>
				Saving…
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
			<Button size="md" variant="solid" color="primary" loading onClick={onClick}>
				Saving…
			</Button>,
		);

		screen.getByRole('button').focus();
		await user.keyboard(key);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('accepts clicks again once loading ends', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" loading onClick={onClick}>
				Saving…
			</Button>,
		);

		await user.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();

		rerender(
			<Button size="md" variant="solid" color="primary" loading={false} onClick={onClick}>
				Save
			</Button>,
		);

		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('keeps the focus it already had when loading starts and ends', () => {
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary">
				Save
			</Button>,
		);
		const button = screen.getByRole('button');
		button.focus();

		rerender(
			<Button size="md" variant="solid" color="primary" loading>
				Saving…
			</Button>,
		);
		expect(button).toHaveFocus();

		rerender(
			<Button size="md" variant="solid" color="primary">
				Save
			</Button>,
		);
		expect(button).toHaveFocus();
	});
});
