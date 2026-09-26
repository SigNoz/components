import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button icon mode', () => {
	it('marks itself with data-icon so the square padding tokens apply', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-icon', 'true');
	});

	it('renders the children into the prefix slot, so the loading swap works on them', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		const slot = document.querySelector('[data-slot="button-prefix-slot"]');
		expect(slot).toContainElement(screen.getByTestId('icon'));
	});

	it('renders neither a label slot nor a suffix slot', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-label"]')).toBeNull();
		expect(document.querySelector('[data-slot="button-suffix-slot"]')).toBeNull();
	});

	it('keeps the prefix wrapper open, the icon is the only content', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toHaveAttribute(
			'data-empty',
			'false',
		);
	});

	it('takes its accessible name from aria-label, having no text of its own', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star this dashboard">
				<span data-testid="icon" />
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAccessibleName('Star this dashboard');
	});

	it('still clicks like any other button', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star" onClick={onClick}>
				<span data-testid="icon" />
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('swaps to the spinner and stops responding while loading', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				icon
				loading
				aria-label="Star"
				onClick={onClick}
			>
				<span data-testid="icon" />
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onClick).not.toHaveBeenCalled();
		expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
		expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
	});
});
