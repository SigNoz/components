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

describe('Button icon mode size', () => {
	const squares = [
		['sm', 24],
		['md', 32],
	] as const;

	function Icon() {
		return <svg aria-hidden="true" viewBox="0 0 16 16" />;
	}

	it.each(squares)(
		'holds its %s square in a row that hands down --button-flex-shrink: 1',
		(size, square) => {
			render(
				<div style={{ display: 'flex', width: 10, ['--button-flex-shrink' as string]: 1 }}>
					<Button size={size} variant="solid" color="primary" icon aria-label="Star">
						<Icon />
					</Button>
				</div>,
			);

			expect(screen.getByRole('button').getBoundingClientRect().width).toBe(square);
		},
	);

	it.each(squares)('holds its %s square against a consumer flex: 1 1 0', (size, square) => {
		render(
			<>
				<style>{'.squeeze > * { flex: 1 1 0; }'}</style>
				<div className="squeeze" style={{ display: 'flex', width: 10 }}>
					<Button size={size} variant="solid" color="primary" icon aria-label="Star">
						<Icon />
					</Button>
				</div>
			</>,
		);

		expect(screen.getByRole('button').getBoundingClientRect().width).toBe(square);
	});

	it.each(squares)('holds its %s height in a flex column shorter than it', (size, square) => {
		render(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: 10,
					['--button-flex-shrink' as string]: 1,
				}}
			>
				<Button size={size} variant="solid" color="primary" icon aria-label="Star">
					<Icon />
				</Button>
			</div>,
		);

		expect(screen.getByRole('button').getBoundingClientRect().height).toBe(square);
	});

	it('still takes a width or maxWidth below its square', () => {
		render(
			<div style={{ display: 'flex', gap: 4 }}>
				<Button size="md" variant="solid" color="primary" icon aria-label="Star" width={20}>
					<Icon />
				</Button>
				<Button size="md" variant="solid" color="primary" icon aria-label="Pin" maxWidth={16}>
					<Icon />
				</Button>
			</div>,
		);

		expect(screen.getByRole('button', { name: 'Star' }).getBoundingClientRect().width).toBe(20);
		expect(screen.getByRole('button', { name: 'Pin' }).getBoundingClientRect().width).toBe(16);
	});

	it('holds a link icon at its content width in a container narrower than it', () => {
		render(
			<>
				<div style={{ display: 'flex' }}>
					<Button size="md" variant="link" color="primary" icon aria-label="Roomy">
						<Icon />
					</Button>
				</div>
				<div style={{ display: 'flex', width: 4, ['--button-flex-shrink' as string]: 1 }}>
					<Button size="md" variant="link" color="primary" icon aria-label="Narrow">
						<Icon />
					</Button>
				</div>
			</>,
		);

		const roomy = screen.getByRole('button', { name: 'Roomy' }).getBoundingClientRect().width;
		expect(roomy).toBeGreaterThan(4);
		expect(screen.getByRole('button', { name: 'Narrow' }).getBoundingClientRect().width).toBe(
			roomy,
		);
	});
});
