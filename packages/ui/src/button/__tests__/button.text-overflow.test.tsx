import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';

beforeAll(() => mockLabelMeasurement('button-label'));
afterEach(resetLabelMeasurement);

describe('Button textOverflow', () => {
	it('defaults to ellipsis', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it.each(['none', 'ellipsis'] as const)(
		'exposes textOverflow=%s as data-text-overflow',
		(textOverflow) => {
			render(
				<Button size="md" variant="solid" color="primary" textOverflow={textOverflow}>
					Label
				</Button>,
			);

			expect(screen.getByRole('button')).toHaveAttribute('data-text-overflow', textOverflow);
		},
	);

	it('gives the label its own slot to measure', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-label"]')).toHaveTextContent('Label');
	});

	it('has no label slot to measure on an icon button', () => {
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-label"]')).toBeNull();
	});
});

describe('Button truncation flag', () => {
	it('flags a label that does not fit', () => {
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				A very long destructive label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-truncated');
	});

	it('leaves a label that fits unflagged', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Short
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});

	it('ignores a one pixel overflow, which rounded measurements produce on their own', () => {
		resize(101, 100);
		render(
			<Button size="md" variant="solid" color="primary">
				Short
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});

	it('picks the flag up when the button is resized down', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				A very long destructive label
			</Button>,
		);
		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');

		resize(300, 100);

		expect(screen.getByRole('button')).toHaveAttribute('data-truncated');
	});

	it('drops the flag when the button is resized back up', () => {
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				A very long destructive label
			</Button>,
		);
		expect(screen.getByRole('button')).toHaveAttribute('data-truncated');

		resize(300, 300);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});

	it('keeps measuring across repeated flips', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				A very long destructive label
			</Button>,
		);

		resize(300, 100);
		expect(screen.getByRole('button')).toHaveAttribute('data-truncated');

		resize(300, 300);
		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');

		resize(300, 100);
		expect(screen.getByRole('button')).toHaveAttribute('data-truncated');
	});

	it('re-measures when the label text changes at the same width', async () => {
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" width="12rem">
				Save
			</Button>,
		);
		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');

		truncate();
		rerender(
			<Button size="md" variant="solid" color="primary" width="12rem">
				Save every alert rule in this workspace
			</Button>,
		);

		await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-truncated'));
	});

	it('never flags textOverflow=none, which clips instead of truncating', () => {
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" textOverflow="none">
				A very long label
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});

	it('never flags an icon button, which has no label to truncate', () => {
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});
});
