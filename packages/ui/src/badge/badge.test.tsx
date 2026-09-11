import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { mockLabelMeasurement, resetLabelMeasurement, truncate } from '../__tests__/test-utils.js';
import { Badge } from './index.js';

describe('Badge rendering', () => {
	it('renders its children', () => {
		render(
			<Badge variant="solid" color="primary">
				Active
			</Badge>,
		);

		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('mirrors variant and color as data attributes', () => {
		render(
			<Badge variant="outlined" color="danger">
				Error
			</Badge>,
		);

		expect(screen.getByText('Error').closest('[data-slot="badge"]')).toHaveAttribute(
			'data-variant',
			'outlined',
		);
		expect(screen.getByText('Error').closest('[data-slot="badge"]')).toHaveAttribute(
			'data-color',
			'danger',
		);
	});

	it('defaults textTransform to uppercase', () => {
		render(
			<Badge variant="solid" color="primary">
				Active
			</Badge>,
		);

		expect(screen.getByText('Active').closest('[data-slot="badge"]')).toHaveAttribute(
			'data-text-transform',
			'uppercase',
		);
	});

	it('mirrors a custom textTransform', () => {
		render(
			<Badge variant="solid" color="primary" textTransform="lowercase">
				Active
			</Badge>,
		);

		expect(screen.getByText('Active').closest('[data-slot="badge"]')).toHaveAttribute(
			'data-text-transform',
			'lowercase',
		);
	});

	it('forwards testId as data-testid', () => {
		render(
			<Badge variant="solid" color="primary" testId="status-badge">
				Active
			</Badge>,
		);

		expect(screen.getByTestId('status-badge')).toBeInTheDocument();
	});
});

describe('Badge width', () => {
	it('maps width to the width custom property', () => {
		render(
			<Badge variant="solid" color="primary" width="10rem">
				Active
			</Badge>,
		);

		expect(
			screen
				.getByText('Active')
				.closest<HTMLElement>('[data-slot="badge"]')
				?.style.getPropertyValue('--badge-internal-width'),
		).toBe('10rem');
	});

	it('maps maxWidth to the max-width custom property', () => {
		render(
			<Badge variant="solid" color="primary" maxWidth="20rem">
				Active
			</Badge>,
		);

		expect(
			screen
				.getByText('Active')
				.closest<HTMLElement>('[data-slot="badge"]')
				?.style.getPropertyValue('--badge-internal-max-width'),
		).toBe('20rem');
	});

	it('writes a number as px, custom properties get no unit from React', () => {
		render(
			<Badge variant="solid" color="primary" width={120} maxWidth={240}>
				Active
			</Badge>,
		);

		const { style } = screen.getByText('Active').closest('[data-slot="badge"]') as HTMLElement;
		expect(style.getPropertyValue('--badge-internal-width')).toBe('120px');
		expect(style.getPropertyValue('--badge-internal-max-width')).toBe('240px');
	});

	it('leaves both custom properties unset by default, so the size tokens win', () => {
		render(
			<Badge variant="solid" color="primary">
				Active
			</Badge>,
		);

		const { style } = screen.getByText('Active').closest('[data-slot="badge"]') as HTMLElement;
		expect(style.getPropertyValue('--badge-internal-width')).toBe('');
		expect(style.getPropertyValue('--badge-internal-max-width')).toBe('');
	});

	it('keeps the caller style alongside the custom properties', () => {
		render(
			<Badge variant="solid" color="primary" width="10rem" style={{ marginTop: '4px' }}>
				Active
			</Badge>,
		);

		const badge = screen.getByText('Active').closest('[data-slot="badge"]') as HTMLElement;
		expect(badge).toHaveStyle({ marginTop: '4px' });
		expect(badge.style.getPropertyValue('--badge-internal-width')).toBe('10rem');
	});
});

const LABEL = 'kubernetes-deployment-production-east-us-2';

beforeAll(() => mockLabelMeasurement('badge-label'));
afterEach(resetLabelMeasurement);

describe('Badge overflow tooltip', () => {
	it('shows the full content on hover once it is truncated', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Badge variant="solid" color="primary">
				{LABEL}
			</Badge>,
		);

		await user.hover(screen.getByText(LABEL));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LABEL);
	});

	it('marks the badge as truncated', () => {
		truncate();
		render(
			<Badge variant="solid" color="primary" testId="badge">
				{LABEL}
			</Badge>,
		);

		expect(screen.getByTestId('badge')).toHaveAttribute('data-truncated', 'true');
	});

	it('renders nothing extra while the content fits', async () => {
		const user = userEvent.setup();
		render(
			<Badge variant="solid" color="primary">
				Short
			</Badge>,
		);

		await user.hover(screen.getByText('Short'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('opts out of the tooltip entirely with textOverflow="none"', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Badge variant="solid" color="primary" textOverflow="none">
				{LABEL}
			</Badge>,
		);

		await user.hover(screen.getByText(LABEL));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
